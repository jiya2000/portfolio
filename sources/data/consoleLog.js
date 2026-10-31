import * as THREE from 'three/webgpu'

const text = `
 █████╗ ██████╗ ██╗████████╗██╗    ███████╗██╗  ██╗ █████╗ ██████╗ ███╗   ███╗ █████╗ 
██╔══██╗██╔══██╗██║╚══██╔══╝██║    ██╔════╝██║  ██║██╔══██╗██╔══██╗████╗ ████║██╔══██╗
███████║██║  ██║██║   ██║   ██║    ███████╗███████║███████║██████╔╝██╔████╔██║███████║
██╔══██║██║  ██║██║   ██║   ██║    ╚════██║██╔══██║██╔══██║██╔══██╗██║╚██╔╝██║██╔══██║
██║  ██║██████╔╝██║   ██║   ██║    ███████║██║  ██║██║  ██║██║  ██║██║ ╚═╝ ██║██║  ██║
╚═╝  ╚═╝╚═════╝ ╚═╝   ╚═╝   ╚═╝    ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝

╔═ Intro ═══════════════╗
║ Welcome to Aditi Sharma's 3D Interactive Portfolio!
║ Integrated M.Tech CSE (Data Science) @ VIT Vellore | Software & AI Engineer
║ Explore my projects in Agentic AI, Cloud Ops, Rocket Telemetry, and Machine Learning.
╚═══════════════════════╝

╔═ Contact & Socials ═══╗
║ Mail           ⇒ aditisharma20004@gmail.com
║ GitHub         ⇒ https://github.com/jiya2000
║ LinkedIn       ⇒ https://www.linkedin.com/in/aditi-sharma-b2083a28b/
║ Repositories   ⇒ https://github.com/jiya2000?tab=repositories
╚═══════════════════════╝

╔═ Debug ═══════════════╗
║ You can access the debug mode by adding #debug at the end of the URL and reloading.
║ Press [V] to toggle the free camera.
╚═══════════════════════╝

╔═ Tech Stack ══════════╗
║ Three.js (release: ${THREE.REVISION}) + WebGPU & TSL Shaders
║ Rapier 3D Physics Engine
║ Vite & Vanilla JavaScript
║ Portfolio Source: https://github.com/jiya2000/portfolio
╚═══════════════════════╝

╔═ Some more links ═════╗
║ Rapier (Physics library)  ⇒ https://rapier.rs/
║ Howler.js (Audio library) ⇒ https://howlerjs.com/
║ Amatic SC (Fonts)         ⇒ https://fonts.google.com/specimen/Amatic+SC
║ Nunito (Fonts).           ⇒ https://fonts.google.com/specimen/Nunito?query=Nunito
╚═══════════════════════╝
`
let finalText = ''
let finalStyles = []
const stylesSet = {
    letter: 'color: #ffffff; font: 400 1em monospace;',
    pipe: 'color: #D66FFF; font: 400 1em monospace;',
}
let currentStyle = null
for(let i = 0; i < text.length; i++)
{
    const char = text[i]

    const style = char.match(/[╔║═╗╚╝╔╝]/) ? 'pipe' : 'letter'
    if(style !== currentStyle)
    {
        currentStyle = style
        finalText += '%c'

        finalStyles.push(stylesSet[currentStyle])
    }
    finalText += char
}

export default [finalText, ...finalStyles]