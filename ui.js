// ─────────────────────────────────────────────────────────────
// ui.js — rendev design system
//
// dark · technical · experimental
// deep navy ground, monochrome accents, zero radius,
// hairline borders, asymmetric grids, vertical rail
//
// every visual is a csui element. no HTML, no CSS files.
// ─────────────────────────────────────────────────────────────
import { Box, Text, go } from './lib/csui.js'

// ── palette ──────────────────────────────────────────────────
// navy ramp + a single monochrome accent ramp (no hues)
export const C = {
  abyss:  '#05070f',   // page ground
  bg:     '#080c17',   // shell
  panel:  '#0b1120',   // cells
  raised: '#101728',   // hover
  ink:    '#e6ebf5',   // primary text / accent
  ink2:   '#c3cbdd',
  dim:    '#6b7688',
  mute:   '#3d4657',
  line:   '#161f33',   // hairline
  line2:  '#1f2a42',   // hairline, brighter
}

// monochrome accent ramp — doors step down through it
export const MONO_RAMP = ['#e6ebf5', '#a9b4c9', '#67728a', '#414b60']

export const HAIRLINE  = `1px solid ${C.line}`
export const HAIRLINE2 = `1px solid ${C.line2}`

export const PIXEL = "'Pixelify Sans', sans-serif"
export const MONO  = "'Geist Mono', monospace"
export const BRAND = "'Boldonse', sans-serif"

// ── grounds ──────────────────────────────────────────────────
// faint technical grid (no image requests)
export function grid(el, { size = 32, opacity = 0.032 } = {}) {
  const c = `rgba(230,235,245,${opacity})`
  el.setStyle('backgroundImage',
    `repeating-linear-gradient(0deg, ${c} 0 1px, transparent 1px ${size}px),` +
    `repeating-linear-gradient(90deg, ${c} 0 1px, transparent 1px ${size}px)`)
  return el
}

// barely-there horizontal scanlines
export function scanlines(el, { size = 3, opacity = 0.02 } = {}) {
  el.setStyle('backgroundImage',
    `repeating-linear-gradient(0deg, rgba(230,235,245,${opacity}) 0 1px, transparent 1px ${size}px)`)
  return el
}

// ── atoms ────────────────────────────────────────────────────
export function meta(parent, text, props = {}) {
  return new Text(parent, {
    text, fs: 10, c: C.dim, ff: MONO,
    letterSpacing: '0.09em', textTransform: 'uppercase',
    ...props,
  })
}

export function rule(parent, props = {}) {
  return new Box(parent, { h: 1, w: '100%', flex: 'none', bg: C.line, ...props })
}

// [ esc ] style key cap — inverts on hover of whatever you attach it to
export function keycap(parent, label, props = {}) {
  return new Text(parent, {
    text: `[ ${label} ]`,
    fs: 10, c: C.dim, ff: MONO,
    letterSpacing: '0.06em',
    border: HAIRLINE, p: '2px 6px',
    userSelect: 'none',
    transition: 'color 120ms, border-color 120ms',
    ...props,
  })
}

export function tag(parent, text, { active = false } = {}) {
  return new Text(parent, {
    text,
    fs: 9, ff: MONO,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    c: active ? C.abyss : C.dim,
    bg: active ? C.ink : 'transparent',
    border: `1px solid ${active ? C.ink : C.line2}`,
    p: '2px 6px',
    userSelect: 'none',
  })
}

// registration marks — two hairlines forming a plus
export function crosshair(parent, corner = 'tl', size = 7) {
  const pos = {
    tl: { top: 5,  left: 5 },
    tr: { top: 5,  right: 5 },
    bl: { bottom: 5, left: 5 },
    br: { bottom: 5, right: 5 },
  }[corner]

  new Box(parent, {
    pos: 'absolute', w: size, h: 1, bg: C.line2, pointerEvents: 'none', ...pos,
  })
  new Box(parent, {
    pos: 'absolute', w: 1, h: size, bg: C.line2, pointerEvents: 'none', ...pos,
  })
}

// section heading: eyebrow rule + display type
export function heading(parent, { eyebrow, title, sub, font = PIXEL, size = 'clamp(28px, 5.2vw, 46px)' } = {}) {
  const wrap = new Box(parent, { d: 'flex', fd: 'column', gap: 0 })

  if (eyebrow) {
    const row = new Box(wrap, { d: 'flex', ai: 'center', gap: 10, mb: 14 })
    meta(row, eyebrow)
    new Box(row, { h: 1, flex: '1', bg: C.line })
  }

  if (title) {
    new Text(wrap, {
      text: title,
      fs: size, ff: font, fw: 700, c: C.ink,
      d: 'block', lh: '0.98', letterSpacing: '-0.01em',
    })
  }

  if (sub) {
    new Text(wrap, {
      text: sub,
      fs: 12, c: C.dim, ff: MONO,
      lh: '1.75', d: 'block', mt: 14, maxW: '56ch',
    })
  }

  return wrap
}

// ── shell ────────────────────────────────────────────────────
function clockText() {
  return new Date().toLocaleTimeString('en-IN', { hour12: false })
}

/**
 * Full scene chrome: topbar, vertical rail, body, meta footer.
 * @returns {{ wrap, frame, topbar, brand, clock, body, foot }}
 */
export function shell({
  title = 'rendev',
  brandSuffix = '',
  brandFont = PIXEL,
  path = '~/',
  rail = 'rendev — est. 2026 — mumbai',
  footerLeft = '19.07N 72.87E',
  footerRight = 'csui · vanilla js',
} = {}) {
  const wrap = new Box(null, {
    w: '100%', h: '100%',
    d: 'flex', jc: 'center', ai: 'center',
    p: 0,
  })

  const frame = new Box(wrap, {
    w: 'min(1180px, 94vw)',
    h: 'min(760px, 92vh)',
    bg: C.bg,
    border: HAIRLINE,
    d: 'flex', fd: 'column',
    pos: 'relative',
    overflow: 'hidden',
  })

  // ── topbar ──
  const topbar = new Box(frame, {
    d: 'flex', jc: 'space-between', ai: 'center',
    h: 42, p: '0 14px', flex: 'none',
    borderBottom: HAIRLINE,
    bg: C.abyss,
  })

  const left = new Box(topbar, { d: 'flex', ai: 'center', gap: 10 })

  const brand = new Text(left, {
    text: title, fs: 17, ff: brandFont, fw: 700, c: C.ink,
  })

  if (brandSuffix) {
    new Text(left, {
      text: brandSuffix, fs: 10, ff: MONO, c: C.dim,
      letterSpacing: '0.08em', mt: 2,
    })
  }

  new Box(left, { w: 1, h: 12, bg: C.line2, ml: 4, mr: 2 })
  meta(left, path, { c: C.mute })

  const right = new Box(topbar, { d: 'flex', ai: 'center', gap: 10 })
  new Box(right, { w: 5, h: 5, bg: C.ink, o: 0.7 })
  const clock = new Text(right, {
    text: clockText(), fs: 11, c: C.dim, ff: MONO, letterSpacing: '0.05em',
  })

  const timer = setInterval(() => { clock.text = clockText() }, 1000)
  frame.onDestroy(() => clearInterval(timer))

  // ── middle: rail + body ──
  const mid = new Box(frame, {
    d: 'flex', flex: '1', overflow: 'hidden',
  })

  const railEl = new Box(mid, {
    w: 32, flex: 'none',
    borderRight: HAIRLINE,
    bg: C.abyss,
    d: 'flex', ai: 'center', jc: 'center',
    overflow: 'hidden',
  })

  new Text(railEl, {
    text: rail,
    fs: 9, ff: MONO, c: C.mute,
    letterSpacing: '0.22em', textTransform: 'uppercase',
    writingMode: 'vertical-rl',
    whiteSpace: 'nowrap',
    userSelect: 'none',
  })

  const body = new Box(mid, {
    flex: '1', d: 'flex', fd: 'column',
    overflow: 'auto', pos: 'relative',
  })

  // ── footer ──
  const foot = new Box(frame, {
    d: 'flex', jc: 'space-between', ai: 'center',
    h: 34, p: '0 14px', flex: 'none', bg: C.abyss,
    borderTop: HAIRLINE, gap: 16,
  })
  meta(foot, footerLeft, { c: C.mute })
  meta(foot, footerRight, { c: C.mute, ta: 'right' })

  crosshair(frame, 'tl')
  crosshair(frame, 'tr')
  crosshair(frame, 'bl')
  crosshair(frame, 'br')

  return { wrap, frame, topbar, brand, clock, body, foot, rail: railEl }
}

// ── back bar ─────────────────────────────────────────────────
export function backBar(parent, to = 'home', { path = '/', hint = 'esc' } = {}) {
  const row = new Box(parent, {
    d: 'flex', ai: 'center', gap: 12,
    h: 36, p: '0 16px', flex: 'none',
    cursor: 'pointer', userSelect: 'none',
    borderBottom: HAIRLINE,
    transition: 'background 120ms, padding-left 120ms',
  })

  const cap = keycap(row, hint)
  const arrow = new Text(row, { text: '←', fs: 12, c: C.dim, transition: 'transform 120ms, color 120ms' })
  const label = new Text(row, { text: 'back', fs: 11, c: C.dim, ff: MONO, letterSpacing: '0.08em' })

  meta(row, path, { c: C.mute, ml: 'auto' })

  row.on('mouseenter', () => {
    row.setStyle('backgroundColor', C.raised)
    row.setStyle('paddingLeft', '22px')
    arrow.setStyle('color', C.ink)
    arrow.setStyle('transform', 'translateX(-3px)')
    label.setStyle('color', C.ink)
    cap.setStyle('color', C.ink)
    cap.setStyle('borderColor', C.line2)
  })
  row.on('mouseleave', () => {
    row.setStyle('backgroundColor', 'transparent')
    row.setStyle('paddingLeft', '16px')
    arrow.setStyle('color', C.dim)
    arrow.setStyle('transform', 'translateX(0)')
    label.setStyle('color', C.dim)
    cap.setStyle('color', C.dim)
    cap.setStyle('borderColor', C.line)
  })
  row.on('click', () => go(to))

  return row
}

// ── spec row ─────────────────────────────────────────────────
export function line(parent, label, value, { dim = false } = {}) {
  const row = new Box(parent, {
    d: 'flex', jc: 'space-between', ai: 'baseline', gap: 16,
    p: '11px 0',
    borderBottom: HAIRLINE,
  })

  meta(row, label, { c: C.mute })

  new Text(row, {
    text: value,
    fs: 12, ff: MONO,
    c: dim ? C.dim : C.ink2,
    ta: 'right',
  })

  return row
}

// strip of N segments used as a technical progress readout
export function segmented(parent, { total = 28, filled = 0, height = 8, props = {} } = {}) {
  const strip = new Box(parent, {
    d: 'flex', gap: 2, w: '100%', h: height, ...props,
  })
  for (let i = 0; i < total; i++) {
    new Box(strip, {
      flex: '1', h: '100%',
      bg: i < filled ? C.ink : C.line,
      o: i < filled ? 0.9 : 1,
      transition: 'background 200ms, opacity 200ms',
    })
  }
  return strip
}
