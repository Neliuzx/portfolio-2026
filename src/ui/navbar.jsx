import { useState, useEffect } from 'react'
import '../App.css'
import logo from '../assets/Logo Neliuzx.svg'

function Navbar({ isLoaded }) {

    useEffect(() => {
        window.addEventListener('keydown', (e) => {            
          if(e.key == 'n') setIsVisible(prev => !prev)
        })
      }, [])

  return (
    <nav className={`navbar ${isLoaded ? 'visible' : ''}`} style={{ visibility: isLoaded ? 'visible' : 'hidden' }}>
      <div className='navbar-left'>
        <a href="#">Projects</a>
        <a href="#">About</a>
      </div>
      <a href="#">
        <img className='logo' src={logo} alt="Logo Neliuzx" />
      </a>
      <div className='navbar-right'>
        <a href="https://github.com/neliuzx" target='blank'>GitHub</a>
        <a href="#">Contact</a>
      </div>
    </nav>
  )
}

export default Navbar