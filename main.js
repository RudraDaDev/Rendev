// ─────────────────────────────────────────────────────────────
// main.js — rendev landing
// one page, scenes not pages. vanilla js only.
// asymmetric: index column (left) · masthead + doors (right)
// keys: 1 / 2 / 3 open a door · esc returns home
// ─────────────────────────────────────────────────────────────
import { App, Box, Text, scene, go, onKey, csui } from './lib/csui.js'
import {
  C, MONO_RAMP, PIXEL, MONO, BRAND,
  grid, meta, rule, keycap, tag, crosshair, heading,
} from './ui.js'

const DOORS = [
  { key: '1', id: 'me',          title: 'me',          desc: 'who is behind this, half-finished projects and all', note: 'person' },
  { key: '2', id: 'rendev',      title: 'rendev.in',   desc: 'static sites, hosted cheap. building it in public',  note: 'product' },
  { key: '3', id: 'brokenhours', title: 'brokenhours', desc: 'game studio + library. nothing playable yet',         note: 'studio' },
]

// ── root ─────────────────────────────────────────────────────
const app = new App({
  bg: C.abyss, c: C.ink, ff: MONO,
  w: '100vw', h: '100vh',
  pos: 'relative', overflow: 'hidden',
  d: 'flex', jc: 'center', ai: 'center',
})
grid(app, { size: 40 })

// ── home ─────────────────────────────────────────────────────
scene('home', () => {
  const frame = new Box(null, {
    w: 'min(1180px, 94vw)', h: 'min(760px, 92vh)',
    bg: C.bg, border: `1px solid ${C.line}`,
    d: 'flex', fd: 'column', pos: 'relative', overflow: 'hidden',
  })

  // ── topbar ──
  const topbar = new Box(frame, {
    d: 'flex', jc: 'space-between', ai: 'center',
    h: 42, p: '0 14px', flex: 'none', bg: C.abyss,
    borderBottom: `1px solid ${C.line}`,
  })

  const left = new Box(topbar, { d: 'flex', ai: 'center', gap: 10 })
  new Text(left, { text: 'rendev', fs: 17, ff: PIXEL, fw: 700, c: C.ink })
  new Text(left, { text: 'rendev.in', fs: 10, c: C.dim, ff: MONO, letterSpacing: '0.08em', mt: 2 })
  new Box(left, { w: 1, h: 12, bg: C.line2, ml: 4, mr: 2 })
  meta(left, '~/', { c: C.mute })

  const right = new Box(topbar, { d: 'flex', ai: 'center', gap: 10 })
  new Box(right, { w: 5, h: 5, bg: C.ink, o: 0.7 })
  const clock = new Text(right, { text: '', fs: 11, c: C.dim, ff: MONO, letterSpacing: '0.05em' })
  const tick = () => { clock.text = new Date().toLocaleTimeString('en-IN', { hour12: false }) }
  tick()
  const timer = setInterval(tick, 1000)
  frame.onDestroy(() => clearInterval(timer))

  // ── middle: index column | main ──
  const mid = new Box(frame, { d: 'flex', flex: '1', overflow: 'hidden' })

  // left index column — asymmetric, 300px, hairline split
  const index = new Box(mid, {
    w: 300, flex: 'none', bg: C.abyss,
    borderRight: `1px solid ${C.line}`,
    d: 'flex', fd: 'column',
    overflow: 'hidden',
  })

  // rotating vertical rail text
  const railWrap = new Box(index, {
    d: 'flex', ai: 'center', jc: 'center',
    h: 78, flex: 'none', borderBottom: `1px solid ${C.line}`,
    overflow: 'hidden',
  })
  new Text(railWrap, {
    text: 'rendev — no frameworks — no css files — csui at the base',
    fs: 9, ff: MONO, c: C.mute,
    letterSpacing: '0.24em', textTransform: 'uppercase',
    writingMode: 'vertical-rl', whiteSpace: 'nowrap', userSelect: 'none',
  })

  const indexBody = new Box(index, { p: '18px 16px', d: 'flex', fd: 'column', gap: 14, flex: '1', overflow: 'auto' })

  meta(indexBody, 'index', { c: C.mute })
  rule(indexBody, { bg: C.line, m: '-6px 0 0 0' })

  DOORS.forEach((door, i) => {
    const row = new Box(indexBody, {
      d: 'flex', ai: 'center', gap: 10,
      cursor: 'pointer', userSelect: 'none',
      p: '6px 0',
      transition: 'padding-left 120ms',
    })

    new Text(row, { text: `0${i + 1}`, fs: 10, ff: MONO, c: C.mute, w: 18 })
    new Box(row, {
      w: 6, h: 6, bg: MONO_RAMP[i],
      o: 0.9,
      transition: 'transform 120ms',
    })
    new Text(row, {
      text: door.title, fs: 12, ff: MONO, c: C.dim,
      transition: 'color 120ms',
    })

    row.on('mouseenter', () => {
      row.setStyle('paddingLeft', '6px')
      row.el.children[2].style.color = C.ink
    })
    row.on('mouseleave', () => {
      row.setStyle('paddingLeft', '0')
      row.el.children[2].style.color = C.dim
    })
    row.on('click', () => go(door.id))
  })

  // bottom meta block of the column
  const indexFoot = new Box(index, {
    p: '12px 16px', flex: 'none',
    borderTop: `1px solid ${C.line}`,
    d: 'flex', fd: 'column', gap: 6,
  })
  meta(indexFoot, 'build 0.1.0', { c: C.mute })
  meta(indexFoot, 'scenes: 4 / routes: 0', { c: C.mute })
  meta(indexFoot, 'no html pages', { c: C.mute })

  // ── main column ──
  const main = new Box(mid, {
    flex: '1', p: '26px 28px 0',
    d: 'flex', fd: 'column', overflow: 'hidden', pos: 'relative',
  })

  heading(main, {
    eyebrow: 'rendev / index',
    title: 'pick a door.',
    sub: 'three things, one page. everything below is a scene — no reloads, no separate documents, no framework in the stack.',
    size: 'clamp(34px, 6vw, 62px)',
  })

  // doors list — pushed to fill remaining height
  const list = new Box(main, {
    d: 'flex', fd: 'column',
    flex: '1', mt: 22, overflow: 'hidden',
    borderTop: `1px solid ${C.line}`,
  })

  DOORS.forEach((door, i) => {
    const row = new Box(list, {
      d: 'flex', ai: 'center', gap: 16,
      p: '0 2px', flex: '1', minHeight: 64,
      borderBottom: `1px solid ${C.line}`,
      cursor: 'pointer', userSelect: 'none',
      pos: 'relative', overflow: 'hidden',
      transition: 'background 140ms, padding-left 140ms',
    })

    // left: key + tag
    const leftCol = new Box(row, { d: 'flex', fd: 'column', gap: 6, w: 64, flex: 'none' })
    const cap = keycap(leftCol, door.key)
    tag(leftCol, door.note)

    // middle: title + desc
    const midCol = new Box(row, { d: 'flex', fd: 'column', gap: 4, flex: '1' })
    new Text(midCol, {
      text: door.title, fs: 26, ff: PIXEL, fw: 700, c: C.ink,
      lh: '1', letterSpacing: '-0.01em',
      transition: 'color 140ms',
    })
    new Text(midCol, {
      text: door.desc, fs: 11, c: C.dim, ff: MONO, lh: '1.5',
    })

    // right: index + arrow
    const rightCol = new Box(row, { d: 'flex', ai: 'center', gap: 14, flex: 'none' })
    meta(rightCol, `0${i + 1}`, { c: C.mute })
    const arrow = new Text(rightCol, {
      text: '→', fs: 16, c: C.mute,
      transition: 'transform 140ms, color 140ms',
    })

    row.on('mouseenter', () => {
      row.setStyle('backgroundColor', C.panel)
      row.setStyle('paddingLeft', '12px')
      arrow.setStyle('color', C.ink)
      arrow.setStyle('transform', 'translateX(5px)')
      cap.setStyle('borderColor', C.line2)
      cap.setStyle('color', C.ink)
    })
    row.on('mouseleave', () => {
      row.setStyle('backgroundColor', 'transparent')
      row.setStyle('paddingLeft', '2px')
      arrow.setStyle('color', C.mute)
      arrow.setStyle('transform', 'translateX(0)')
      cap.setStyle('borderColor', C.line)
      cap.setStyle('color', C.dim)
    })
    row.on('click', () => go(door.id))
  })

  // ── footer ──
  const foot = new Box(frame, {
    d: 'flex', jc: 'space-between', ai: 'center',
    h: 34, p: '0 14px', flex: 'none', bg: C.abyss,
    borderTop: `1px solid ${C.line}`, gap: 16,
  })
  meta(foot, '19.07N 72.87E · mumbai', { c: C.mute })
  meta(foot, 'csui · vanilla js · 0 deps', { c: C.mute, ta: 'right' })

  crosshair(frame, 'tl')
  crosshair(frame, 'tr')
  crosshair(frame, 'bl')
  crosshair(frame, 'br')
})

// ── keys ─────────────────────────────────────────────────────
DOORS.forEach(door => onKey(door.key, () => go(door.id)))
onKey('escape', () => go('home'))

// dev only — delete before shipping
csui.debug(false)

go('home')

export { app, DOORS }
