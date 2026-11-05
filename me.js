// ─────────────────────────────────────────────────────────────
// me.js — the "me" door
// asymmetric: sticky identity block left, spec table right
// ─────────────────────────────────────────────────────────────
import { Box, Text, scene } from './lib/csui.js'
import { C, PIXEL, MONO, shell, backBar, line, meta, rule, heading, crosshair } from './ui.js'

scene('me', () => {
  const { wrap, body } = shell({
    title: 'me',
    brandSuffix: '/person',
    path: '~/me',
    rail: 'rudra — mumbai — builds small sharp things',
    footerLeft: '19.07N 72.87E · mumbai',
    footerRight: 'the person, allegedly',
  })

  backBar(body, 'home', { path: '/person' })

  // two columns: identity | specs
  const cols = new Box(body, { d: 'flex', flex: '1', overflow: 'hidden' })

  // ── left: identity ──
  const idCol = new Box(cols, {
    w: 340, flex: 'none',
    p: '26px 22px',
    borderRight: `1px solid ${C.line}`,
    d: 'flex', fd: 'column', gap: 16,
  })

  heading(idCol, {
    eyebrow: '00 / person',
    title: "i'm rudra.",
    size: 'clamp(30px, 4.6vw, 46px)',
  })

  new Text(idCol, {
    text: 'i build small, sharp tools on the web and i finish about half of them.',
    fs: 12, c: C.dim, ff: MONO, lh: '1.8',
    d: 'block', maxW: '34ch', mt: 2,
  })

  rule(idCol)
  meta(idCol, 'currently', { c: C.mute })
  new Text(idCol, { text: 'rendev — cheap static hosting', fs: 12, ff: MONO, c: C.ink2, lh: '1.6' })

  meta(idCol, 'half-finished', { c: C.mute })
  new Text(idCol, { text: 'brokenhours · afterbell', fs: 12, ff: MONO, c: C.dim, lh: '1.6' })

  // links pinned to the bottom of the column
  const links = new Box(idCol, { d: 'flex', fd: 'column', gap: 6, mt: 'auto', pt: 16, borderTop: `1px solid ${C.line}` })

  ;[
    { label: 'github',   value: 'github.com/RudraDaDev', href: 'https://github.com/RudraDaDev' },
    { label: 'rendev',   value: 'rendev.in',             href: 'https://rendev.in' },
  ].forEach(l => {
    const row = new Box(links, {
      d: 'flex', jc: 'space-between', ai: 'center', gap: 10,
      cursor: 'pointer', p: '4px 0',
      transition: 'padding-left 120ms',
    })

    const label = new Text(row, { text: l.label, fs: 10, ff: MONO, c: C.mute, textTransform: 'uppercase', letterSpacing: '0.09em' })
    const value = new Text(row, { text: `${l.value} ↗`, fs: 11, ff: MONO, c: C.dim, transition: 'color 120ms' })

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

  // ── right: spec table ──
  const specCol = new Box(cols, { flex: '1', p: '26px 24px', d: 'flex', fd: 'column', pos: 'relative' })

  meta(specCol, 'spec sheet', { c: C.mute })
  rule(specCol, { m: '8px 0 0 0' })

  const table = new Box(specCol, { d: 'flex', fd: 'column', mt: 4 })

  line(table, 'based',        'mumbai, india')
  line(table, 'working on',   'rendev — static hosting')
  line(table, 'in progress',  'brokenhours games')
  line(table, 'stack',        'vanilla js · csui')
  line(table, 'no framework', 'by choice', { dim: true })
  line(table, 'fonts',        'pixelify sans / geist mono', { dim: true })
  line(table, 'language',     'js, a bit of rust', { dim: true })

  // a short "notes" block, offset — keeps the layout from being a plain table
  const notes = new Box(specCol, {
    mt: 24, p: '14px 16px',
    border: `1px solid ${C.line}`,
    bg: C.panel,
    maxW: 420,
    d: 'flex', fd: 'column', gap: 8,
    pos: 'relative',
  })
  crosshair(notes, 'tr')
  meta(notes, 'note', { c: C.mute })
  new Text(notes, {
    text: 'i do not use a framework and i do not plan to start. if the page needs 40kb of runtime to say three sentences, it is the wrong page.',
    fs: 11, c: C.dim, ff: MONO, lh: '1.8',
  })
})
