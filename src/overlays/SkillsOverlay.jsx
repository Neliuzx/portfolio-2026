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

const frameworks = [
  {
    name: 'React',
    logo: './src/icons/react_light.svg',
    overlayLogo: './src/icons/react_light.svg',
    description: 'Library JavaScript pour construire des interfaces utilisateur avec des composants.',
    large: false
  },
  {
    name: 'Three.js',
    overlayLogo: './src/icons/threejs-light.svg',
    logo: './src/icons/threejs-dark.svg',
    description: 'Library 3D pour le web, scènes, géométries, shaders et WebGL simplifié.',
    large: true
  },
  {
    name: 'Tailwind',
    overlayLogo: './src/icons/tailwindcss.svg',
    logo: './src/icons/tailwindcss.svg',
    description: 'Framework CSS utility-first pour styliser rapidement sans quitter le HTML.',
    large: false
  },
  {
    name: 'Chart.js',
    overlayLogo: './src/icons/chartjs.svg',
    logo: './src/icons/chartjs.svg',
    description: 'Library de visualisation de données et création de graphiques interactifs et configurables.',
    large: false
  },
  {
    name: 'Bootstrap',
    overlayLogo: './src/icons/bootstrap.svg',
    logo: './src/icons/bootstrap.svg',
    description: 'Framework CSS pour des interfaces responsives avec des composants prêts à l\'emploi.',
    large: false
  }
]

const tools = [
  { name: 'Illustrator', logo: './src/icons/illustrator.svg', link: 'https://www.adobe.com/products/illustrator.html' },
  { name: 'Photoshop', logo: './src/icons/photoshop.svg', link: 'https://www.adobe.com/products/photoshop.html' },
  { name: 'Lightroom', logo: './src/icons/lightroom.svg', link: 'https://www.adobe.com/products/photoshop-lightroom.html' },
  { name: 'Figma', logo: './src/icons/figma.svg', link: 'https://www.figma.com' },
  { name: 'Canva', logo: './src/icons/canva.svg', link: 'https://www.canva.com' },
  { name: 'Dribbble', logo: './src/icons/dribbble.svg', link: 'https://dribbble.com' },
  { name: 'VS Code', logo: './src/icons/vscode.svg', link: 'https://code.visualstudio.com' },
  { name: 'Git', logo: './src/icons/git.svg', link: 'https://git-scm.com' },
  { name: 'GitHub', logo: './src/icons/github_dark.svg', link: 'https://github.com' },
  { name: 'Vite', logo: './src/icons/vite.svg', link: 'https://vitejs.dev' },
  { name: 'Nginx', logo: './src/icons/nginx.svg', link: 'https://nginx.org' },
  { name: 'WordPress', logo: './src/icons/wordpress.svg', link: 'https://wordpress.org' },
  { name: 'Webflow', logo: './src/icons/webflow.svg', link: 'https://webflow.com' },
  { name: 'Shopify', logo: './src/icons/shopify.svg', link: 'https://www.shopify.com' },
  { name: 'Notion', logo: './src/icons/notion.svg', link: 'https://www.notion.so' },
  { name: 'Trello', logo: './src/icons/trello.svg', link: 'https://trello.com' },
  { name: 'Google Analytics', logo: './src/icons/google-analytics.svg', link: 'https://analytics.google.com' },
  { name: 'Cursor', logo: './src/icons/cursor_dark.svg', link: 'https://cursor.com' },
  { name: 'Lottiefiles', logo: './src/icons/lottiefiles.svg', link: 'https://lottiefiles.com' },
  { name: 'Claude AI', logo: './src/icons/claude-ai-icon.svg', link: 'https://claude.ai' },
  { name: 'Gmail', logo: './src/icons/gmail.svg', link: 'https://mail.google.com' },
  { name: 'Adobe Fonts', logo: './src/icons/fonts.svg', link: 'https://fonts.adobe.com/#old_hash=&from_ims=true?client_id=TypeKit2&api=logout' },
]

function Terminal({ code }) {
  const [displayed, setDisplayed] = useState(code)
  const intervalRef = useRef(null)

  const handleMouseEnter = () => {
    setDisplayed('')
    let i = 0
    intervalRef.current = setInterval(() => {
      i++
      setDisplayed(code.slice(0, i))
      if(i >= code.length) clearInterval(intervalRef.current)
    }, 20)
  }

  const handleMouseLeave = () => {
    clearInterval(intervalRef.current)
    setDisplayed(code)
  }

  return (
    <div className="lang-terminal" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
  const [activeFramework, setActiveFramework] = useState(null)

  useEffect(() => {
    gsap.fromTo('.skills-content',
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    )
  }, [activeCategory])

  if(activeOverlay !== 'skills') return null

  return (
    <>
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
                <img src="./src/icons/html5.svg" alt="HTML" className="lang-logo"/>
                <Terminal code={htmlCode}/>
              </div>

              <div className="css-row">
                <div className="lang-row reverse">
                  <img src="./src/icons/css_old.svg" alt="CSS" className="lang-logo"/>
                  <Terminal code={cssCode}/>
                </div>
                <div className="frameworks-container">
                  <span className='frameworks-title'>Frameworks / Librarys</span>
                  <div className="frameworks-row">
                    <div className="icon-framework">
                      <a href="https://tailwindcss.com/" target='blank'>
                        <img src="./src/icons/tailwindcss.svg" className='frameworks-icons' height='40px' alt="Logo Tailwind"/>
                      </a>
                      <label>Tailwind</label>
                    </div>
                    <div className='icon-framework'>
                      <a href="https://getbootstrap.com/" target='blank'>
                        <img src="./src/icons/bootstrap.svg" className='frameworks-icons' height='40px' alt="Logo Bootstrap"/>
                      </a>
                      <label>Bootstrap</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="javascript-row">
                <div className="lang-row">
                  <img src="./src/icons/javascript.svg" alt="JS" className="lang-logo"/>
                  <Terminal code={jsCode}/>
                </div>
                <div className="frameworks-container">
                  <span className='frameworks-title'>Frameworks / Librarys</span>
                  <div className="frameworks-row">
                    <div className="icon-framework">
                      <a href="https://react.dev" target='blank'>
                        <img src="./src/icons/react_light.svg" className='frameworks-icons' height='40px' alt="Logo React"/>
                      </a>
                      <label>React</label>
                    </div>
                    <div className='icon-framework'>
                      <a href="https://threejs.org/" target='blank'>
                        <img src="./src/icons/threejs-light.svg" className='frameworks-icons' height='40px' alt="Logo Threejs"/>
                      </a>
                      <label>ThreeJS</label>
                    </div>
                    <div className='icon-framework'>
                      <a href="https://www.chartjs.org/" target='blank'>
                        <img src="./src/icons/chartjs.svg" className='frameworks-icons' height='40px' alt="Logo Chartjs"/>
                      </a>
                      <label>ChartJS</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeCategory === 'Frameworks' && (
            <div className="frameworks-content">
              <div className="frameworks-grid">
                {frameworks.map((framework) => (
                  <div
                    key={framework.name}
                    className={`icon-frameworks ${framework.large ? 'large' : ''}`}
                    onClick={() => setActiveFramework(framework)}
                  >
                    <img src={framework.logo} alt={`Logo ${framework.name}`}/>
                  </div>
                ))}
              </div>
              {activeFramework && (
                <div className="framework-overlay">
                  <img src={activeFramework.overlayLogo} alt={activeFramework.name}/>
                  <p>{activeFramework.description}</p>
                  <button onClick={() => setActiveFramework(null)}>✕</button>
                </div>
              )}
            </div>
          )}

          {activeCategory === 'Tools' && (
            <div className="tools-content">
              <div className="tools-grid">
                {tools.map((tool) => (
                  <div className="tool-item" key={tool.name}>
                    <div className="tool-icon">
                      <a href={tool.link} target='blank'>
                      <img src={tool.logo} alt={tool.name}/>
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
                <div className="domain-col">
                  <span className="index-domain">01</span>
                  <div className="domain-name">Web Dev</div>
                  <div className="col-card">
                    <div className="card-title">Web Development</div>
                    <div className="card-desc">I build fast, accessible and modern web experiences.</div>
                  </div>
                </div>
                <div className="domain-col">
                  <span className="index-domain">02</span>
                  <div className="domain-name">Graphic Design</div>
                  <div className="col-card">
                    <div className="card-title">Graphic Design</div>
                    <div className="card-desc">I create visual identities and editorial layouts.</div>
                  </div>
                </div>
                <div className="domain-col">
                  <span className="index-domain">03</span>
                  <div className="domain-name">UX / UI</div>
                  <div className="col-card">
                    <div className="card-title">UX / UI Design</div>
                    <div className="card-desc">I design intuitive and beautiful user interfaces.</div>
                  </div>
                </div>
                <div className="domain-col">
                  <span className="index-domain">04</span>
                  <div className="domain-name">Creative Dev</div>
                  <div className="col-card">
                    <div className="card-title">Creative Development</div>
                    <div className="card-desc">I create immersive 3D and interactive experiences.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
        <ExitButton setActiveOverlay={setActiveOverlay}/>
      </div>
    </>
  )
}

export default SkillsOverlay