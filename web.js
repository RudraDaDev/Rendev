// ─────────────────────────────────────────────────────────────
// web.js — the rendev.in door
// product page: status board + segmented progress + waitlist
// wordmark is Pixelify Sans (it is the logo font for rendev.in)
// ─────────────────────────────────────────────────────────────
import { Box, Text, scene } from './lib/csui.js'
import { C, PIXEL, MONO, shell, backBar, line, meta, rule, heading, segmented, crosshair, tag } from './ui.js'

const TOTAL = 28
const DONE  = 11   // 11 / 28 ≈ 39%

scene('rendev', () => {
  const { wrap, body } = shell({
    title: 'rendev.in',
    brandFont: PIXEL,          // ← pixelify sans, per brand
    brandSuffix: '/product',
    path: '~/rendev.in',
    rail: 'rendev.in — static hosting — building in public',
    footerLeft: 'rendev.in · product',
    footerRight: 'not open yet',
  })

  backBar(body, 'home', { path: '/product' })

  const pad = new Box(body, { p: '26px 28px', d: 'flex', fd: 'column', flex: '1', overflow: 'auto' })

  // ── masthead: title left, status block right ──
  const head = new Box(pad, { d: 'flex', jc: 'space-between', ai: 'flex-end', gap: 24, flexWrap: 'wrap' })

  heading(head, {
    eyebrow: 'rendev.in / alpha',
    title: 'static sites.',
    sub: 'drop a folder, get a url, pay less than a coffee. no build step required — but bring one if you like.',
    size: 'clamp(32px, 5.4vw, 54px)',
  })

  const statusBox = new Box(head, {
    d: 'flex', fd: 'column', gap: 8,
    p: '12px 14px',
    border: `1px solid ${C.line}`,
    bg: C.panel,
    minW: 200, pos: 'relative',
  })
  crosshair(statusBox, 'tr')

  const statusRow = new Box(statusBox, { d: 'flex', jc: 'space-between', ai: 'center', gap: 16 })
  meta(statusRow, 'status', { c: C.mute })
  tag(statusRow, 'closed', { active: true })

  meta(statusBox, 'eta — undefined', { c: C.dim })
  meta(statusBox, 'free tier — one site', { c: C.dim })

  // ── progress readout ──
  const prog = new Box(pad, { d: 'flex', fd: 'column', gap: 8, mt: 26, maxW: 640 })

  const progHead = new Box(prog, { d: 'flex', jc: 'space-between', ai: 'baseline' })
  meta(progHead, 'build progress', { c: C.mute })
  meta(progHead, `${DONE} / ${TOTAL} units`, { c: C.dim })

  const bar = segmented(prog, { total: TOTAL, filled: 0 })

  const track = new Text(prog, {
    text: 'editor · deploy pipeline · billing · domains',
    fs: 10, ff: MONO, c: C.mute, letterSpacing: '0.04em',
  })

  // fill the segments in once mounted
  wrap.onMount(() => {
    const segs = [...bar.el.children]
    segs.forEach((seg, i) => {
      setTimeout(() => {
        if (i < DONE) seg.style.backgroundColor = C.ink
      }, 40 + i * 34)
    })
  })

  // ── spec table ──
  const specs = new Box(pad, { d: 'flex', fd: 'column', mt: 26 })

  const specGrid = new Box(specs, { d: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' })

  const leftSpecs = new Box(specGrid, { d: 'flex', fd: 'column' })
  line(leftSpecs, 'hosting',  'static only')
  line(leftSpecs, 'runtime',  'none')
  line(leftSpecs, 'stack',    'csui + vanilla js')

  const rightSpecs = new Box(specGrid, { d: 'flex', fd: 'column' })
  line(rightSpecs, 'pricing',    'undecided', { dim: true })
  line(rightSpecs, 'free tier',  'one site, forever', { dim: true })
  line(rightSpecs, 'ssl',        'included')

  // ── waitlist ──
  const wait = new Box(pad, {
    mt: 26, p: '16px',
    border: `1px solid ${C.line}`,
    bg: C.panel,
    maxW: 520,
    d: 'flex', fd: 'column', gap: 12,
    pos: 'relative',
  })
  crosshair(wait, 'tl')

  meta(wait, 'waitlist — local only', { c: C.mute })

  const form = new Box(wait, { d: 'flex', gap: 0, border: `1px solid ${C.line2}`, bg: C.abyss })

  const field = document.createElement('input')
  field.placeholder = 'you@email.com'
  Object.assign(field.style, {
    background: 'transparent', border: 'none', outline: 'none',
    color: C.ink, fontFamily: MONO, fontSize: '12px',
    padding: '0 10px', height: '34px', flex: '1', minWidth: '0',
  })
  form.el.appendChild(field)

  const btn = new Box(form, {
    d: 'flex', ai: 'center', jc: 'center',
    h: 34, p: '0 16px', bg: C.ink, cursor: 'pointer',
    transition: 'opacity 120ms', flex: 'none',
  })
  new Text(btn, { text: 'notify', fs: 11, c: C.abyss, ff: MONO, fw: 700, letterSpacing: '0.06em' })

  const msg = new Text(wait, { text: '', fs: 10, c: C.mute, ff: MONO, letterSpacing: '0.04em' })

  btn.on('mouseenter', () => btn.setStyle('opacity', '0.82'))
  btn.on('mouseleave', () => btn.setStyle('opacity', '1'))
  btn.on('click', () => {
    const v = field.value.trim()
    if (!/^\S+@\S+\.\S+$/.test(v)) {
      msg.text = '✕ that email looks wrong'
      msg.setStyle('color', '#ef4444')
      return
    }
    field.value = ''
    msg.text = '✓ saved locally — real signup lands with deploy'
    msg.setStyle('color', C.dim)
  })
})
