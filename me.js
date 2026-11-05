// ─────────────────────────────────────────────────────────────
// me.js — the "me" door
// rendered as a scene; no separate HTML document
// ─────────────────────────────────────────────────────────────
import { Box, Text, scene } from './lib/csui.js'
import { C, PIXEL, MONO, shell, backBar, line } from './ui.js'

scene('me', () => {
  const { wrap, body } = shell({ title: 'me', footerRight: 'the person, allegedly' })

  backBar(body, 'home', 'back')

  const pad = new Box(body, { p: '28px 24px', d: 'flex', fd: 'column', gap: 18 })

  new Text(pad, {
    text: "i'm rudra", fs: 'clamp(26px, 5vw, 44px)',
    ff: PIXEL, fw: 700, c: C.ink, d: 'block', lh: '1.05',
  })

  new Text(pad, {
    text: 'i build small, sharp tools on the web and i finish about half of them.',
    fs: 13, c: C.dim, lh: '1.7', d: 'block', maxW: '52ch',
  })

  // deliberately a plain list — no cards, sharp corners only
  const facts = new Box(pad, { d: 'flex', fd: 'column', mt: 6 })

  line(facts, 'based', 'mumbai, india')
  line(facts, 'working on', 'rendev — cheap static hosting', { dim: false })
  line(facts, 'half-finished', 'brokenhours, afterbell')
  line(facts, 'stack', 'vanilla js · csui · no frameworks')
  line(facts, 'fonts', 'pixelify sans / geist mono', { dim: true })

  const links = new Box(pad, { d: 'flex', gap: 14, mt: 8, flexWrap: 'wrap' })

  ;[
    { label: 'github', href: 'https://github.com/RudraDaDev' },
    { label: 'rendev.in', href: 'https://rendev.in' },
  ].forEach(l => {
    const a = new Text(links, {
      text: l.label, fs: 12, c: C.dim, ff: MONO,
      cursor: 'pointer', borderBottom: `1px solid ${C.line}`,
      transition: 'color 120ms, border-color 120ms',
    })
    a.on('mouseenter', () => {
      a.setStyle('color', C.ink)
      a.setStyle('borderBottomColor', C.ink)
    })
    a.on('mouseleave', () => {
      a.setStyle('color', C.dim)
      a.setStyle('borderBottomColor', C.line)
    })
    a.on('click', () => { window.open(l.href, '_blank', 'noopener') })
  })

  wrap.onMount(() => {})
})
