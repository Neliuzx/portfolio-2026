import { useState, useRef, useEffect } from 'react'
import '../App.css'
import ExitButton from '../ui/ExitButton'
import logoNeliuzx from '../assets/Logo Neliuzx.svg'
import logoCC from '../assets/cropped-Logo-Clic-et-Copie-copie.png'

const projects = [
  { id: 'neliuzx', title: 'My Portfolio', year: '2026', stack: 'React · Three.js · GSAP', src: logoNeliuzx, link: 'https://github.com/Neliuzx/portfolio-2026/', logo: true},
  { id: 'projet2', title: 'Spotify Dashboard', year: '2026', stack: 'JS', src: 'https://cdn.simpleicons.org/spotify', link: 'https://github.com/Neliuzx/spotify-dashboard', logo: true},
  { id: 'clic', title: 'Clic & Copie', year: '2026', stack: 'WordPress · Elementor', src: logoCC, link: 'https://clicetcopie.fr', logo: true },
  { id: 'projet4', title: 'Valorant Dashboard', year: '2026', stack: 'JS', src: 'https://cdn.simpleicons.org/valorant', link: 'https://github.com/Neliuzx/Valorant-Dashboard', logo: true },
  { id: 'projet5', title: 'Todo list', year: '2026', stack: 'JS', src: 'https://api.iconify.design/lucide/list-todo.svg?color=%23EDEDED&width=200', link: 'https://github.com/Neliuzx/todolist-js', logo: true },
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
                <img
                  className={`deck-card-img ${project.logo ? 'is-logo' : ''}`}
                  src={project.src}
                  alt={project.title}
                  draggable={false}
                />
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
          <button onClick={() => window.open(projects[active].link, '_blank', 'noopener,noreferrer')}>OPEN →</button>
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