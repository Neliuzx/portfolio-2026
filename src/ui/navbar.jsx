import { useState, useEffect } from 'react'
import '../App.css'
import logo from '../assets/Logo Neliuzx.svg'

function Navbar({ isLoaded, activeOverlay, setActiveOverlay }) {

  return (
    <nav className={`navbar ${isLoaded ? 'visible' : ''}`}>
      <div className='navbar-left'>
        <a href="#" onClick={() => setActiveOverlay('projects')}>Projects</a>
        <a href="#">About</a>
      </div>
      <a href="#">
        <img className='logo' src={logo} alt="Logo Neliuzx" />
      </a>
      <div className='navbar-right'>
        <a href="#" onClick={() => setActiveOverlay('github')}>GitHub</a>
        <a href="#">Contact</a>
      </div>
    </nav>
  )
}

export default Navbar