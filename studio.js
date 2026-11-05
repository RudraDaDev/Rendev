// ─────────────────────────────────────────────────────────────
// studio.js — the brokenhours door
// game studio + library, still empty. the grid is the point.
// ─────────────────────────────────────────────────────────────
import { Box, Text, scene, toast } from './lib/csui.js'
import { C, PIXEL, MONO, shell, backBar } from './ui.js'

const GAMES = [
  { slot: '01', name: 'afterbell',      note: 'school social app — private build', state: 'not a game, shh' },
  { slot: '02', name: 'untitled_02',    note: 'two-button platformer',             state: 'prototype' },
  { slot: '03', name: 'untitled_03',    note: 'physics toy, matter.js',            state: 'idea' },
  { slot: '04', name: '—',              note: 'empty slot',                        state: 'open' },
]

scene('brokenhours', () => {
  const { wrap, body } = shell({
    title: 'brokenhours',
    brandFont: PIXEL,
    footerRight: '0 games shipped, 4 planned',
  })

  backBar(body, 'home', 'back')

  const pad = new Box(body, { p: '28px 24px', d: 'flex', fd: 'column', gap: 18 })

  new Text(pad, {
    text: 'brokenhours', fs: 'clamp(26px, 5vw, 44px)',
    ff: PIXEL, fw: 700, c: C.ink, d: 'block', lh: '1.05',
  })
  new Text(pad, {
    text: 'a tiny studio for tiny games. the library opens when the first one is playable.',
    fs: 13, c: C.dim, lh: '1.7', d: 'block', maxW: '52ch',
  })

  // ── grid ──
  const grid = new Box(pad, {
    d: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 1, bg: C.line, border: `1px solid ${C.line}`, mt: 6,
  })

  GAMES.forEach(g => {
    const cell = new Box(grid, {
      bg: C.panel, p: '14px 16px',
      d: 'flex', fd: 'column', gap: 4,
      pos: 'relative', overflow: 'hidden',
      transition: 'background 140ms',
    })

    const top = new Box(cell, { d: 'flex', jc: 'space-between', ai: 'center', gap: 10 })
    new Text(top, { text: g.slot, fs: 10, c: C.dim, ff: MONO })
    new Text(top, { text: g.state, fs: 10, c: C.dim, ff: MONO })

    new Text(cell, { text: g.name, fs: 16, ff: PIXEL, fw: 700, c: C.ink, mt: 2 })
    new Text(cell, { text: g.note, fs: 11, c: C.dim, ff: MONO, lh: '1.5' })

    if (g.state !== 'open') {
      cell.on('mouseenter', () => cell.setStyle('backgroundColor', C.faint))
      cell.on('mouseleave', () => cell.setStyle('backgroundColor', C.panel))
      cell.on('click', () => toast(`${g.name} — ${g.state}`, { type: 'info', duration: 1600 }))
    }
  })

  // ── status line ──
  new Text(pad, {
    text: 'no store page, no wishlist, no trailer. just this grid.',
    fs: 11, c: C.dim, ff: MONO, mt: 10, d: 'block',
  })

  // subtle: cell borders shift when the whole grid is hovered
  wrap.onMount(() => {
    grid.on('mouseenter', () => grid.setStyle('backgroundColor', '#262626'))
    grid.on('mouseleave', () => grid.setStyle('backgroundColor', C.line))
  })
})
