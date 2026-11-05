// ─────────────────────────────────────────────────────────────
// main.js — rendev landing
// one page, many scenes. no HTML, no CSS files, vanilla JS only.
// keys: 1 / 2 / 3 open a door, esc goes back
// ─────────────────────────────────────────────────────────────
import { App, Box, Text, scene, go, onKey, csui } from './lib/csui.js'
import { C, PIXEL, MONO, BRAND, grid } from './ui.js'

// ── root ─────────────────────────────────────────────────────
const app = new App({
  bg: C.bg, c: C.ink, ff: MONO,
  w: '100vw', h: '100vh',
  pos: 'relative', overflow: 'hidden',
  d: 'flex', jc: 'center', ai: 'center',
})
grid(app)

// ── home ─────────────────────────────────────────────────────
const doors = [
  { key: '1', id: 'me',          title: 'me',          desc: 'who is behind this, half-finished projects and all', accent: '#7dd3fc' },
  { key: '2', id: 'rendev',      title: 'rendev.in',   desc: 'static sites, hosted cheap.  building it in public', accent: '#86efac' },
  { key: '3', id: 'brokenhours', title: 'brokenhours', desc: 'game studio + library.  coming soon',                accent: '#fca5a5' },
]

scene('home', () => {
  const frame = new Box(null, {
    w: 'min(920px, 92vw)', h: 'min(620px, 88vh)',
    bg: C.panel, border: `1px solid ${C.line}`,
    d: 'flex', fd: 'column', overflow: 'hidden',
  })

  // topbar
  const topbar = new Box(frame, {
    d: 'flex', jc: 'space-between', ai: 'center',
    h: 44, p: '0 16px', flex: 'none', bg: C.bg,
    borderBottom: `1px solid ${C.line}`,
  })
  new Text(topbar, { text: 'rendev', fs: 15, ff: BRAND, c: C.ink })

  const clock = new Text(topbar, { text: '', fs: 12, c: C.dim })
  const tick = () => { clock.text = new Date().toLocaleTimeString('en-IN', { hour12: false }) }
  tick()
  const timer = setInterval(tick, 1000)
  frame.onDestroy(() => clearInterval(timer))

  // masthead
  const head = new Box(frame, { p: '28px 24px 8px', flex: 'none' })
  new Text(head, {
    text: 'pick a door',
    fs: 'clamp(28px, 6vw, 52px)',
    ff: PIXEL, fw: 700, c: C.ink,
    d: 'block', lh: '1.05',
  })
  new Text(head, {
    text: 'sharper than it looks. press 1 – 3 or click.',
    fs: 13, c: C.dim, mt: 10, d: 'block',
  })

  // doors
  const list = new Box(frame, { d: 'flex', fd: 'column', flex: '1', overflow: 'hidden' })

  doors.forEach(door => {
    const row = new Box(list, {
      d: 'flex', ai: 'center', gap: 18,
      p: '0 24px', h: 72, flex: 'none',
      borderTop: `1px solid ${C.line}`,
      cursor: 'pointer', userSelect: 'none',
      transition: 'background 140ms, padding-left 140ms',
    })

    new Text(row, { text: door.key, fs: 12, c: C.dim, w: 12 })

    const dot = new Box(row, {
      w: 6, h: 6, bg: door.accent, br: 0,
      o: 0.35, transition: 'opacity 140ms, transform 140ms',
    })

    const label = new Box(row, { d: 'flex', fd: 'column', gap: 3, flex: '1' })
    new Text(label, { text: door.title, fs: 20, ff: PIXEL, fw: 700, c: C.ink })
    new Text(label, { text: door.desc, fs: 12, c: C.dim, lh: '1.4' })

    const arrow = new Text(row, { text: '→', fs: 18, c: C.dim, mr: 2, transition: 'transform 140ms, color 140ms' })

    row.on('mouseenter', () => {
      row.setStyle('backgroundColor', C.faint)
      row.setStyle('paddingLeft', '32px')
      dot.setStyle('opacity', '1')
      dot.setStyle('transform', 'scale(1.6)')
      arrow.setStyle('transform', 'translateX(4px)')
      arrow.setStyle('color', C.ink)
    })
    row.on('mouseleave', () => {
      row.setStyle('backgroundColor', 'transparent')
      row.setStyle('paddingLeft', '24px')
      dot.setStyle('opacity', '0.35')
      dot.setStyle('transform', 'scale(1)')
      arrow.setStyle('transform', 'translateX(0)')
      arrow.setStyle('color', C.dim)
    })
    row.on('click', () => go(door.id))
  })

  // footer
  const foot = new Box(frame, {
    d: 'flex', jc: 'space-between', ai: 'center',
    h: 40, p: '0 24px', flex: 'none', bg: C.bg,
    borderTop: `1px solid ${C.line}`,
  })
  new Text(foot, { text: 'mumbai, in', fs: 11, c: C.dim })
  new Text(foot, { text: 'three doors · one page', fs: 11, c: C.dim })
})

// ── keys ─────────────────────────────────────────────────────
doors.forEach(door => onKey(door.key, () => go(door.id)))
onKey('escape', () => go('home'))

// dev only — delete before shipping
csui.debug(false)

// boot
go('home')

export { app }
