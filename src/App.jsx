import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Cube from './cube'
import Controls from './ui/Controls'
import Navbar from './ui/Navbar'
import LoadScreen from './ui/LoadScreen.jsx'
import ProjectsOverlay from './overlays/ProjectsOverlay'
import SkillsOverlay from './overlays/SkillsOverlay'
import GithubOverlay from './overlays/GithubOverlay'

function App() {

  const [isLoaded, setIsLoaded] = useState(false)
  const [activeOverlay, setActiveOverlay] = useState(null)

  return (
    <>
    <LoadScreen setIsLoaded={setIsLoaded}/>
    <GithubOverlay activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay}/>
    <ProjectsOverlay activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay}/>
    <SkillsOverlay activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay}/>
    <Navbar isLoaded={isLoaded}/>
    <Cube setActiveOverlay={setActiveOverlay}/>
    <Controls/>
    </>
  )
}

export default App
