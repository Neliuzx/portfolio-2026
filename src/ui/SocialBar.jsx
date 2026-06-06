import '../App.css'

function SocialBar ({ activeOverlay, setActiveOverlay }) {

    if(activeOverlay == 'skills'){
        return null
    }


    return (

        <>
        <div className="social-links" >
            <a href="https://www.linkedin.com/in/julien-bt" target='blank'  className="social">LinkedIn</a>
            <a href="https://instagram.com/julienn.bt" target='blank'  className="social">Instagram</a>
            <a href="https://github.com/neliuzx" target='blank'  className="social">Github</a>
        </div>
        </>
    )
}

export default SocialBar