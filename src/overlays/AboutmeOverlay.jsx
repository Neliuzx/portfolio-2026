import { useState } from 'react'
import '../App.css'
import ExitButton from '../ui/ExitButton'
import SocialBar from '../ui/SocialBar'

function AboutmeOverlay ({ activeOverlay, setActiveOverlay }) {
    
    if(activeOverlay !== 'aboutme'){
        return null
    }
    
    return(

        <>
        
            <div className="contact-overlay">
            </div>
        </>
    )
}

export default AboutmeOverlay