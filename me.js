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
} from './ui.js'

// ─── data ────────────────────────────────────────────────────
const IDENTITY = {
  name: 'Rudra',
  handle: 'rudradadev',
  based: 'Mumbai, India',
  coords: '19.07N 72.87E',
  tz: 'IST · UTC+5:30',
  role: 'web · systems · games',
  status: 'open to interesting problems',
  blurb:
    'I build small, sharp tools for the web and I finish about half of them. ' +
    'No frameworks, no CSS files, no build step — just vanilla JS and csui at the base.',
}

const STATS = [
  { label: 'projects',  value: '04', note: 'shipped-ish' },
  { label: 'stack',     value: 'JS', note: 'vanilla only' },
  { label: 'deps',      value: '00', note: 'runtime' },
  { label: 'commitment', value: '50%', note: 'honest average' },
]

const WORK = [
  {
    id: 'rendev',
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
    id: 'brokenhours',
    year: '2026',
    name: 'brokenhours',
    kind: 'studio · games',
    state: 'building',
    score: 2,
    summary: 'A tiny game studio. The library opens when something is playable.',
    detail:
      'Four slots, zero shipped. The grid on the studio page is the entire product for ' +
      'now — a deliberate refusal to put up a store page before there is a game. Two of ' +
      'the four are real prototypes running on csui scenes and a Matter.js loop.',
    stack: ['csui', 'matter.js', 'scenes', 'no engine'],
    links: [{ label: 'open scene', action: 'scene' }],
  },
  {
    id: 'csui',
    year: '2026',
    name: 'csui',
    kind: 'library · dom wrapper',
    state: 'v0.1',
    score: 3,
    summary: 'A NativeScript-style DOM wrapper — 3.4k lines, zero dependencies.',
    detail:
      'Elements are built by construction: `new Box(parent, { w: 200 })` mounts immediately, ' +
      'props route through a shorthand style map, and there is no virtual DOM to diff. ' +
      'It also carries a scene manager, a plugin API, SVG helpers and an Android-compat layer.',
    stack: ['esm', 'no deps', 'scenes', 'plugins'],
    links: [{ label: 'read docs', action: 'docs' }],
  },
  {
    id: 'afterbell',
    year: '2025',
    name: 'afterbell',
    kind: 'app · school social',
    state: 'private',
    score: 1,
    summary: 'A school social app. Separate repo, private build, mostly dormant.',
    detail:
      'The one that needed a backend, a moderation model and a reason to exist. ' +
      'Shelved in favour of things that could be finished alone. Kept in the list because ' +
      'the shelved ones are part of the record.',
    stack: ['private', 'shelved', 'lessons'],
    links: [],
  },
]

const CAPABILITIES = [
  { label: 'vanilla js / esm', score: 5 },
  { label: 'dom + layout',     score: 5 },
  { label: 'design systems',   score: 4 },
  { label: 'game loops',       score: 3 },
  { label: 'canvas / svg',     score: 3 },
  { label: 'rust',             score: 2 },
]

const TIMELINE = [
  { year: '2026', what: 'rendev.in alpha', note: 'static hosting' },
  { year: '2026', what: 'csui v0.1',       note: 'dom wrapper, scenes' },
  { year: '2025', what: 'afterbell',       note: 'shelved' },
  { year: '2024', what: 'first csui',      note: 'a box and a circle' },
]

const LINKS = [
  { label: 'github',    value: 'github.com/RudraDaDev', href: 'https://github.com/RudraDaDev' },
  { label: 'rendev',    value: 'rendev.in',             href: 'https://rendev.in' },
  { label: 'email',     value: 'hi@rendev.in',          href: 'mailto:hi@rendev.in' },
]

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

  // two columns: identity (fixed) | record (scrolls)
  const cols = new Box(body, { d: 'flex', flex: '1', overflow: 'hidden' })

  // ── identity column ──
  const idCol = new Box(cols, {
    w: 320, flex: 'none',
    p: '24px 20px',
    borderRight: HAIRLINE,
    bg: C.abyss,
    d: 'flex', fd: 'column', gap: 0,
    overflow: 'auto',
  })

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
    w: 158, h: 136, flex: 'none',
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
    transition: 'transform 320ms cubic-bezier(.2,.8,.2,1)',
  })

  crosshair(slab, 'tl', 5)
  crosshair(slab, 'br', 5)

  pfpRow.on('mouseenter', () => {
    portrait.setStyle('transform', 'scaleX(-1) scale(1.06)')
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

  // slow pulse — the only animation on the page that never stops
  let pulse = 1
  const pulseTimer = setInterval(() => {
    pulse = pulse === 1 ? 0.35 : 1
    dot.setStyle('opacity', String(pulse))
  }, 1100)
  wrap.onDestroy(() => clearInterval(pulseTimer))

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
    overflow: 'auto', pos: 'relative',
  })

  const recPad = new Box(rec, { p: '24px 26px 40px', d: 'flex', fd: 'column' })

  // masthead
  heading(recPad, {
    eyebrow: 'record / 2024 — 2026',
    title: 'things i built.',
    sub: 'four entries, two of them real. expand a row to read the note.',
    size: 'clamp(26px, 4vw, 40px)',
  })

  // stat strip — four equal cells, hairline separated
  const stats = new Box(recPad, {
    d: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
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

  // ── work index ──
  const workHead = new Box(recPad, {
    d: 'flex', jc: 'space-between', ai: 'center',
    mt: 26, mb: 8,
  })
  meta(workHead, 'selected work', { c: C.dim })
  const openState = meta(workHead, 'all closed', { c: C.mute, ta: 'right' })

  const work = new Box(recPad, { d: 'flex', fd: 'column', borderTop: HAIRLINE })

  let openId = null
  const rows = new Map()

  const setState = () => {
    const openIdx = WORK.findIndex(w => w.id === openId)
    openState.text = openId
      ? `0${openIdx + 1} / 04 open`
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
    meta(right, item.kind, { c: C.mute, ta: 'right', d: 'block', maxW: 150 })
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
      transition: 'grid-template-rows 220ms cubic-bezier(.2,.8,.2,1)',
    })
    const panelClip = new Box(panel, { minHeight: 0, overflow: 'hidden' })
    const panelInner = new Box(panelClip, {
      p: '0 2px 16px 68px',
      d: 'flex', fd: 'column', gap: 12,
    })

    new Text(panelInner, {
      text: item.detail,
      fs: 11, c: C.dim, ff: MONO, lh: '1.9', maxW: '66ch',
    })

    const chips = new Box(panelInner, { d: 'flex', gap: 6, flexWrap: 'wrap' })
    item.stack.forEach(s => chip(chips, s))

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

    row.on('click', () => {
      const isOpen = openId === item.id

      // close whichever is open
      if (openId) {
        const prev = rows.get(openId)
        if (prev) prev.collapse()
      }

      if (isOpen) {
        openId = null
        setState()
        return
      }

      expand()
      openId = item.id
      setState()
    })

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

    rows.set(item.id, { row, panel, collapse, expand })
  })

  // ── capabilities + timeline, side by side ──
  const lower = new Box(recPad, {
    d: 'grid', gridTemplateColumns: '1fr 1fr',
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

  // ── footer note ──
  const note = new Box(recPad, {
    mt: 30, p: '14px 16px',
    border: `1px solid ${C.line}`,
    bg: C.panel, maxW: 520,
    d: 'flex', fd: 'column', gap: 6, pos: 'relative',
  })
  crosshair(note, 'br')
  meta(note, 'how this page is built', { c: C.mute })
  new Text(note, {
    text: 'One scene, no HTML page of its own. Rows expand in place instead of routing, ' +
          'so the record stays one column and the URL never changes. Edit the arrays at ' +
          'the top of me.js to update any of it.',
    fs: 10, c: C.dim, ff: MONO, lh: '1.85',
  })
})
