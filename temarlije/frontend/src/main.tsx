import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

// Inject SVG sprite into DOM so <use href="#..."/> works everywhere
// Vite allows importing raw file contents via ?raw
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import iconsSprite from './assets/icons.svg?raw'

const spriteHost = document.createElement('div')
spriteHost.style.position = 'absolute'
spriteHost.style.width = '0'
spriteHost.style.height = '0'
spriteHost.style.overflow = 'hidden'
spriteHost.setAttribute('aria-hidden', 'true')
spriteHost.innerHTML = iconsSprite
document.body.prepend(spriteHost)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

