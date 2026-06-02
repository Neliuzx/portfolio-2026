import '../App.css'


function ExitButton({ setActiveOverlay, activeOverlay }) {



    return (
        <>

            <button className="exit-button" onClick={() => setActiveOverlay(null)}>✕</button>

        </>
    )
}

export default ExitButton