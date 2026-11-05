# csui syntax — how to *write* it

> Companion to `docs/csui.md` (which explains the internals). This one is the writing-side
> cheat sheet: the idioms, the mental model, and the traps that bite while authoring.
> Everything here was run against `lib/csui.js` in a DOM.

---

## 0. The mental model in five lines

```js
import { App, Box, Text } from './lib/csui.js'

const app  = new App({ w:'100vw', h:'100vh', bg:'#0a0a0a' })  // 1. one root, self-mounts
const card = new Box(app, { p: 20, br: 8 })                    // 2. containers take a *ref*
new Text(card, { text: 'hi', fs: 24, c: '#fff' })              // 3. everything else too
app.addChild(card)                                             // 4. only needed for named roots
toast('done')                                                  // 5. helpers are plain functions
```

* **Construction = mounting.** There is no `render()` and no diff. The moment you `new`
  something with a ref, its DOM node is in the tree.
* **First arg = where it goes.** `'name'` | `2` (1-based index) | a `BaseElement` | `null`
  (active layer) | `false` (detached, mount it yourself).
* **Second arg = props.** A flat object of styles, props, events, children. There is no third arg
  (except `Heading`/`List`/`TableCell`, which eat the first arg as a value — see §7).
* **Styles are inline.** `{ w: 200 }` → `style="width:200px"`. No CSS files, no class names.
* **`this.el` is always there** if you need the raw node.

---

## 1. Skeleton of a page

```js
import { App, Box, Text, csui } from './lib/csui.js'

csui.debug(true)                       // delete before shipping: error overlay + console noise

const app = new App({                  // <div id="app"> appended to <body>
  bg: '#0a0a0a', c: '#fff',
  ff: "'Geist Mono', monospace",
  w: '100vw', h: '100vh',
  pos: 'relative', overflow: 'hidden',
})
```

`App` also resets `body { margin:0; padding:0 }` and sets a font, and **becomes the active layer**,
so plain `new Text(null, {...})` mounts into it. Only create **one** `App`.

From here you have exactly two layout dialects — **pick one per element**:

```js
// (a) flow/flex: let the browser stack things
const col = new Box(app, { d: 'flex', fd: 'column', gap: 12, p: 24 })

// (b) absolute: place things by coordinates (what me.js does)
const ribbon = new Rectangle(app, { pos: 'absolute', top: -10, left: -90, w: 600, h: 90, rotation: 145 })
```

---

## 2. Props — the full vocabulary

```js
new Box(app, {
  // ── style shorthands (routed through setStyle) ──
  w: 200, h: 80,            // w/h/minW/maxW/minH/maxH   (numbers → px)
  p: '12px 16px', p: 12,    // p / pt pb pl pr / m mt mb ml mr
  bg: '#111', c: '#eee',    // background, text colour
  br: 8,                    // border-radius
  bs: '0 4px 20px #0006',   // box-shadow
  d: 'flex', fd: 'column', jc: 'center', ai: 'center', gap: 8,
  pos: 'absolute', z: 10, o: 0.9,
  fs: 14, fw: 700, ff: "'Pixelify Sans', sans-serif", lh: '1.5', ta: 'center',
  border: '1px solid #222', cursor: 'pointer', overflow: 'hidden',

  // ── special keys (not styles) ──
  text: 'hello',            // textContent
  html: '<b>hi</b>',        // innerHTML
  name: 'hero',             // dataset.name (+ el.id if empty)
  size: 64,                 // width AND height
  rotation: -35,            // number → degrees
  src: 'a.png', href: '/x', alt: '…',
  fullPage: true,           // width:100%; min-height:100vh; display:block
  pos: { x: 20, y: 30, z: 2 },   // object form → position:absolute + top/left/z-index
  children: [el1, el2],     // addChild() each
  onClick: fn, onInput: fn, // any on<Event> key binds a listener
})
```

**Which long names work too:** the map is keyed by shorthand *and* the real CSS name, so
`bg`/`bgColor`/`backgroundColor`, `c`/`color`, `p`/`padding`, `fs`/`fontSize`,
`jc`/`justifyContent`, `br`/`borderRadius`, `bs`/`boxShadow`, `ff`/`fontFamily`,
`lh`/`lineHeight`, `ta`/`textAlign`, `o`/`opacity`, `z`/`zIndex` all work.

**Anything not in the map** is passed straight to `el.style[key]` (`whiteSpace`, `backdropFilter`,
`objectFit`, `WebkitTextStroke`…), and if the element has no such style property it becomes an
attribute instead. So props are effectively "style, plus escape hatches".

### Numbers and units
| Prop | `200` becomes |
|---|---|
| `w h minW maxW minH maxH p pt pb pl pr m mt mb ml mr gap fs lh br top left right bottom` | `200px` |
| `o z fw` and friends | `200` (unitless — correct) |
| `lineHeight` | `200px` (usually **not** what you want → pass `'1.5'`) |

### Props vs chaining — don't mix on one key

```js
new Box(app, { w: 200, bg: 'red' })   // props: full styleMap, px-correct
box.w(200).bg('red')                  // chaining: writes el.style directly
```

Chaining is terser and returns `this`, but it px-wraps **everything except `bg`/`c`** — so
`.o(0.5)` writes `opacity:0.5px` (silently dropped) and `.lh(1.5)` writes `line-height:1.5px`.
Available: `w h p m pt pb pl pr mt mb ml mr mx my px py br o z fs fw ff ta d bs cur bg c
x y center highlight glass tooltip badge contextMenu`.

> ⚠️ Names collide: `box.bg('red')` **overwrites** the method with `'red'` if you ever write
> `box.bg = 'red'`. Per element, pick props **or** chaining.

---

## 3. Containers — the four refs

```js
// 1. name — the container registers itself, children attach by name
const sidebar = new Box('sidebar', { w: 280 })
new Text('sidebar', { text: 'menu' })      // ✔ attached now
app.addChild(sidebar)                       // …but named boxes don't mount themselves

// 2. element reference — no name needed (works for any element, not just Box)
const panel = new Box(app)
new Text(panel, { text: 'inside' })

// 3. number — legacy, 1-based, only counts *mounted* boxes
new Text(1, { text: 'first container' })

// 4. null / false
new Text(null,  { text: 'active layer (App, or current scene)' })
const layer = new Box(false, { p: 10 })    // detached: no parent, stays out of the index
app.addChild(layer)                        // …mount whenever you're ready
```

Only these take a ref: **`Box`, `App` and every `BaseElement` subclass**. `Modal`, `Drawer` and
`toast` ignore refs — they're viewport-level and mount to `<body>` themselves.

---

## 4. Layout recipes

```js
// flex column with header/body/footer
const page = new Box(app, { d: 'flex', fd: 'column', h: '100vh' })
const header = new Box(page, { d: 'flex', jc: 'space-between', ai: 'center', p: '0 24px', h: 64 })
const body   = new Box(page, { flex: '1', overflow: 'auto', p: 24 })
const footer = new Box(page, { h: 48, d: 'flex', ai: 'center' })
```

`row()/col()` are shorthand for flex + append:

```js
new Box(app).row(logo, nav, spacer)   // display:flex; flex-direction:row; align-items:center
new Box(app).col(a, b, c)             // display:flex; flex-direction:column
```
They append directly (no `addChild`), so **`onMount` does not fire** for those children.

```js
group(a, b, c)      // position:relative wrapper for layering
box.move(x, y)      // transform: translate()
box.center()        // absolute 50/50 + translate(-50%,-50%)  ⚠ wipes rotation
```

---

## 5. Events & state

```js
// three equivalent ways
btn.click(() => toast('hi'))                              // Button only, chainable
btn.on('click', fn).w(120)                                // any element, chainable
new Button(app, { text: 'x', onClick: () => {…} })        // via props

input.onInput(v => console.log(v))                        // Input: input event, value passed
input.onEnter(v => submit(v))                             // Input: Enter only
input.get(); input.set('new')                             // value helpers

onKey('a', () => jump())                                  // global keydown, lowercased e.key
onKey(' ', () => shoot(), { up: true })                   // keyup variant
```

State is just variables + setters — there's no reactivity:

```js
let count = 0
const label = new Text(app, { text: '0' })
new Button(app, { text: '+', onClick: () => { label.text = String(++count) } })
```

`save('key', obj)` / `load('key', fallback)` persist to `localStorage` (JSON).

---

## 6. Animation

```js
el.fadeIn(200).slideUp(20, 300)                    // chainable, CSS transitions
el.animate({ opacity: 1, y: 0, scale: 1.05 }, 300, 'cubic-bezier(.2,.8,.2,1)')
el.animate({ width: 200, backgroundColor: '#222' }, 400)
```
`animate()` supports `opacity x y scale rotate width height backgroundColor color`.
It's a transition helper — it **shadows the native `Element.animate()`**.

Timers: `after(ms, fn)`, `every(ms, fn)` → `{ stop() }`, `loop(fn)` → `{ stop() }` (`fn(dt)` each frame).

---

## 7. Constructor signatures (the sharp edges)

| Signature | Classes |
|---|---|
| `(ref, props)` | almost everything |
| `(props)` | `App` |
| `(refOrProps)` | `Box` — object first arg = props (elements/HTMLElements still count as refs) |
| `(level, ref, props)` | `Heading` |
| `(ordered, ref, props)` | `List` |
| `(isHeader, ref, props)` | `TableCell` |
| `(ref, props)` but body-level | `Modal`, `Drawer` |

So `new Heading('Title', app)` gives you an `<h1>` *inside a container named "Title"* — pass
`new Heading(1, app, { text: 'Title' })`. And `new Text({ text:'x' })` silently orphans.

---

## 8. The component set, by use

```js
toast('saved', { type:'success', position:'tr', duration: 2500 })

const m = new Modal(null, { title:'Confirm', content:'Sure?', onClose: () => {} })
m.open(); m.close()

const d = new DropdownMenu(app, { label:'File', items:[
  { label:'New', onClick: () => {} },
  { divider:true },
  { label:'Quit', onClick: () => {} },
]})

const t = new Tabs(app, { tabs:[{ label:'One', content:'…' }, { label:'Two', content: el }] })
t.show(1); t.addTab({ label:'Three', content:'…' })

const s = new Slider(app, { min:0, max:100, value:40, step:5 })
s.onChange(v => console.log(v))

new ProgressBar(app, { value: 30, striped: true })
const tg = new Toggle(app, { checked:false, onChange: v => {} })

new Accordion(app, { multi:false, items:[{ title:'Q', content:'A', open:true }] })
const dr = new Drawer(null, { side:'right', size:'320px', content: el }); dr.open()
new Chip(app, { text:'tag', removable:true, onRemove: c => c.destroy() })

const card = new Card(app, { title:'Card', content: el, footer:'…' })
card.setContent('new body')
```

All of them accept leftover style props (`w`, `pos`, `mt`…) which flow into `this.props`.
Prototype extras for any element: `.tooltip('hint')`, `.badge(3)`, `.contextMenu([...])`, `.glass()`.

---

## 9. Scenes & routing

```js
scene('home',  () => { /* build into new Text(null, …) — mounts into the scene */ })
scene('about', () => import('./about.js'))     // async loader, default() is called

await go('home')          // tears the old scene down (onDestroy fires), mounts the new one
currentScene()            // 'home' | null
unmountScene()            // tear down without replacing
router.define('/about', fn); router.go('/about')   // separate URL-based router
```

Bare elements (`null` ref) inside a scene land in the scene, not the app — scenes swap the
*active layer* while they build.

---

## 10. Debugging

```js
csui.debug(true)      // window.onerror → full-screen error card + verbose [csui] logs
csui.strict(true)     // reserved flag
box.highlight('#f00')  // red outline
box._describe()        // "Box#el_3 (hero) <div#hero> "text…""
checkOverlap(a, b)     // AABB test + console warning naming both elements
```

Every element logs `[syntax] create Text#el_4 (target container: home)` on construction — that line
tells you which ref was resolved and, via `[csui] … → container "home"`, whether it attached.

---

## 11. Type & brand notes for this repo

Fonts already loaded in `index.html`:

```js
ff: "'Pixelify Sans', sans-serif"   // pixel headings — me.js uses this
ff: "'Geist Mono', monospace"       // body/code
ff: "'Boldonse', sans-serif"        // brand/display
```

House style from `main.js`: *dark monochrome, sharp corners, pixel fonts, retro but boldly
semi-sleek* → `bg: '#0a0a0a'`, `c: '#fff'`, `br: 0`, `border: '1px solid #222'`, accent only on
hover.

---

## 12. Authoring checklist

1. `new App({...})` once; everything else hangs off it.
2. Declare a **named** box per screen region; remember `app.addChild(region)`.
3. Props for layout, chaining for tweaks — never both on the same key.
4. Events via `onClick`/`onInput` props, or `.click()` / `.on()` for chains.
5. Use `addChild`/props `children:` when you need `onMount`; `row()/col()` if you don't.
6. Numbers are px except `o`, `z`, `fw`; `lineHeight` wants a string.
7. `destroy()` for a single element; `clearContainers()` + fresh `App` for a full re-render.
8. `csui.debug(true)` while building, delete before shipping.
