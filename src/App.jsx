import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Cube from './cube'
import Controls from './ui/controls'
import Navbar from './ui/navbar'
import LoadScreen from './ui/loadscreen'

function App() {

  const [isLoaded, setIsLoaded] = useState(false)
  return (
    <>
    <LoadScreen setIsLoaded={setIsLoaded}/>
    <Navbar isLoaded={isLoaded}/>
     <Cube />
     <Controls/>
    </>
  )
}

export default App
