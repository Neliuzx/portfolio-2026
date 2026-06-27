import { useEffect } from 'react'
import gsap from 'gsap'
import '../App.css'

function LoadScreen({ setIsLoaded }) {



    useEffect(() => {
        setTimeout(() => {
          gsap.to('.loader-bar', {
            y: '-100vh',
            stagger: 0.1,
            duration: 0.8,
            ease: 'power4.inOut',
            onComplete: () => {
                document.querySelector('.loader').style.display = 'none'
                setIsLoaded(true)
            }
          })
        }, 1000)
      }, [])

    return (
        <div className="loader">
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
        </div>
    )
}

export default LoadScreen