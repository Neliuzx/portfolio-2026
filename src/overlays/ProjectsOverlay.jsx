import { useState, useRef, useEffect } from 'react'
import '../App.css'
import ExitButton from '../ui/ExitButton'

const projects = [
  { id: 'neliuzx', title: 'My Portfolio', year: '2026', stack: 'React · Three.js · GSAP', src: 'https://picsum.photos/seed/a/900/1100' },
  { id: 'projet2', title: 'projet2', year: '2025', stack: 'React · Node · MySQL', src: 'https://picsum.photos/seed/b/900/1100' },
  { id: 'clic', title: 'Clic & Copie', year: '2025', stack: 'WordPress · Elementor', src: 'https://picsum.photos/seed/c/900/1100' },
  { id: 'projet4', title: 'projet4', year: '2025', stack: 'Web Audio · Claude API', src: 'https://picsum.photos/seed/d/900/1100' },
  { id: 'projet5', title: 'projet5', year: '2024', stack: 'OSINT · Investigation', src: 'https://picsum.photos/seed/e/900/1100' },
]

function ProjectsOverlay ({ activeOverlay, setActiveOverlay }) {
  const isOpen = activeOverlay === 'projects'

  const [active, setActive] = useState(0)
  const [opened, setOpened] = useState(null)

  const listRef = useRef(null)
  const cardsRef = useRef([])
  const animated = useRef(active)
  const targetRef = useRef(active)
  const raf = useRef(0)
  const wheelLock = useRef(false)

  useEffect(() => {
    targetRef.current = active
  }, [active])

  useEffect(() => {
    if (!isOpen) return

    const tick = () => {
      animated.current += (targetRef.current - animated.current) * 0.12
      if (Math.abs(targetRef.current - animated.current) < 0.001) {
        animated.current = targetRef.current
      }
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        const offset = i - animated.current
        const abs = Math.abs(offset)
        card.style.transform =
          `translateY(${offset * 32}px) translateZ(${-abs * 80}px) rotateX(${offset * -3}deg) scale(${1 - abs * 0.05})`
        card.style.opacity = `${Math.max(0, 1 - abs * 0.22)}`
        card.style.zIndex = `${30 - Math.round(abs)}`
        card.style.filter = abs < 0.5 ? 'grayscale(0)' : 'grayscale(1)'
      })
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (opened) {
        if (e.key === 'Escape') setOpened(null)
        return
      }
      if (e.key === 'Escape') setActiveOverlay(null)
      if (e.key === 'ArrowDown') setActive((a) => Math.min(projects.length - 1, a + 1))
      if (e.key === 'ArrowUp') setActive((a) => Math.max(0, a - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, opened, setActiveOverlay])

  const onWheel = (e) => {
    if (opened || wheelLock.current) return
    wheelLock.current = true
    setTimeout(() => (wheelLock.current = false), 220)
    if (e.deltaY > 0) setActive((a) => Math.min(projects.length - 1, a + 1))
    else if (e.deltaY < 0) setActive((a) => Math.max(0, a - 1))
  }

  if (!isOpen) return null

  return (
    <div className="projects-overlay">
      <ExitButton setActiveOverlay={setActiveOverlay} />

      <div className="project-deck">
        <div className="project-counter">
          {String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </div>

        <div className="project-stage">
          <div className="project-dots">
            {projects.map((project, index) => (
              <button
                key={project.id}
                className={`project-dot ${active === index ? 'active' : ''}`}
                onClick={() => setActive(index)}
                aria-label={project.title}
              />
            ))}
          </div>

          <div className="project-list" ref={listRef} onWheel={onWheel}>
            {projects.map((project, index) => (
              <button
                key={project.id}
                ref={(el) => (cardsRef.current[index] = el)}
                className={`deck-card ${active === index ? 'active' : ''}`}
                onMouseEnter={() => setActive(index)}
                onClick={() => setOpened(project)}
              >
                <img src={project.src} alt={project.title} draggable={false} />
                <span>{project.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="project-info">
          <p>SELECTED PROJECT</p>
          <h1 key={projects[active].id}>{projects[active].title}</h1>
          <div className="project-info-meta">
            <span>{projects[active].stack}</span>
            <span>{projects[active].year}</span>
          </div>
          <button onClick={() => setOpened(projects[active])}>OPEN CASE →</button>
        </div>
      </div>

      {opened && (
        <div className="project-full" onClick={() => setOpened(null)}>
          <button className="project-full-close" onClick={() => setOpened(null)} aria-label="Close">
            ✕
          </button>
          <div className="project-full-content" onClick={(e) => e.stopPropagation()}>
            <img src={opened.src} alt={opened.title} draggable={false} />
            <h2>{opened.title}</h2>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectsOverlay