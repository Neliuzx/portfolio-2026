import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import '../App.css'
import ExitButton from '../ui/ExitButton'

const htmlCode = `<section class="hero">
  <h1>Neliuzx</h1>
</section>`

const cssCode = `.hero {
  display: flex;
  background: #000;
}`

const jsCode = `const cube = new THREE
  .BoxGeometry()
scene.add(cube)`


const C = '?color=%23EDEDED'

const tools = [
  { name: 'Illustrator', logo: `https://api.iconify.design/skill-icons/illustrator.svg`, link: 'https://www.adobe.com/products/illustrator.html' },
  { name: 'Photoshop', logo: `https://api.iconify.design/skill-icons/photoshop.svg`, link: 'https://www.adobe.com/products/photoshop.html' },
  { name: 'Lightroom', logo: `https://api.iconify.design/simple-icons/adobelightroom.svg${C}`, link: 'https://www.adobe.com/products/photoshop-lightroom.html' },
  { name: 'Figma', logo: `https://api.iconify.design/skill-icons/figma-dark.svg`, link: 'https://www.figma.com' },
  { name: 'Canva', logo: `https://api.iconify.design/simple-icons/canva.svg${C}`, link: 'https://www.canva.com' },
  { name: 'Dribbble', logo: `https://api.iconify.design/simple-icons/dribbble.svg${C}`, link: 'https://dribbble.com' },
  { name: 'VS Code', logo: `https://api.iconify.design/skill-icons/vscode-dark.svg`, link: 'https://code.visualstudio.com' },
  { name: 'Git', logo: `https://api.iconify.design/skill-icons/git.svg`, link: 'https://git-scm.com' },
  { name: 'GitHub', logo: `https://api.iconify.design/simple-icons/github.svg${C}`, link: 'https://github.com' },
  { name: 'Vite', logo: `https://api.iconify.design/skill-icons/vite-dark.svg`, link: 'https://vitejs.dev' },
  { name: 'Nginx', logo: `https://api.iconify.design/skill-icons/nginx.svg`, link: 'https://nginx.org' },
  { name: 'WordPress', logo: `https://api.iconify.design/skill-icons/wordpress.svg`, link: 'https://wordpress.org' },
  { name: 'Webflow', logo: `https://api.iconify.design/simple-icons/webflow.svg${C}`, link: 'https://webflow.com' },
  { name: 'Shopify', logo: `https://api.iconify.design/simple-icons/shopify.svg${C}`, link: 'https://www.shopify.com' },
  { name: 'Notion', logo: `https://api.iconify.design/simple-icons/notion.svg${C}`, link: 'https://www.notion.so' },
  { name: 'Google Analytics', logo: `https://api.iconify.design/simple-icons/googleanalytics.svg${C}`, link: 'https://analytics.google.com' },
  { name: 'Cursor', logo: `https://api.iconify.design/simple-icons/cursor.svg${C}`, link: 'https://cursor.com' },
  { name: 'Lottiefiles', logo: `https://api.iconify.design/simple-icons/lottiefiles.svg${C}`, link: 'https://lottiefiles.com' },
  { name: 'Claude AI', logo: `https://api.iconify.design/simple-icons/anthropic.svg${C}`, link: 'https://claude.ai' },
  { name: 'Gmail', logo: `https://api.iconify.design/skill-icons/gmail-light.svg`, link: 'https://mail.google.com' },
  { name: 'Adobe Fonts', logo: `https://api.iconify.design/simple-icons/adobefonts.svg${C}`, link: 'https://fonts.adobe.com/#old_hash=&from_ims=true?client_id=TypeKit2&api=logout' },
]

const domains = [
  { index: '01', name: 'Web Dev', title: 'Web Development', desc: 'I build fast, accessible and modern web experiences.' },
  { index: '02', name: 'Graphic Design', title: 'Graphic Design', desc: 'I create visual identities and editorial layouts.' },
  { index: '03', name: 'UX / UI', title: 'UX / UI Design', desc: 'I design intuitive and beautiful user interfaces.' },
  { index: '04', name: 'Creative Dev', title: 'Creative Development', desc: 'I create immersive 3D and interactive experiences.' },
]

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  )
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return isMobile
}

function Terminal({ code, isMobile }) {
  const [displayed, setDisplayed] = useState(code)
  const intervalRef = useRef(null)

  const play = () => {
    clearInterval(intervalRef.current)
    setDisplayed('')
    let i = 0
    intervalRef.current = setInterval(() => {
      i++
      setDisplayed(code.slice(0, i))
      if (i >= code.length) clearInterval(intervalRef.current)
    }, 20)
  }

  const reset = () => {
    clearInterval(intervalRef.current)
    setDisplayed(code)
  }

  const handlers = isMobile
    ? { onClick: play }
    : { onMouseEnter: play, onMouseLeave: reset }

  return (
    <div className="lang-terminal" {...handlers}>
      <div className="terminal-header">
        <span className="dot red"></span>
        <span className="dot yellow"></span>
        <span className="dot green"></span>
      </div>
      <pre className="terminal-code">{displayed}</pre>
    </div>
  )
}

function SkillsOverlay({ activeOverlay, setActiveOverlay }) {
  const [activeCategory, setActiveCategory] = useState('Domains')
  const isMobile = useIsMobile()

  useEffect(() => {
    gsap.fromTo('.skills-content', { opacity: 0 }, { opacity: 1, duration: 0.3 })
  }, [activeCategory])

  if (activeOverlay !== 'skills') return null

  return (
    <div className="skills-container">
      <div className="skills-menu">
        <ul>
          <li className={activeCategory === 'Domains' ? 'active' : ''} onClick={() => setActiveCategory('Domains')}>Domains</li>
          <li className={activeCategory === 'Languages' ? 'active' : ''} onClick={() => setActiveCategory('Languages')}>Languages</li>
          <li className={activeCategory === 'Tools' ? 'active' : ''} onClick={() => setActiveCategory('Tools')}>Tools</li>
        </ul>
      </div>

      <div className="skills-content">

        {activeCategory === 'Languages' && (
          <div className="languages-content">
            <div className="lang-row">
              <img src="https://api.iconify.design/skill-icons/html.svg" alt="HTML" className="lang-logo" />
              <Terminal code={htmlCode} isMobile={isMobile} />
            </div>

            <div className="css-row">
              <div className="lang-row reverse">
                <img src="https://api.iconify.design/skill-icons/css.svg" alt="CSS" className="lang-logo" />
                <Terminal code={cssCode} isMobile={isMobile} />
              </div>
              <div className="frameworks-container">
                <span className="frameworks-title">Frameworks / Librarys</span>
                <div className="frameworks-row">
                  <div className="icon-framework">
                    <a href="https://tailwindcss.com/" target="blank">
                      <img src="https://api.iconify.design/skill-icons/tailwindcss-dark.svg" className="frameworks-icons" height="40px" alt="Logo Tailwind" />
                    </a>
                    <label>Tailwind</label>
                  </div>
                  <div className="icon-framework">
                    <a href="https://getbootstrap.com/" target="blank">
                      <img src="https://api.iconify.design/skill-icons/bootstrap.svg" className="frameworks-icons" height="40px" alt="Logo Bootstrap" />
                    </a>
                    <label>Bootstrap</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="javascript-row">
              <div className="lang-row">
                <img src="https://api.iconify.design/skill-icons/javascript.svg" alt="JS" className="lang-logo" />
                <Terminal code={jsCode} isMobile={isMobile} />
              </div>
              <div className="frameworks-container">
                <span className="frameworks-title">Frameworks / Librarys</span>
                <div className="frameworks-row">
                  <div className="icon-framework">
                    <a href="https://react.dev" target="blank">
                      <img src="https://api.iconify.design/skill-icons/react-dark.svg" className="frameworks-icons" height="40px" alt="Logo React" />
                    </a>
                    <label>React</label>
                  </div>
                  <div className="icon-framework">
                    <a href="https://threejs.org/" target="blank">
                      <img src="https://api.iconify.design/skill-icons/threejs-dark.svg" className="frameworks-icons" height="40px" alt="Logo Threejs" />
                    </a>
                    <label>ThreeJS</label>
                  </div>
                  <div className="icon-framework">
                    <a href="https://www.chartjs.org/" target="blank">
                      <img src="https://api.iconify.design/simple-icons/chartdotjs.svg?color=%23FF6384" className="frameworks-icons" height="40px" alt="Logo Chartjs" />
                    </a>
                    <label>ChartJS</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'Tools' && (
          <div className="tools-content">
            <div className="tools-grid">
              {tools.map((tool) => (
                <div className="tool-item" key={tool.name}>
                  <div className="tool-icon">
                    <a href={tool.link} target="blank">
                      <img src={tool.logo} alt={tool.name} />
                    </a>
                  </div>
                  <span className="tool-name">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeCategory === 'Domains' && (
          <div className="domains-content">
            <div className="domains-grid">
              {domains.map((d) => (
                <div className="domain-col" key={d.index}>
                  <span className="index-domain">{d.index}</span>
                  <div className="domain-name">{d.name}</div>
                  <div className="col-card">
                    <div className="card-title">{d.title}</div>
                    <div className="card-desc">{d.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <ExitButton setActiveOverlay={setActiveOverlay} />
    </div>
  )
}

export default SkillsOverlay