// ─────────────────────────────────────────────────────────────
// rendev — landing page
// three doors: me / rendev.in / brokenhours studio
// theme: dark monochrome, sharp corners, pixel + mono type, retro-sleek
// keys 1 / 2 / 3 jump straight in
// ─────────────────────────────────────────────────────────────
import { App, Box, Text, csui, onKey } from './lib/csui.js'

const C = {
  bg:     '#0a0a0a',
  panel:  '#111111',
  ink:    '#f4f4f4',
  dim:    '#6b6b6b',
  line:   '#1e1e1e',
  accent: '#f4f4f4',
}

const PIXEL = "'Pixelify Sans', sans-serif"
const MONO  = "'Geist Mono', monospace"
const BRAND = "'Boldonse', sans-serif"

// ── shell ────────────────────────────────────────────────────
const app = new App({
  bg: C.bg, c: C.ink, ff: MONO,
  w: '100vw', h: '100vh',
  pos: 'relative', overflow: 'hidden',
  d: 'flex', jc: 'center', ai: 'center',
})

// faint grid, drawn with a repeating gradient — no image requests
app.setStyle('backgroundImage',
  'repeating-linear-gradient(0deg, #141414 0 1px, transparent 1px 48px),' +
  'repeating-linear-gradient(90deg, #141414 0 1px, transparent 1px 48px)')
app.setStyle('backgroundSize', '100% 100%')

// ── frame ────────────────────────────────────────────────────
const frame = new Box(app, {
  w: 'min(920px, 92vw)', h: 'min(620px, 88vh)',
  bg: C.panel, border: `1px solid ${C.line}`,
  d: 'flex', fd: 'column',
  pos: 'relative', overflow: 'hidden',
})

const topbar = new Box(frame, {
  d: 'flex', jc: 'space-between', ai: 'center',
  h: 44, p: '0 16px',
  borderBottom: `1px solid ${C.line}`,
  bg: C.bg,
})

new Text(topbar, {
  text: 'rendev', fs: 15, ff: BRAND, c: C.ink,
})

const clock = new Text(topbar, {
  text: '', fs: 12, c: C.dim,
})
const tick = () => { clock.text = new Date().toLocaleTimeString('en-IN', { hour12: false }) }
tick(); setInterval(tick, 1000)

// ── masthead ─────────────────────────────────────────────────
const head = new Box(frame, {
  p: '28px 24px 8px',
})

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

// ── doors ────────────────────────────────────────────────────
const doors = new Box(frame, {
  d: 'flex', fd: 'column',
  gap: 0, flex: '1', overflow: 'hidden',
})

const routes = [
  { key: '1', title: 'me',          desc: 'who is behind this, half-finished projects and all', href: './me.html',      accent: '#7dd3fc' },
  { key: '2', title: 'rendev.in',   desc: 'static sites, hosted cheap.  building it in public', href: './web.html',     accent: '#86efac' },
  { key: '3', title: 'brokenhours', desc: 'game studio + library.  coming soon',                href: './studio.html',  accent: '#fca5a5' },
]

const doorEls = []

routes.forEach((r, i) => {
  const row = new Box(doors, {
    d: 'flex', ai: 'center', gap: 18,
    p: '0 24px', h: 72, flex: 'none',
    borderTop: `1px solid ${C.line}`,
    cursor: 'pointer', userSelect: 'none',
    pos: 'relative', transition: 'background 140ms, padding-left 140ms',
  })

  new Text(row, { text: r.key, fs: 12, c: C.dim, ff: MONO, w: 12 })

  const mark = new Box(row, { w: 6, h: 6, bg: r.accent, br: 0, o: 0.35, transition: 'opacity 140ms, transform 140ms', transform: 'scale(1)' })

  const label = new Box(row, { d: 'flex', fd: 'column', gap: 3, flex: '1' })
  new Text(label, { text: r.title, fs: 20, ff: PIXEL, fw: 700, c: C.ink })
  new Text(label, { text: r.desc, fs: 12, c: C.dim, lh: '1.4' })

  const arrow = new Text(row, { text: '→', fs: 18, c: C.dim, mr: 2, transition: 'transform 140ms, color 140ms' })

  const go = () => {
    row.setStyle('backgroundColor', '#171717')
    setTimeout(() => { window.location.href = r.href }, 90)
  }

  row.on('click', go)
  row.on('mouseenter', () => {
    row.setStyle('backgroundColor', '#161616')
    row.setStyle('paddingLeft', '32px')
    mark.setStyle('opacity', '1')
    mark.setStyle('transform', 'scale(1.6)')
    arrow.setStyle('transform', 'translateX(4px)')
    arrow.setStyle('color', C.ink)
  })
  row.on('mouseleave', () => {
    row.setStyle('backgroundColor', 'transparent')
    row.setStyle('paddingLeft', '24px')
    mark.setStyle('opacity', '0.35')
    mark.setStyle('transform', 'scale(1)')
    arrow.setStyle('transform', 'translateX(0)')
    arrow.setStyle('color', C.dim)
  })
  doorEls.push({ row, go, title: r.title })
  onKey(r.key, go)
})

// ── footer ───────────────────────────────────────────────────
const foot = new Box(frame, {
  d: 'flex', jc: 'space-between', ai: 'center',
  h: 40, p: '0 24px', bg: C.bg,
  borderTop: `1px solid ${C.line}`,
})

new Text(foot, { text: 'mumbai, in', fs: 11, c: C.dim })
new Text(foot, { text: 'v0.1 · not finished', fs: 11, c: C.dim })

csui.debug(false)

// tiny self-check so the page shouts if the layout broke
if (frame.el.children.length !== 4) {
  console.error(`[rendev] expected 4 frame sections, got ${frame.el.children.length}`)
}

export { app, frame, doorEls }
