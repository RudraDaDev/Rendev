# `lib/csui.js` — study notes

> 3,405 lines · 126 KB · pure ESM · zero dependencies · browser-only.
> Header calls it `ctrlScript` — "NativeScript-style web DOM wrapper". Everything is a thin,
> ergonomic wrapper over `document.createElement` + inline styles. No virtual DOM, no render
> pass, no build step. Import it, build elements, they're live in the DOM immediately.

---

## 1. The one idea to hold on to

```
new Widget(containerRef, props)   →   this.el = document.createElement(...)
                                  →   this._attachToContainer()   (appends to parent NOW)
                                  →   this.props = props          (inline styles + props map)
```

There is **no re-render**. Every setter mutates `this.el` right away. The `_props` object is a
*bookkeeping copy* of what you passed, not the source of truth — the DOM is.

So "learning csui" = learning (a) how `props` keys get routed, (b) how containers resolve,
(c) which of the ~60 exported helpers/components you can reuse.

---

## 2. `BaseElement` — the root of everything (L10–404)

| Piece | What it does |
|---|---|
| `this.el` | the real DOM node |
| `this.id` | debug id `el_0`, `el_1`, … (module counter, reset by `clearContainers()`) |
| `this._props` | shallow copy of props you set |
| `_pendingContainerIndex` | the `containerRef` until `_attachToContainer()` runs |
| `_mountCallbacks` / `_destroyCallbacks` | `onMount()` / `onDestroy()` hooks |
| `_mounted` | guard so mount fires once |

### 2.1 How a `props` object is routed (L26–84)

`set props(obj)` walks each key in this order:

```
pos / position (object)   → setPosition()              // { top, left, x, y, z, mode... }
fullPage|fullscreen|...   → width:100%; minHeight:100vh
name                      → el.dataset.name (+ el.id if empty)
children (array)          → addChild() each
on<Event> (function)      → addEventListener('event')
text / textContent        → el.textContent
html / innerHTML          → el.innerHTML
size                      → width + height together
rotation                  → transform: rotate(...)
src / href / alt          → property (or attribute fallback)
anything else             → setStyle(key, value)        // ← the catch-all
```

### 2.2 `setStyle()` = the css shorthand dictionary (L92–179)

`styleMap` translates terse keys to real CSS: `bg→backgroundColor`, `c→color`, `fs→fontSize`,
`jc→justifyContent`, `ai→alignItems`, `br→borderRadius`, `pos→position`, `z→zIndex`, `m→margin`,
`mt/mb/ml/mr`, `p/pt/pb/pl/pr`, `w/h`, `minW/maxW/minH/maxH`, `bs→boxShadow`, `ff→fontFamily`,
`lh→lineHeight`, `ta→textAlign`, `fd→flexDirection`, `d→display`, `o→opacity`, …

Numbers get `px` appended — but **only** for props in `_shouldAutoPx()` (L289–319: sizes, spacing,
fontSize, radius, offsets, gap, lineHeight). So `{ o: 0.5 }` stays `0.5`, `{ w: 200 }` becomes `200px`.

If `el.style[prop]` doesn't exist on the element, the value becomes an **attribute** instead —
that's how `Canvas.width`, `Input.type`-ish things and stray keys land.

### 2.3 Positioning (L255–288, L376)

`setPosition(cfg)` accepts `position | pos | type | mode | kind` for the position value
(default `'absolute'`), then maps `top/y → top`, `left/x → left`, `right`, `bottom`, `z/zIndex`.

```js
new Box('home', { pos: { y: 40, x: 20, z: 2 } })   // position:absolute; top:40px; left:20px; z-index:2
```

### 2.4 Children, mount, destroy (L181–210, L384–404)

* `addChild(child)` → `appendChild` + `child._triggerMount()`; accepts `BaseElement` or raw `HTMLElement`.
* `_triggerMount()` fires `onMount` callbacks in a **microtask** (`Promise.resolve().then`).
* `destroy()` runs `onDestroy` callbacks and removes `el` from the DOM. **It does not recurse into
  children and does not unregister named containers** — so a destroyed named `Box` still answers
  `new Text('thatName')`.
* `set shift(container)` = move this element to another parent.
* `_describe()` (L321) builds the pretty log line used by every debug message.

---

## 3. Containers — the part that trips everyone up (L6–8, L332–380, L494–545)

Two registries, both module-level arrays/objects:

```js
const containers = [];         // every Box ever created, in creation order
const containersByName = {};   // only Boxes created with a string as 1st arg
```

`_attachToContainer()` resolves the constructor's first argument:

| passed | behaviour |
|---|---|
| `"home"` (string) | look up `containersByName["home"]`, append inside it |
| `2` (number) | `containers[1]` — **1-based, legacy** |
| `null` (default) | auto-attach to the **active layer** (`App`, or the scene currently building); else single-container rule; else warn + stay orphaned |
| `false` | explicit detached container: registers but never looks for a parent (scene layers, overlays) |
| `BaseElement` | attach straight into that element — no name registration needed |

**Key consequence:** a `Box` created with a string name is a *named root*. It is pushed to
`containers`, registered in `containersByName`, and its own `_pendingContainerIndex` is nulled —
it does **not** nest inside another named box. Two named boxes are siblings in limbo until you
wire them with `app.addChild(...)` or `parent.addChild(...)`.

```js
const app = new App({ bg:'#0a0a0a', w:'100vw', h:'100vh' })   // App auto-appends itself to <body>
const left = new Box('lefte', { w: 550, bg:'#000' })          // named root, not in the DOM yet
const txt  = new Text('lefte', { text:'hi', fs: 50 })         // ✔ inside `left` (left is in DOM? no)
app.addChild(left)                                            // …now it actually shows
```

`App` (L740) is just `Box` + `document.body.appendChild` + body margin/padding/font reset. That's
why `me.js` / `web.js` start with `new App({...})` — it's the only node that self-mounts.

Helpers: `getContainer(ref)` (name or 1-based index), `listContainers()` →
`{ named, indexed }`, `clearContainers()` (wipes registries + `elementCounter`, **leaves DOM alone**),
`remove(el)`.

---

## 4. Constructor signature quirks (read before using a class)

The library is *not* uniform. Three families:

1. **Standard** — `new Text(ref, props)`. Most classes.
2. **Props-first** — nothing except `App(props)` and `Box(refOrProps)`; `Box` is the only one that
   detects "first arg is a plain object → treat as props".
3. **Extra leading arg** — `new Heading(level, ref, props)`, `new List(ordered, ref, props)`,
   `new TableCell(isHeader, ref, props)`. Passing props first silently mis-slots them.

`new Text({ text: 'x' })` therefore does **not** work: the object becomes a container ref, resolves
to nothing, and you get an orphaned empty `<span>` plus a console warning.

Also: `Circle`/`Square`/`Ellipse`/`Rectangle`/`Line` are **not** SVG or canvas — they're `div`s with
`border-radius`/backgrounds. Real vector work is the `Svg*` classes at the bottom.

---

## 5. Element catalogue (L406–1275)

* **Text-ish:** `Text` (span; alias `Label`), `Heading(level)`, `Paragraph`, `Span`, `Code`, `Pre`,
  `CodeBlock` (pre+code with a dark default theme, supports `codeProps`), `Link`, `ListItem`.
* **Box-ish:** `Box` (alias `Container`, `Div`), `Section`, `Article`, `Header`, `Footer`, `Nav`,
  `Form` (a `div` on purpose — no submit behaviour), `App`.
* **Forms:** `Input` (`value/placeholder/type`), `TextArea` (`value/placeholder/rows/cols`),
  `Select` (`addOption(v,t)`), `Checkbox`, `Radio`, `Button` (`text`).
* **Media:** `Image` (aspect-ratio bookkeeping in `_applyAspect`, L676–735), `Canvas`
  (`getContext`, `width/height` hit the canvas buffer, not CSS), `Video`, `Audio`, `Iframe`.
* **Shapes:** `Rectangle(w120 h80)`, `Square(size)` , `Circle(br 50%)`, `Ellipse(140×90)`,
  `Line(thickness)` — all `Shape` subclasses with grey `#d9d9d9` defaults.
* **Structure:** `Table`, `TableRow`, `TableCell`, `List`, `HR`, `BR`.

Every class repeats the same three lines in its constructor, so adding your own is trivial:

```js
export class Badge extends BaseElement {
  constructor(ref = null, props = {}) {
    super(ref);
    this.el = document.createElement('span');
    this._attachToContainer();
    if (Object.keys(props).length) this.props = props;
  }
}
```

---

## 6. Chainable style API (L1300–1381) — different from `props`

A prototype patch installs one-liner methods that write `el.style` **directly**, bypassing
`styleMap` and mostly bypassing the px heuristic:

```js
box.w(200).h(100).p(12).mx(8).bg('#111').c('#fff').br(8).d('flex').jc('center').center()
```

px-wrapped (`typeof v === 'number' ? v+'px' : v`): `w h p m mt mb ml mr pt pb pl pr br z fs fw ff
ta d bs cur`, plus `mx my px py`.
No px wrapping: `bg c o` → **`.o(0.5)` writes `opacity = "0.5px"`**, which the browser drops.
Use `{ o: 0.5 }` in props, or `el.style.opacity` directly, for opacity.

Read/write pair: `.x()` / `.y()` — no arg reads current offset, arg sets it and forces
`position:absolute`.
Other helpers: `.center()` (absolute 50/50 + translate; **clobbers any rotation**),
`.highlight(color)`, `.glass(opts)`, `.tooltip(text, opts)`, `.badge(count, opts)`,
`.contextMenu(items, opts)`, `.physics(opts)`.

> `props` and chaining do collide by name: `bg`, `c`, `p`, `w`… are both properties and methods on
> `BaseElement`. Instance properties shadow prototype methods, so if you do `box.w = 100` you lose
> `box.w()`. Prefer one style per element.

---

## 7. Layout, animation, game loop

**Layout (L1490–1537).** `Box.prototype.row(...children)` / `.col(...children)` set flex and
`appendChild` children — but they use the internal `_appendChildren()`, which **skips
`_triggerMount()`**, so `onMount` never fires for those children. Use `addChild()` if you need mount
hooks. `group(...children)` = `position:relative` wrapper for layering. `.move(x, y)` = translate.

**Animation (L1409–1485).** `el.animate({ opacity, x, y, scale, rotate, width, height,
backgroundColor, color }, ms, easing)` builds a CSS `transition`, then applies values after two
`requestAnimationFrame`s. Shorthands: `fadeIn/fadeOut/slideLeft/slideRight/slideUp/slideDown`.
Note this shadows the native `Element.animate()` name — it's a transition helper, not WAAPI.

**Game (L1539–1626).**
* `loop(fn)` → `{ stop() }`, calls `fn(dtMs)` every frame.
* `onKey('a', fn, { up })` — global `keydown`/`keyup` handlers keyed by lowercased `e.key`.
* `collides(a, b)` — AABB via `getBoundingClientRect`, accepts elements or `BaseElement`s.
* `scene(name, fn)` / `go(name)` — swaps a `[data-csui-scene]` wrapper inside `#app`.
  `go()` supports async scene loaders and `{ default() {} }` modules. ⚠️ It fakes a container with
  `BaseElement.call(fakeBox, null)` on an `Object.create(Box.prototype)` — **illegal in ES2015+
  class syntax**, it throws `TypeError: Class constructor BaseElement cannot be invoked without
  'new'` (verified). Treat `go()` as currently broken.
* `camera` — lazy `#_csui_cam` layer, `camera.x = 100` translates it.

---

## 8. Untyped-but-useful modules

| Module | Notes |
|---|---|
| `after(ms, fn)` / `every(ms, fn)` → `{stop()}` | `every` returns a handle, `after` returns a timer id |
| `save(key, val)` / `load(key, def)` | JSON over `localStorage`, try/catch'd |
| `ask(msg, def)` | `window.prompt` |
| `sound.load/play/stop/volume` | clone-per-play so sounds overlap |
| `particles.emit({x,y,count,color,size,duration,spread})` | CSS keyframe dots, self-cleaning |
| `engine2d.init/attach/addGround` | lazy-loads Matter.js from cdnjs, syncs DOM each frame |
| `router.define/go/back/forward` | `pushState` + `popstate`, `'*'` fallback |
| `device.location/vibrate/tilt/notify/clipboard` | thin browser-API wrappers |
| `csui.debug(on)` / `csui.strict(on)` / `csui.showError(msg)` | `window.onerror` → full-screen error overlay |
| `checkOverlap(a, b)` | `collides` + console warning with element names |
| `palette(base, { name, shades })` | HSL-derived Tailwind-ish scale, prints swatch table to console |

`engine2d` is the only piece that reaches the network at runtime (`cdnjs.cloudflare.com`).

---

## 9. UI components (§18, L1894–2735)

`DropdownMenu`, `Modal`, `toast()`, `Tabs`, `Slider`, `ProgressBar`, `Toggle`, `Accordion`,
`Drawer`, `Chip`, `Card`.

Conventions they share:
* style options are destructured out of `props` with defaults; **everything left over** is fed to
  `this.props` (so `w`, `pos`, `mt` still work).
* they build private sub-nodes (`this._btn`, `this._panel`, `this._fill`, `this._tabs`, …) and expose
  small imperative methods: `open()/close()/toggle()`, `show(index)`, `get()/set()/onChange()`,
  `addItem()/addTab()`.
* `Modal` and `Drawer` ignore the container ref entirely (`super(null)`, append to `document.body`) —
  they're viewport-level overlays. `this._triggerMount()` is called manually for them.
* `toast(msg, { type, duration, position })` is a pure function; `position` is
  `tl|tr|bl|br` and containers are cached per corner.

---

## 10. Extending it — `use()` (§19, L3077–3105)

```js
use({
  name: 'my-plugin',
  install({ BaseElement, Box, containers, containersByName, register, addProto }) {
    register('Pill', class extends BaseElement { /* ... */ });  // → ctrlscript.Pill
    addProto(BaseElement, 'pill', function () { return this; }); // → every element
  },
});
```

Duplicate names are skipped with a warning, so `use()` is idempotent.

---

## 11. Namespace & globals (§14, L3010–3405)

* `import { ctrlscript } from './csui.js'` / `import { CS } from './csui.js'` — one object with ~114
  entries (`ctrlscript` and `CS` are the same reference).
* At the very bottom the module does `Object.assign(globalThis, ctrlscript)` — **every class becomes
  a window global**, which is why `app.js` samples can omit imports. The IIFE comment block above it
  is unterminated, so the module ends without a trailing newline; it still parses fine
  (`node --check` OK).
* The Android-compat block (L3109+) mirrors an Android sibling library (`csua.js`): `ScrollBox`,
  `SafeArea`, `db`, `files`, `perm`, `keyboard`, `statusBar`, `navigationBar`, `share`, `dialog`,
  `background`, `onTouch/onSwipe/onPinch`, `stopLoop`, `cancel`, `clearAll`.
* `Svg`/`SvgGroup`/`SvgRect`/`SvgCircle`/`SvgEllipse`/`SvgLine`/`SvgPath`/`SvgPolygon`/
  `SvgPolyline`/`SvgText` — live `createElementNS`, `text` and `kebab-case` attr conversion
  (`strokeWidth → stroke-width`), no render pass.

---

## 12. Traps worth knowing (verified by running the module in jsdom)

| # | Trap | Detail |
|---|---|---|
| 1 | ~~`go(name)` throws~~ | **fixed** — scenes now build into a real detached `Box(false)` layer; old scene is torn down children-first so `onDestroy` fires |
| 2 | `Object.assign(ctrlscript, {...})` at L3388 overwrites | `Rectangle`/`Square`/`Circle` become `Box` subclasses; `TextArea` becomes `_CompatTextArea`; `List` becomes `_CompatList`; the real classes stay only as ESM exports. `ctrlscript.Rectangle !== Rectangle` |
| 3 | ~~`Sound` is broken~~ | **fixed** — `new window.Audio(src)`, so the src actually loads |
| 4 | `.o(x)` writes `opacity: Xpx` | chaining helper px-wraps everything except `bg`/`c` |
| 5 | `{ name: 'grp' }` doesn't name a form field | `props.name` → `dataset.name`; Radio/Checkbox `name` only works as a direct setter (`r.name = 'grp'`) |
| 6 | Chaining methods vs props | `box.bg('red')` (method) and `box.props = { bg:'red' }` both end up as `backgroundColor`, but the method skips `styleMap`/auto-px |
| 7 | `.center()` erases rotation | it assigns a whole `transform` string |
| 8 | Named boxes don't nest | they register themselves; wiring is manual via `addChild` |
| 9 | `clearContainers()` doesn't clean the DOM | resets `elementCounter` (ids get reused) and now also clears the active layer |
| 10 | Every *mounted* `Box` enters `containers` | compat `Rectangle`s included, so numeric indices shift; `Box(false)` deliberately stays out |
| 11 | `props` silently becomes a container ref | only `Box`/`App` sniff "first arg is a plain object" |
| 12 | `row()/col()` skip mount hooks | they bypass `addChild` |
| 13 | `Number` keys + `auto-px` | `{ lineHeight: 1.5 }` becomes `1.5px` — pass a string |
| 14 | `_props` is bookkeeping | setters like `.o()` don't update it; reads can be stale |
| 14b | `destroy()` only kills one node | it unregisters the name + index now, but children need their own `destroy()`; scene teardown handles the subtree |
| 15 | `new Image('ref', { size: 100 })` | aspect logic only snaps once `naturalWidth` is known, and only when one axis was given |
| 16 | Globals | importing the module mutates `globalThis`; `app` (compat object) shadows nothing but is easy to confuse with `App` |

---

## 13. Idiomatic usage, distilled

```js
import { App, Box, Text, Button, Image, toast, csui } from './lib/csui.js'

csui.debug(true)                       // dev only

const app = new App({                  // only node that self-mounts
  bg: '#0a0a0a', c: '#fff',
  w: '100vw', h: '100vh', pos: 'relative', overflow: 'hidden',
})

const sidebar = new Box('sidebar', {   // named root — children can target it by name
  w: 280, bg: '#111', pos: 'absolute', top: 0, left: 0,
  p: 16, d: 'flex', fd: 'column', gap: 12,
})

new Text('sidebar', { text: 'rendev', fs: 32, fw: 700, ff: "'Pixelify Sans', sans-serif" })

const btn = new Button('sidebar', { text: 'say hi', p: '8px 14px', br: 6, cursor: 'pointer' })
  .click(() => toast('hi 👋', { type: 'success' }))   // Button.prototype.click

app.addChild(sidebar)                  // ← don't forget this
```

Rules of thumb:

1. **One `App`, then named `Box`es**, and wire them with `addChild`.
2. **Props for static styling, chaining for quick tweaks** — don't mix on the same key.
3. **Children created with the parent's name are already attached** the moment they're constructed.
4. Prefer `addChild()` over `row()/col()` when you rely on `onMount`.
5. Reach for `clearContainers()` + a fresh `App` for full re-renders; `destroy()` is per-element only.
6. Read `this._props` as "what I asked for", `this.el.style` as "what happened".

---

## 14. What's missing for a v2 (matching the file's own TODO)

* README + API docs (this file is a start).
* ~~Fix `go()`~~ — done (detached layer + subtree teardown).
* Stop the compat `Object.assign` from clobbering public classes — namespace them or export separately.
* Fix `Sound` (`document.createElement('audio')` or `new window.Audio`).
* Unify the px heuristic: one function used by `setStyle`, chaining, and `setPosition`.
* `destroy()` should recurse into children and unregister names.
* Decide on one constructor contract (`(ref, props)` everywhere, or props-first everywhere).
* Gate `Object.assign(globalThis, …)` behind an explicit flag/entry point.
* No tests, no linter, no `package.json` in the repo at all — the entire app is 5 loose files.
