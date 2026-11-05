// ─────────────────────────────────────────────────────────────
// me.js — portfolio
//
// layout:   identity column (left, sticky) | record (right, scrolls)
// behaviour: work index rows expand in place into a detail panel —
//            hairlines stay on the grid, nothing navigates away
// content:  all local data, edit the arrays at the top
// ─────────────────────────────────────────────────────────────
import { Box, Text, Image, scene, go } from './lib/csui.js'
import {
  C, HAIRLINE, PIXEL, MONO,
  shell, backBar, meta, rule, crosshair, heading, meter, chip,
  pressable, setExpanded, onNarrow, isNarrow, motion,
} from './ui.js'

// ─── data ────────────────────────────────────────────────────
const IDENTITY = {
  name: 'Rudra',
  handle: 'rudradadev',
  based: 'Mumbai, India',
  coords: '19.07N 72.87E',
  tz: 'IST · UTC+5:30',
  role: 'web · systems · languages',
  status: 'open to interesting problems',
  blurb:
    'I build small, sharp tools — on the web, on bare metal, and occasionally in a ' +
    'language of my own. C, JavaScript, Node, Bun, NativeScript, bash. No frameworks, ' +
    'no CSS files, no build step.',
}

const STATS = [
  { label: 'projects',   value: '09', note: 'shipped-ish' },
  { label: 'stack',      value: 'JS', note: 'vanilla only' },
  { label: 'deps',       value: '00', note: 'runtime' },
  { label: 'commitment', value: '85%', note: 'honest average' },
]

const WORK = [
  {
    id: 'rendev',
    why: "Written because every static host wanted a build step I did not need.",
    year: '2026',
    name: 'rendev.in',
    kind: 'product · static hosting',
    state: 'alpha',
    score: 4,
    summary: 'Static sites hosted insanely cheap. Drop a folder, get a URL.',
    detail:
      'A static host with no runtime and no build step: upload a folder, get a URL, ' +
      'pay less than a coffee. The whole front-end runs on csui — the same library this ' +
      'site is built with — so the dashboard and the landing page share one design system.',
    stack: ['csui', 'vanilla js', 'github pages', 'no backend yet'],
    links: [
      { label: 'open scene', action: 'scene' },
      { label: 'rendev.in', href: 'https://rendev.in' },
    ],
  },
  {
    id: 'csui',
    why: "Written because I kept writing the same 200 lines of createElement.",
    year: '2026',
    name: 'csui',
    kind: 'library · dom wrapper',
    state: 'v0.1',
    score: 4,
    summary: 'A NativeScript-style DOM wrapper — 3.4k lines, zero dependencies.',
    detail:
      'Elements are built by construction: `new Box(parent, { w: 200 })` mounts immediately, ' +
      'props route through a shorthand style map, and there is no virtual DOM to diff. ' +
      'It also carries a scene manager, a plugin API, SVG helpers and an Android-compat layer. ' +
      'Every page on this site is three lines of csui.',
    stack: ['esm', 'no deps', 'scenes', 'plugins'],
    links: [
      { label: 'source', href: 'https://github.com/RudraDaDev/ctrlscript' },
      { label: 'read docs', action: 'docs' },
    ],
  },
  {
    id: 'kargohold',
    why: "Written because four input devices should not need four OSes.",
    year: '2026',
    name: 'kargohold',
    kind: 'bootloader · rpi 3b+',
    state: 'hacking',
    score: 3,
    summary: 'A multiboot bootloader for the Pi 3B+ — joystick, keypad, keyboard, touch.',
    detail:
      'Four ways to pick an OS on bare metal: an analog joystick, a matrix keypad, a USB ' +
      'keyboard and a resistive touch panel, all feeding one menu. Written against the ' +
      'hardware rather than an OS — which mostly means writing the drivers underneath it first.',
    stack: ['bare metal', 'arm', 'rpi 3b+', 'input drivers'],
    links: [],
  },
  {
    id: 'ili9486',
    why: "Written because a display controller is the easiest way to learn SPI the hard way.",
    year: '2026',
    name: 'ili9486 drivers',
    kind: 'systems · c drivers',
    state: 'bare metal',
    score: 3,
    summary: 'Bare-metal C drivers for the ILI9486 display controller.',
    detail:
      'No HAL, no OS, no libc niceties: SPI bring-up, init sequences, window addressing and ' +
      'pixel blits straight onto the panel. Built because kargohold needed something to draw ' +
      'a menu on before anything else existed.',
    stack: ['c', 'spi', 'no hal', 'arm'],
    links: [],
  },
  {
    id: 'smallhours',
    why: "Written because it was 2am and shipping beats polishing.",
    year: '2025',
    name: 'smallhours',
    kind: 'site · gh pages',
    state: 'live',
    score: 3,
    summary: 'A late-night build, published to GitHub Pages.',
    detail:
      'The name is about when it gets written. Static, small, and shipped instead of ' +
      'polished — a reminder that the fastest way to finish something is to stop ' +
      'adding to it.',
    stack: ['static', 'gh pages', 'html'],
    links: [{ label: 'live', href: 'https://rudradadev.github.io/smallhours' }],
  },
  {
    id: 'tyreroads',
    why: "Written to look at road surfaces. Learned scope creep instead.",
    year: '2025',
    name: 'tyreroads',
    kind: 'web · experiment',
    state: 'wip',
    score: 2,
    summary: 'An experiment that never stopped being an experiment.',
    detail:
      'Started as a way to look at road surfaces and turned into a lesson in scope creep. ' +
      'Still open, still unfinished, still interesting to open on a slow evening.',
    stack: ['web', 'unfinished'],
    links: [],
  },
  {
    id: 'krix',
    featured: true,
    year: '2025',
    name: 'krix',
    kind: 'language · compiler',
    state: 'wip',
    score: 3,
    summary: 'A general-purpose language, js-inspired, with a compiler that roasts you.',
    detail:
      'Two things make krix krix. The compiler has a personality: it insults you for the ' +
      'mistake, then gives you the useful diagnostic underneath — useful error messages ' +
      'with a bad attitude. Memory is a Lua-table model, with both automatic and manual ' +
      'management, so you can let the runtime handle it or take the wheel yourself.',
    stack: ['language design', 'compiler', 'lua tables', 'memory'],
    links: [],
    // rendered as a krix diagnostic inside the panel
    diagnostics: [
      {
        file: 'leak.kx',
        line: '14',
        code: 'let buffer = open("dump.bin")',
        span: '               ^^^^^^^^^^^^^^^^^^',
        error: 'krix: reference to `buffer` outlives its scope',
        help: 'nothing here frees it. it will not free itself.',
        roast: "The memory leaker so much it's basically a fucking faucet now",
      },
      {
        file: 'leak.kx',
        line: '19',
        code: 'free(buffer)          # "just to be safe"',
        span: '          ^^^^^^',
        error: 'krix: double free — `buffer` was released at line 14',
        help: 'valgrind will confirm. it is very pleased with itself.',
        roast: "valgrinds proud. I'm not.",
      },
    ],
  },
  {
    id: 'afterbell',
    why: "Written because the school needed it. Nobody needed it.",
    year: '2025',
    name: 'afterbell',
    kind: 'app · school social',
    state: 'test build',
    score: 2,
    summary: 'A school social app. Test build is up, the rest is dormant.',
    detail:
      'The one that needed a backend, a moderation model and a reason to exist. A test ' +
      'deployment is public while the private build sits untouched. Kept in the list ' +
      'because the shelved ones are part of the record.',
    stack: ['netlify', 'private build', 'shelved'],
    links: [{ label: 'test build', href: 'https://test-afterbell.netlify.app' }],
  },
  {
    id: 'brokenhours',
    why: "Written because games are the only thing I will not outsource.",
    year: '2026',
    name: 'brokenhours',
    kind: 'studio · games',
    state: 'building',
    score: 2,
    summary: 'A tiny game studio. The library opens when something is playable.',
    detail:
      'Four slots, zero shipped. The grid on the studio page is the entire product for ' +
      'now — a deliberate refusal to put up a store page before there is a game.',
    stack: ['csui', 'matter.js', 'scenes'],
    links: [{ label: 'open scene', action: 'scene' }],
  },
]

const CAPABILITIES = [
  { label: 'c',                score: 5 },
  { label: 'javascript',       score: 5 },
  { label: 'node.js',          score: 5 },
  { label: 'bun',              score: 4 },
  { label: 'nativescript',     score: 4 },
  { label: 'bash',             score: 4 },
  { label: 'compilers',        score: 3 },
]

const TIMELINE = [
  { year: '2026', what: 'kargohold + ili9486', note: 'bare metal' },
  { year: '2026', what: 'rendev.in alpha',     note: 'static hosting' },
  { year: '2026', what: 'csui v0.1',           note: 'dom wrapper, scenes' },
  { year: '2025', what: 'afterbell',           note: 'shelved' },
  { year: '2025', what: 'krix / tyreroads',    note: 'experiments' },
  { year: '2024', what: 'first csui',          note: 'a box and a circle' },
]

const LINKS = [
  { label: 'github',    value: 'github.com/RudraDaDev', href: 'https://github.com/RudraDaDev' },
  { label: 'rendev',    value: 'rendev.in',             href: 'https://rendev.in' },
  { label: 'email',     value: 'hi@rendev.in',          href: 'mailto:hi@rendev.in' },
]

// ─── deep links ──────────────────────────────────────────────
// ?project=krix   or   #krix   opens that panel on load
const narrowPad = () => (isNarrow(900) ? '14px 14px' : '16px 18px')

function requestedProject() {
  try {
    const q = new URLSearchParams(window.location.search).get('project')
    const h = window.location.hash.replace(/^#/, '')
    return (q || h || '').toLowerCase()
  } catch { return '' }
}

function pushProject(id) {
  try {
    const url = new URL(window.location.href)
    if (id) url.searchParams.set('project', id)
    else url.searchParams.delete('project')
    window.history.replaceState({}, '', url)
  } catch { /* file:// or sandboxed */ }
}

// ─── scene ───────────────────────────────────────────────────
scene('me', () => {
  const { wrap, body } = shell({
    title: 'me',
    brandSuffix: '/portfolio',
    path: '~/me',
    rail: 'rudra — portfolio — mumbai — vanilla js',
    footerLeft: IDENTITY.coords + ' · mumbai',
    footerRight: 'portfolio · v1',
  })

  backBar(body, 'home', { path: '/portfolio' })

  // two columns on wide screens, one stacked column when narrow
  const narrow = isNarrow(900)
  const cols = new Box(body, {
    d: 'flex', fd: narrow ? 'column' : 'row',
    flex: '1', overflow: narrow ? 'auto' : 'hidden',
  })

  // ── identity column ──
  const idCol = new Box(cols, {
    w: narrow ? '100%' : 320, flex: narrow ? 'none' : 'none',
    p: narrow ? '20px 16px' : '24px 20px',
    borderRight: narrow ? 'none' : HAIRLINE,
    borderBottom: narrow ? HAIRLINE : 'none',
    bg: C.abyss,
    d: 'flex', fd: 'column', gap: 0,
    overflow: narrow ? 'visible' : 'auto',
  })

  const unbindCols = onNarrow(900, isNarrowNow => {
    cols.setStyle('flexDirection', isNarrowNow ? 'column' : 'row')
    cols.setStyle('overflow', isNarrowNow ? 'auto' : 'hidden')
    idCol.setStyle('width', isNarrowNow ? '100%' : '320px')
    idCol.setStyle('padding', isNarrowNow ? '20px 16px' : '24px 20px')
    idCol.setStyle('borderRight', isNarrowNow ? 'none' : HAIRLINE)
    idCol.setStyle('borderBottom', isNarrowNow ? HAIRLINE : 'none')
    idCol.setStyle('overflow', isNarrowNow ? 'visible' : 'auto')
  })
  wrap.onDestroy(unbindCols)

  // ── pfp — pixel line-art of me at three, matted off its green ground
  // the caption runs up the left edge, rotated, like a film splice
  const pfpRow = new Box(idCol, {
    d: 'flex', alignItems: 'stretch', gap: 9,
    mb: 16, flex: 'none',
  })

  // stacked caption frame: hairline box, letters reading bottom → top
  const capFrame = new Box(pfpRow, {
    w: 22, flex: 'none',
    border: `1px solid ${C.line}`,
    bg: C.abyss,
    d: 'flex', ai: 'center', jc: 'center',
    pos: 'relative', overflow: 'hidden',
  })

  const capText = new Text(capFrame, {
    text: '3yr old me :p',
    fs: 9, ff: MONO, c: C.dim,
    letterSpacing: '0.1em',
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    transition: 'color 200ms',
  })

  crosshair(capFrame, 'tl', 4)
  crosshair(capFrame, 'bl', 4)

  // frame
  const slab = new Box(pfpRow, {
    w: isNarrow(900) ? 120 : 158, h: isNarrow(900) ? 104 : 136, flex: 'none',
    border: `1px solid ${C.line2}`,
    bg: 'transparent',      // no panel fill behind the cutout
    p: 7,
    pos: 'relative',
    overflow: 'hidden',
    d: 'flex', ai: 'center', jc: 'center',
  })

  const portrait = new Image(slab, {
    src: './assets/portrait.png',
    alt: 'Rudra at three years old, pixel line art',
    w: '100%', h: '100%',
    fit: 'contain',
    preserveRatio: false,
    d: 'block',
    // mirrored, so he faces back toward the identity column
    transform: 'scaleX(-1)',
    transition: motion() ? 'transform 320ms cubic-bezier(.2,.8,.2,1)' : 'none',
  })

  crosshair(slab, 'tl', 5)
  crosshair(slab, 'br', 5)

  pfpRow.on('mouseenter', () => {
    if (motion()) portrait.setStyle('transform', 'scaleX(-1) scale(1.06)')
    capText.setStyle('color', C.ink)
    capFrame.setStyle('borderColor', C.line2)
  })
  pfpRow.on('mouseleave', () => {
    portrait.setStyle('transform', 'scaleX(-1)')
    capText.setStyle('color', C.dim)
    capFrame.setStyle('borderColor', C.line)
  })

  new Text(idCol, {
    text: IDENTITY.name, fs: 26, ff: PIXEL, fw: 700, c: C.ink,
    lh: '1', letterSpacing: '-0.01em', d: 'block',
  })
  meta(idCol, `@${IDENTITY.handle}`, { c: C.dim, mt: 6 })

  rule(idCol, { m: '14px 0' })

  new Text(idCol, {
    text: IDENTITY.blurb,
    fs: 11, c: C.dim, ff: MONO, lh: '1.85', maxW: '38ch',
  })

  // spec list
  const spec = new Box(idCol, { d: 'flex', fd: 'column', gap: 9, mt: 18 })
  ;[
    ['based',  IDENTITY.based],
    ['tz',     IDENTITY.tz],
    ['role',   IDENTITY.role],
    ['status', IDENTITY.status],
  ].forEach(([k, v]) => {
    const row = new Box(spec, { d: 'flex', fd: 'column', gap: 2 })
    meta(row, k, { c: C.mute })
    new Text(row, { text: v, fs: 11, ff: MONO, c: C.ink2, lh: '1.5' })
  })

  // live status dot + links pinned to the bottom
  const bottom = new Box(idCol, {
    mt: 'auto', pt: 16,
    borderTop: HAIRLINE,
    d: 'flex', fd: 'column', gap: 8,
  })

  const live = new Box(bottom, { d: 'flex', ai: 'center', gap: 7 })
  const dot = new Box(live, { w: 5, h: 5, bg: C.ink, o: 0.9 })
  meta(live, 'available', { c: C.dim })

  // slow pulse — skipped entirely when the user asks for less motion
  if (motion()) {
    let pulse = 1
    const pulseTimer = setInterval(() => {
      pulse = pulse === 1 ? 0.35 : 1
      dot.setStyle('opacity', String(pulse))
    }, 1100)
    wrap.onDestroy(() => clearInterval(pulseTimer))
  } else {
    dot.setStyle('opacity', '0.9')
  }

  LINKS.forEach(l => {
    const row = new Box(bottom, {
      d: 'flex', jc: 'space-between', ai: 'center', gap: 10,
      cursor: 'pointer', p: '3px 0',
      transition: 'padding-left 120ms',
    })
    const label = new Text(row, {
      text: l.label, fs: 9, ff: MONO, c: C.mute,
      letterSpacing: '0.09em', textTransform: 'uppercase',
    })
    const value = new Text(row, {
      text: `${l.value} ↗`, fs: 10, ff: MONO, c: C.dim,
      transition: 'color 120ms',
    })

    row.on('mouseenter', () => {
      row.setStyle('paddingLeft', '5px')
      value.setStyle('color', C.ink)
      label.setStyle('color', C.dim)
    })
    row.on('mouseleave', () => {
      row.setStyle('paddingLeft', '0')
      value.setStyle('color', C.dim)
      label.setStyle('color', C.mute)
    })
    row.on('click', () => window.open(l.href, '_blank', 'noopener'))
  })

  // ── record column ──
  const rec = new Box(cols, {
    flex: '1', d: 'flex', fd: 'column',
    overflow: narrow ? 'visible' : 'auto', pos: 'relative',
    width: narrow ? '100%' : 'auto',
  })

  const recPad = new Box(rec, { p: '24px 26px 40px', d: 'flex', fd: 'column' })

  // masthead
  heading(recPad, {
    eyebrow: 'record / 2024 — 2026',
    title: 'things i built.',
    sub: 'nine entries, most of them real. expand a row to read the note.',
    size: 'clamp(26px, 4vw, 40px)',
  })

  // stat strip — four equal cells, hairline separated
  const stats = new Box(recPad, {
    d: 'grid',
    gridTemplateColumns: isNarrow(560) ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
    gap: 1, bg: C.line,
    border: `1px solid ${C.line}`,
    mt: 22,
  })

  STATS.forEach(s => {
    const cell = new Box(stats, {
      bg: C.bg, p: '10px 12px',
      d: 'flex', fd: 'column', gap: 2,
    })
    new Text(cell, { text: s.value, fs: 20, ff: PIXEL, fw: 700, c: C.ink, lh: '1.1' })
    meta(cell, s.label, { c: C.dim })
    meta(cell, s.note, { c: C.mute })
  })

  const rowsApi = new Map()

  // ── featured: the one thing to look at first ──
  const feat = WORK.find(w => w.featured) || WORK[0]
  if (feat) {
    const card = new Box(recPad, {
      mt: 22, p: narrowPad(), bg: C.panel,
      border: `1px solid ${C.line2}`,
      d: 'flex', fd: 'column', gap: 8,
      pos: 'relative', cursor: 'pointer',
      transition: 'background 140ms',
    })
    crosshair(card, 'tr')

    const top = new Box(card, { d: 'flex', jc: 'space-between', ai: 'center', gap: 10 })
    meta(top, 'featured', { c: C.dim })
    chip(top, feat.state)

    new Text(card, {
      text: feat.name, fs: 30, ff: PIXEL, fw: 700, c: C.ink,
      lh: '1', letterSpacing: '-0.01em', d: 'block',
    })
    new Text(card, {
      text: feat.summary, fs: 11, ff: MONO, c: C.dim, lh: '1.7', maxW: '56ch',
    })

    // show the first diagnostic right here — the roast is the pitch
    if (feat.diagnostics?.length) {
      const d0 = feat.diagnostics[0]
      const line = new Box(card, {
        mt: 4, p: '8px 10px', bg: C.abyss,
        borderLeft: `2px solid ${C.line2}`,
        d: 'flex', fd: 'column', gap: 2,
      })
      new Text(line, {
        text: d0.roast, fs: 10, ff: PIXEL, c: C.ink, lh: '1.7',
      })
      meta(line, `— krix, on ${d0.file}:${d0.line}`, { c: C.mute })
    }

    const openIt = () => {
      const r = rowsApi.get(feat.id)
      if (r) r.open()
    }
    pressable(card, { label: `featured project: ${feat.name}` })
    card.on('click', openIt)
    card.on('mouseenter', () => card.setStyle('backgroundColor', C.raised))
    card.on('mouseleave', () => card.setStyle('backgroundColor', C.panel))
  }

  // ── work index ──
  const workHead = new Box(recPad, {
    d: 'flex', jc: 'space-between', ai: 'center',
    mt: 26, mb: 8,
  })
  meta(workHead, 'selected work', { c: C.dim })
  const TOTAL = String(WORK.length).padStart(2, '0')
  const openState = meta(workHead, 'all closed', { c: C.mute, ta: 'right' })

  const work = new Box(recPad, { d: 'flex', fd: 'column', borderTop: HAIRLINE })

  let openId = null
  const rows = new Map()

  const setState = () => {
    const openIdx = WORK.findIndex(w => w.id === openId)
    openState.text = openId
      ? `${String(openIdx + 1).padStart(2, '0')} / ${TOTAL} open`
      : 'all closed'
  }

  WORK.forEach((item, i) => {
    const entry = new Box(work, { d: 'flex', fd: 'column', borderBottom: HAIRLINE })

    const row = new Box(entry, {
      d: 'flex', ai: 'center', gap: 14,
      p: '12px 2px',
      cursor: 'pointer', userSelect: 'none',
      transition: 'background 130ms, padding-left 130ms',
    })

    // index + year
    const idxCol = new Box(row, { d: 'flex', fd: 'column', gap: 2, w: 54, flex: 'none' })
    meta(idxCol, `0${i + 1}`, { c: C.mute })
    meta(idxCol, item.year, { c: C.mute })

    // name + summary
    const nameCol = new Box(row, { d: 'flex', fd: 'column', gap: 3, flex: '1', minWidth: 0 })
    new Text(nameCol, {
      text: item.name, fs: 17, ff: PIXEL, fw: 700, c: C.ink,
      lh: '1.15', transition: 'color 130ms',
    })
    new Text(nameCol, {
      text: item.summary, fs: 10, ff: MONO, c: C.dim, lh: '1.55',
    })

    // right: kind, meter, state, chevron
    const right = new Box(row, { d: 'flex', ai: 'center', gap: 12, flex: 'none' })
    if (!isNarrow(900)) meta(right, item.kind, { c: C.mute, ta: 'right', d: 'block', maxW: 150 })
    meter(right, { value: item.score, max: 5, cellW: 7, h: 4 })
    chip(right, item.state)
    const caret = new Text(right, {
      text: '+', fs: 14, ff: MONO, c: C.mute, w: 10, ta: 'center',
      transition: 'transform 160ms, color 130ms',
    })

    // detail panel — grid-template-rows 0fr → 1fr.
    // animates without measuring anything, so it can never open to 0px
    const panel = new Box(entry, {
      d: 'grid',
      gridTemplateRows: '0fr',
      overflow: 'hidden',
      transition: motion() ? 'grid-template-rows 220ms cubic-bezier(.2,.8,.2,1)' : 'none',
    })
    const panelClip = new Box(panel, { minHeight: 0, overflow: 'hidden' })
    const panelInner = new Box(panelClip, {
      p: isNarrow(900) ? '0 2px 18px 2px' : '0 2px 16px 68px',
      d: 'flex', fd: 'column', gap: 12,
    })

    if (item.why) {
      new Text(panelInner, {
        text: item.why,
        fs: 10, c: C.mute, ff: MONO, lh: '1.7',
        fontStyle: 'italic', d: 'block',
      })
    }

    new Text(panelInner, {
      text: item.detail,
      fs: 11, c: C.dim, ff: MONO, lh: '1.9', maxW: '66ch',
    })

    const chips = new Box(panelInner, { d: 'flex', gap: 6, flexWrap: 'wrap' })
    item.stack.forEach(s => chip(chips, s))

    // krix-style diagnostics: snippet, error, help, then the roast.
    // rendered as a stack — a compiler that complains twice is on brand.
    if (item.diagnostics?.length) {
      item.diagnostics.forEach((d, di) => {
        const box = new Box(panelInner, {
          bg: C.abyss,
          border: `1px solid ${C.line}`,
          maxW: 560,
          mt: di === 0 ? 0 : 2,
          d: 'flex', fd: 'column',
          pos: 'relative',
          overflow: 'hidden',
        })

        // header strip: filename + line + which diagnostic this is
        const head = new Box(box, {
          d: 'flex', jc: 'space-between', ai: 'center',
          p: '4px 10px',
          borderBottom: `1px solid ${C.line}`,
          bg: C.panel,
        })
        const headLeft = new Box(head, { d: 'flex', ai: 'center', gap: 8 })
        meta(headLeft, d.file, { c: C.dim })
        meta(headLeft, `line ${d.line}`, { c: C.mute })
        meta(head, `${di + 1} / ${item.diagnostics.length}`, { c: C.mute })

        // snippet
        const code = new Box(box, {
          p: '10px 10px 2px 10px',
          d: 'flex', fd: 'column', gap: 0,
        })
        new Text(code, {
          text: d.code, fs: 10, ff: MONO, c: C.ink2,
          lh: '1.6', whiteSpace: 'pre', d: 'block',
        })
        new Text(code, {
          text: d.span, fs: 10, ff: MONO, c: C.mute,
          lh: '1.6', whiteSpace: 'pre', d: 'block',
        })

        // error + help
        const msg = new Box(box, {
          p: '8px 10px 10px 10px',
          d: 'flex', fd: 'column', gap: 3,
        })
        new Text(msg, {
          text: `error: ${d.error}`, fs: 10, ff: MONO, c: C.dim,
          lh: '1.6', d: 'block',
        })
        new Text(msg, {
          text: `help:  ${d.help}`, fs: 10, ff: MONO, c: C.mute,
          lh: '1.6', d: 'block',
        })

        // the roast, set apart by a heavier rule and the display face
        const roast = new Box(box, {
          p: '8px 10px',
          borderTop: `1px solid ${C.line2}`,
          bg: C.raised,
          d: 'flex', fd: 'column', gap: 3,
        })
        meta(roast, 'krix says', { c: C.mute })
        new Text(roast, {
          text: d.roast, fs: 10, ff: PIXEL, c: C.ink,
          lh: '1.7',
        })
      })
    }

    if (item.links.length) {
      const actions = new Box(panelInner, { d: 'flex', gap: 16, flexWrap: 'wrap' })
      item.links.forEach(l => {
        const a = new Text(actions, {
          text: `→ ${l.label}`, fs: 10, ff: MONO, c: C.dim,
          borderBottom: `1px solid ${C.line2}`,
          cursor: 'pointer', p: '1px 0',
          letterSpacing: '0.04em',
          transition: 'color 120ms, border-color 120ms',
        })
        a.on('mouseenter', () => {
          a.setStyle('color', C.ink)
          a.setStyle('borderBottomColor', C.ink)
        })
        a.on('mouseleave', () => {
          a.setStyle('color', C.dim)
          a.setStyle('borderBottomColor', C.line2)
        })
        a.on('click', e => {
          e.stopPropagation()
          if (l.action === 'scene') go(item.id)
          else if (l.action === 'docs') window.open('./docs/csui.md', '_blank', 'noopener')
          else if (l.href) window.open(l.href, '_blank', 'noopener')
        })
      })
    }

    // ── expand / collapse ──
    const collapse = () => {
      panel.setStyle('gridTemplateRows', '0fr')
      caret.text = '+'
      caret.setStyle('color', C.mute)
    }
    const expand = () => {
      panel.setStyle('gridTemplateRows', '1fr')
      caret.text = '−'
      caret.setStyle('color', C.ink)
    }

    const toggle = () => {
      const isOpen = openId === item.id

      // close whichever is open
      if (openId) {
        const prev = rows.get(openId)
        if (prev) { prev.collapse(); setExpanded(prev.row, false) }
      }

      if (isOpen) {
        openId = null
        setState()
        setExpanded(row, false)
        pushProject(null)
        return
      }

      expand()
      openId = item.id
      setState()
      setExpanded(row, true)
      pushProject(item.id)
    }

    row.on('click', toggle)

    // keyboard + screen-reader affordance
    pressable(row, { label: `${item.name} — ${item.kind}`, expanded: false })

    row.on('mouseenter', () => {
      if (openId === item.id) return
      row.setStyle('backgroundColor', C.panel)
      row.setStyle('paddingLeft', '8px')
      caret.setStyle('color', C.dim)
    })
    row.on('mouseleave', () => {
      row.setStyle('backgroundColor', 'transparent')
      row.setStyle('paddingLeft', '2px')
      caret.setStyle('color', openId === item.id ? C.ink : C.mute)
    })

    const api = {
      row, panel, collapse, expand,
      open() {
        if (openId === item.id) return
        if (openId) {
          const prev = rows.get(openId)
          if (prev) { prev.collapse(); setExpanded(prev.row, false) }
        }
        expand()
        openId = item.id
        setState()
        setExpanded(row, true)
        pushProject(item.id)
      },
      close() { collapse(); setExpanded(row, false) },
    }
    rows.set(item.id, api)
    rowsApi.set(item.id, api)
  })

  // honour ?project=… / #… on open. deferred a tick so layout settles.
  const wanted = requestedProject()
  if (wanted) {
    const target = rowsApi.get(wanted)
    if (target) {
      Promise.resolve().then(() => {
        target.open()
        // optional: not every engine exposes this (and jsdom does not)
        target.row.el.scrollIntoView?.({ block: 'center', behavior: motion() ? 'smooth' : 'auto' })
      })
    }
  }

  // ── capabilities + timeline, side by side ──
  const lower = new Box(recPad, {
    d: 'grid', gridTemplateColumns: isNarrow(760) ? '1fr' : '1fr 1fr',
    gap: 26, mt: 28,
  })

  const capCol = new Box(lower, { d: 'flex', fd: 'column' })
  meta(capCol, 'capabilities', { c: C.dim })
  rule(capCol, { m: '8px 0 10px 0' })

  CAPABILITIES.forEach(cap => {
    const row = new Box(capCol, {
      d: 'flex', jc: 'space-between', ai: 'center', gap: 12,
      p: '6px 0',
    })
    new Text(row, { text: cap.label, fs: 10, ff: MONO, c: C.dim, letterSpacing: '0.04em' })
    meter(row, { value: cap.score, max: 5, cellW: 8, h: 4 })
  })

  const tlCol = new Box(lower, { d: 'flex', fd: 'column' })
  meta(tlCol, 'timeline', { c: C.dim })
  rule(tlCol, { m: '8px 0 10px 0' })

  TIMELINE.forEach((t, i) => {
    const row = new Box(tlCol, {
      d: 'flex', ai: 'center', gap: 10,
      p: '6px 0', pos: 'relative',
    })
    meta(row, t.year, { c: C.mute, w: 32 })
    // node on a vertical hairline
    new Box(row, {
      w: 5, h: 5, bg: i === 0 ? C.ink : C.line2,
      flex: 'none',
    })
    new Text(row, {
      text: t.what, fs: 11, ff: MONO,
      c: i === 0 ? C.ink : C.dim,
      flex: '1',
    })
    meta(row, t.note, { c: C.mute, ta: 'right' })
  })

  // ── why these exist ──
  const why = new Box(recPad, {
    mt: 32, d: 'flex', fd: 'column', gap: 10, maxW: '62ch',
  })
  meta(why, 'why', { c: C.dim })
  rule(why, { m: '0 0 6px 0' })
  new Text(why, {
    text: 'Most of these started as a question I could not answer by reading. ' +
          'krix exists because I wanted to know where memory actually goes when nobody ' +
          'is holding the bill — so the compiler roasts you, and the table keeps score. ' +
          'kargohold exists because a Pi on a shelf is a boring Pi, and ili9486 exists ' +
          'because kargohold needed something to draw a menu on before it had a menu.',
    fs: 12, c: C.dim, ff: MONO, lh: '2', d: 'block',
  })
  new Text(why, {
    text: 'None of it is hosted polish. All of it got finished enough to be wrong in public.',
    fs: 11, c: C.mute, ff: MONO, lh: '1.9', d: 'block', mt: 2,
  })

  // ── colophon ──
  const note = new Box(recPad, {
    mt: 24, p: narrowPad(),
    border: `1px solid ${C.line}`,
    bg: C.panel, maxW: 520,
    d: 'flex', fd: 'column', gap: 6, pos: 'relative',
  })
  crosshair(note, 'br')
  meta(note, 'how this page is built', { c: C.mute })
  new Text(note, {
    text: 'One scene, no HTML page of its own. Rows expand in place instead of routing, ' +
          'and ?project=<name> links straight to one of them. Edit the arrays at the top ' +
          'of me.js to update any of it.',
    fs: 10, c: C.dim, ff: MONO, lh: '1.85',
  })
})
