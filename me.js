import { App, Box, Text, Button, Rectangle, csui } from './lib/csui.js'

// dev only, delete before shipping
csui.debug(true)
/* Example 1: Using Pixelify Sans for headings 
h1 {
  font-family: 'Pixelify Sans', sans-serif;
  font-weight: 700;
}

-- Example 2: Using Geist Mono for code blocks --
code, pre {
  font-family: 'Geist Mono', monospace;
  font-weight: 400;
}

-- Example 3: Using Boldonse for specific titles --
.brand-title {
  font-family: 'Boldonse', sans-serif;
}
*/
// ---------- root ----------
const app = new App({
  bg: '#0a0a0a',
  c: '#fff',
  ff: 'system-ui, sans-serif',
  w: '100vw',
  h: '100vh',
  pos: 'relative',
  overflow: 'hidden',
})

const lefte = new Box("lefte",{
  w: 550,
  h: 900,
  bg: '#000000',
  pos: 'absolute',
  top: 0,
  left: 0,
})

// --- content ---

const ribbon = new Rectangle('lefte',{
    w: 600,
    h: 90,
    bg: '#333131',
    rotation: 145,
    pos: 'absolute',
    top: -10,
    left: -90,
})

const web = new Text('lefte',{
    text: 'rendev.in',
    c: '#fff',
    ff: "'Pixelify Sans', sans-serif",
    pos: 'absolute',
    top: 60,
    left: 10,
    fs: 50,
    rotation: -35
})
const webarr = new Text('lefte',{
    text: '>',
    c: '#fff',
    ff: "'Pixelify Sans', sans-serif",
    pos: 'absolute',
    top: 149,
    left: 10,
    fs: 30,
    rotation: -35
})

const head = new Text('lefte',{
    text: "I'm",
    c: '#fff',
    ff: "'Pixelify Sans', sans-serif",
    pos: 'absolute',
    top: 200,
    left: 10,
    fs: 50,
  
})
app.addChild(lefte)