// ─────────────────────────────────────────────────────────────
// studio.js — the brokenhours door
// game library grid, deliberately empty. the grid is the product.
// ─────────────────────────────────────────────────────────────
import { Box, Text, scene, toast } from './lib/csui.js'
import { C, PIXEL, MONO, shell, backBar, meta, rule, heading, tag, crosshair } from './ui.js'

const GAMES = [
  { slot: '01', name: 'afterbell',   note: 'school social app — private build', state: 'not a game' },
  { slot: '02', name: 'untitled_02', note: 'two-button platformer',             state: 'prototype'  },
  { slot: '03', name: 'untitled_03', note: 'physics toy · matter.js',           state: 'idea'       },
  { slot: '04', name: '—',           note: 'empty slot',                        state: 'open'       },
]

scene('brokenhours', () => {
  const { wrap, body } = shell({
    title: 'brokenhours',
    brandFont: PIXEL,
    brandSuffix: '/studio',
    path: '~/brokenhours',
    rail: 'brokenhours — games — 0 shipped 4 planned',
    footerLeft: 'brokenhours · studio',
    footerRight: '0 shipped / 4 planned',
  })

  backBar(body, 'home', { path: '/studio' })

  const pad = new Box(body, { p: '26px 28px', d: 'flex', fd: 'column', flex: '1', overflow: 'auto' })

  // ── masthead ──
  const head = new Box(pad, { d: 'flex', jc: 'space-between', ai: 'flex-end', gap: 24, flexWrap: 'wrap' })

  heading(head, {
    eyebrow: 'brokenhours / studio',
    title: 'a tiny studio.',
    sub: 'the library opens when the first one is playable. until then, this is the whole studio.',
    size: 'clamp(32px, 5.4vw, 54px)',
  })

  const counter = new Box(head, {
    d: 'flex', fd: 'column', gap: 6, alignItems: 'flex-end',
    minW: 150, pos: 'relative',
  })
  meta(counter, 'library', { c: C.mute })
  new Text(counter, { text: '00', fs: 46, ff: PIXEL, fw: 700, c: C.ink, lh: '1' })
  meta(counter, 'playable titles', { c: C.mute, ta: 'right' })

  // ── grid ──
  const gridWrap = new Box(pad, { mt: 26 })

  const headRow = new Box(gridWrap, { d: 'flex', jc: 'space-between', ai: 'center', mb: 8 })
  meta(headRow, 'slots', { c: C.mute })
  const gridState = meta(headRow, 'idle', { c: C.mute })

  const cells = new Box(gridWrap, {
    d: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 1, bg: C.line,
    border: `1px solid ${C.line}`,
  })

  GAMES.forEach(g => {
    const open = g.state === 'open'

    const cell = new Box(cells, {
      bg: C.bg, p: '16px 18px',
      d: 'flex', fd: 'column', gap: 6,
      pos: 'relative', minHeight: 118,
      cursor: open ? 'default' : 'pointer',
      transition: 'background 140ms',
    })

    const top = new Box(cell, { d: 'flex', jc: 'space-between', ai: 'center', gap: 10 })
    meta(top, g.slot, { c: C.mute })
    tag(top, g.state, { active: g.state === 'prototype' })

    new Text(cell, {
      text: g.name, fs: 22, ff: PIXEL, fw: 700,
      c: open ? C.mute : C.ink, mt: 2, lh: '1.1',
    })
    new Text(cell, {
      text: g.note, fs: 10, c: C.mute, ff: MONO, lh: '1.6',
      letterSpacing: '0.04em',
    })

    if (!open) {
      // hairline "open" affordance, bottom-right
      const goMark = new Text(cell, {
        text: '→', fs: 13, c: C.mute,
        pos: 'absolute', bottom: 12, right: 14,
        transition: 'transform 140ms, color 140ms',
      })

      cell.on('mouseenter', () => {
        cell.setStyle('backgroundColor', C.raised)
        goMark.setStyle('color', C.ink)
        goMark.setStyle('transform', 'translateX(4px)')
        gridState.text = 'hover · ' + g.slot
      })
      cell.on('mouseleave', () => {
        cell.setStyle('backgroundColor', C.bg)
        goMark.setStyle('color', C.mute)
        goMark.setStyle('transform', 'translateX(0)')
        gridState.text = 'idle'
      })
      cell.on('click', () => toast(`${g.name} — ${g.state}`, {
        type: 'info', duration: 1600, bg: C.panel, color: C.ink,
        radius: '0', fontSize: '11px',
      }))
    }
  })

  // ── note ──
  const note = new Box(pad, {
    mt: 22, p: '14px 16px',
    border: `1px solid ${C.line}`,
    bg: C.panel,
    maxW: 460,
    pos: 'relative',
    d: 'flex', fd: 'column', gap: 6,
  })
  crosshair(note, 'br')
  meta(note, 'studio note', { c: C.mute })
  new Text(note, {
    text: 'no store page, no wishlist, no trailer. just this grid, until something is actually playable.',
    fs: 11, c: C.dim, ff: MONO, lh: '1.8',
  })
})
