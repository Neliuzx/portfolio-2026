import { useState } from 'react'
import '../App.css'
import ExitButton from '../ui/ExitButton'
import SocialBar from '../ui/SocialBar'

function ContactOverlay ({ activeOverlay, setActiveOverlay }) {
    
    if(activeOverlay !== 'contact'){
        return null
    }
    
    return(

        <>
        
            <div className="contact-overlay">
                <div className="contact-left">
                <ExitButton setActiveOverlay={setActiveOverlay}/>
                <SocialBar/>
                <h1>LET'S<br/>COLLABORATE<br/>TOGETHER</h1>               
                </div>
                <div className="contact-right">
                <form className="contact-form">
                    <div className="contact-field">
                        <label className="contact-label">*YOUR NAME</label>
                        <input type="text" placeholder="Full name" className="contact-input"/>
                    </div>
                    <div className="contact-field">
                        <label className="contact-label">*YOUR EMAIL</label>
                        <input type="email" placeholder="Email Address" className="contact-input"/>
                    </div>
                    <div className="contact-field">
                        <label className="contact-label">*PROJECT DETAILS</label>
                        <textarea placeholder="What is your Project goals, requirement and specific timeline..." className="contact-input contact-textarea"/>
                    </div>
                    <div className="contact-field">
                        <label className="contact-label">*PROJECT BUDGET</label>
                        <input type="text" placeholder="What is your Budget (EUR)" className="contact-input"/>
                    </div>
                    <button type="submit" className="contact-submit">SUBMIT INQUIRY</button>
                </form>
            </div>
            </div>
        </>
    )
}

export default ContactOverlay