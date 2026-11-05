// ─────────────────────────────────────────────────────────────
// web.js — the rendev.in door
// "static sites, hosted cheap" — status board while it's building
// ─────────────────────────────────────────────────────────────
import { Box, Text, scene } from './lib/csui.js'
import { C, PIXEL, MONO, shell, backBar, line } from './ui.js'

scene('rendev', () => {
  const { wrap, body } = shell({
    title: 'rendev.in',
    brandFont: MONO,
    footerRight: 'building in public',
  })

  backBar(body, 'home', 'back')

  const pad = new Box(body, { p: '28px 24px', d: 'flex', fd: 'column', gap: 18 })

  new Text(pad, {
    text: 'static sites.', fs: 'clamp(26px, 5vw, 44px)',
    ff: PIXEL, fw: 700, c: C.ink, d: 'block', lh: '1.05',
  })
  new Text(pad, {
    text: 'hosted insanely cheap. drop a folder, get a url, pay less than a coffee.',
    fs: 13, c: C.dim, lh: '1.7', d: 'block', maxW: '52ch',
  })

  // ── status board ──
  const board = new Box(pad, { d: 'flex', fd: 'column', mt: 6 })

  line(board, 'status', 'not open yet')
  line(board, 'pricing', 'undecided', { dim: true })
  line(board, 'stack', 'csui + vanilla js')
  line(board, 'free tier', 'one site, forever', { dim: true })

  // ── progress ──
  const prog = new Box(pad, { d: 'flex', fd: 'column', gap: 8, mt: 6, maxW: 360 })
  const track = new Box(prog, {
    w: '100%', h: 4, bg: C.line,
    pos: 'relative', overflow: 'hidden',
  })
  const fill = new Box(track, { h: '100%', w: '38%', bg: C.ink })

  const pct = new Text(pad, { text: '38% — editor, deploy and billing still missing', fs: 11, c: C.dim, ff: MONO })

  // the bar animates in once mounted so the page isn't static on arrival
  wrap.onMount(() => {
    fill.setStyle('width', '0%')
    fill.setStyle('transition', 'width 900ms cubic-bezier(.2,.8,.2,1)')
    requestAnimationFrame(() => requestAnimationFrame(() => {
      fill.setStyle('width', '38%')
    }))
  })

  // ── waitlist ──
  const form = new Box(pad, { d: 'flex', gap: 8, mt: 12, flexWrap: 'wrap' })

  const input = new Box(form, {
    d: 'flex', ai: 'center',
    w: 240, h: 34, p: '0 10px',
    border: `1px solid ${C.line}`, bg: C.bg,
  })

  const field = document.createElement('input')
  field.placeholder = 'you@email.com'
  Object.assign(field.style, {
    background: 'transparent', border: 'none', outline: 'none',
    color: C.ink, fontFamily: MONO, fontSize: '12px', width: '100%',
  })
  input.addChild(field)

  const btn = new Box(form, {
    d: 'flex', ai: 'center', jc: 'center',
    h: 34, p: '0 16px', bg: C.ink, cursor: 'pointer',
    transition: 'opacity 140ms',
  })
  new Text(btn, { text: 'notify me', fs: 12, c: C.bg, ff: MONO, fw: 700 })

  btn.on('mouseenter', () => btn.setStyle('opacity', '0.8'))
  btn.on('mouseleave', () => btn.setStyle('opacity', '1'))
  btn.on('click', () => {
    const v = field.value.trim()
    if (!/^\S+@\S+\.\S+$/.test(v)) {
      field.style.borderColor = '#ef4444'
      pct.text = 'that email looks wrong'
      return
    }
    field.style.borderColor = C.line
    field.value = ''
    pct.text = `saved locally (${v.length} chars) — real signup lands with deploy`
  })
})
