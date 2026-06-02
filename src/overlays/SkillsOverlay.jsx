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
    description: 'Library de visualisation de donnéeset création de graphiques interactifs et configurables.',
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
  const [activeCategory, setActiveCategory] = useState('Languages')
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
            <li className={activeCategory === 'Domains' ? 'active' : ''} onClick={() => {setActiveCategory('Domains')}}>Domains</li>
            <li className={activeCategory === 'Languages' ? 'active' : ''} onClick={() => setActiveCategory('Languages')}>Languages</li>
            <li className={activeCategory === 'Frameworks' ? 'active' : ''} onClick={() => setActiveCategory('Frameworks')}>Frameworks</li>
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
              <div className="lang-row reverse">
                <img src="./src/icons/css_old.svg" alt="CSS" className="lang-logo"/>
                <Terminal code={cssCode}/>
              </div>
              <div className="lang-row">
                <img src="./src/icons/javascript.svg" alt="JS" className="lang-logo"/>
                <Terminal code={jsCode}/>
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

          {activeCategory === 'Tools' && <div className="tools-content">Tools</div>}

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