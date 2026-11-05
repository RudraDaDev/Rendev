// ─────────────────────────────────────────────────────────────
// ui.js — shared chrome for every rendev scene
// one look: bordered frame, mono topbar, pixel headings
// everything is a csui element; no HTML, no CSS files
// ─────────────────────────────────────────────────────────────
import { Box, Text, go } from './lib/csui.js'

export const C = {
  bg:     '#0a0a0a',
  panel:  '#111111',
  ink:    '#f4f4f4',
  dim:    '#6b6b6b',
  faint:  '#171717',
  line:   '#1e1e1e',
}

export const PIXEL = "'Pixelify Sans', sans-serif"
export const MONO  = "'Geist Mono', monospace"
export const BRAND = "'Boldonse', sans-serif"

// faint 48px grid, drawn as a repeating gradient (no image request)
export function grid(el) {
  el.setStyle('backgroundImage',
    'repeating-linear-gradient(0deg, #141414 0 1px, transparent 1px 48px),' +
    'repeating-linear-gradient(90deg, #141414 0 1px, transparent 1px 48px)')
  return el
}

function clockText() {
  return new Date().toLocaleTimeString('en-IN', { hour12: false })
}

/**
 * Standard scene shell.
 * @returns {{ wrap, frame, topbar, body, foot }}
 */
export function shell({
  title = 'rendev',
  brandFont = BRAND,
  footerLeft = 'mumbai, in',
  footerRight = 'v0.1 · not finished',
} = {}) {
  const wrap = new Box(null, {
    w: '100%', h: '100%',
    d: 'flex', jc: 'center', ai: 'center',
  })

  const frame = new Box(wrap, {
    w: 'min(920px, 92vw)', h: 'min(620px, 88vh)',
    bg: C.panel, border: `1px solid ${C.line}`,
    d: 'flex', fd: 'column',
    pos: 'relative', overflow: 'hidden',
  })

  // ── topbar ──
  const topbar = new Box(frame, {
    d: 'flex', jc: 'space-between', ai: 'center',
    h: 44, p: '0 16px', flex: 'none',
    borderBottom: `1px solid ${C.line}`,
    bg: C.bg,
  })

  const brand = new Text(topbar, { text: title, fs: 15, ff: brandFont, c: C.ink })
  const clock = new Text(topbar, { text: clockText(), fs: 12, c: C.dim })

  const timer = setInterval(() => { clock.text = clockText() }, 1000)
  frame.onDestroy(() => clearInterval(timer))

  // ── body ──
  const body = new Box(frame, {
    d: 'flex', fd: 'column',
    flex: '1', overflow: 'auto',
  })

  // ── footer ──
  const foot = new Box(frame, {
    d: 'flex', jc: 'space-between', ai: 'center',
    h: 40, p: '0 24px', flex: 'none', bg: C.bg,
    borderTop: `1px solid ${C.line}`,
  })
  new Text(foot, { text: footerLeft, fs: 11, c: C.dim })
  new Text(foot, { text: footerRight, fs: 11, c: C.dim })

  return { wrap, frame, topbar, brand, clock, body, foot }
}

/**
 * "← back" bar, always the first row of a door scene.
 */
export function backBar(parent, to = 'home', label = 'back') {
  const row = new Box(parent, {
    d: 'flex', ai: 'center', gap: 10,
    h: 44, p: '0 24px', flex: 'none',
    cursor: 'pointer', userSelect: 'none',
    borderBottom: `1px solid ${C.line}`,
    transition: 'background 140ms, padding-left 140ms',
  })

  const arrow = new Text(row, { text: '←', fs: 14, c: C.dim, transition: 'transform 140ms, color 140ms' })
  new Text(row, { text: label, fs: 12, c: C.dim })

  const enter = () => {
    row.setStyle('backgroundColor', C.faint)
    row.setStyle('paddingLeft', '32px')
    arrow.setStyle('color', C.ink)
    arrow.setStyle('transform', 'translateX(-3px)')
  }
  const leave = () => {
    row.setStyle('backgroundColor', 'transparent')
    row.setStyle('paddingLeft', '24px')
    arrow.setStyle('color', C.dim)
    arrow.setStyle('transform', 'translateX(0)')
  }

  row.on('mouseenter', enter)
  row.on('mouseleave', leave)
  row.on('click', () => go(to))

  return row
}

/**
 * Label / value line used by the content scenes.
 */
export function line(parent, label, value, { dim = false } = {}) {
  const row = new Box(parent, {
    d: 'flex', jc: 'space-between', ai: 'baseline', gap: 16,
    p: '12px 0',
    borderBottom: `1px solid ${C.line}`,
  })
  new Text(row, { text: label, fs: 11, c: C.dim, ff: MONO })
  new Text(row, {
    text: value, fs: 13,
    c: dim ? C.dim : C.ink,
    ff: MONO, ta: 'right',
  })
  return row
}
