// boilerplate
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