import { useRef } from 'react'
import '../App.css'
import ExitButton from '../ui/ExitButton'


function ProjectsOverlay({ activeOverlay, setActiveOverlay }) {

  if(activeOverlay !== 'projects') return null


  //inspi rauno.me
  return (
    <>
    
      <div className="projects-container" >
        <ExitButton setActiveOverlay={setActiveOverlay}/>
        <div className="project-slide" ></div>
        <div className="project-slide" style={{ background: '#00ff00' }}></div>
        <div className="project-slide" style={{ background: '#0000ff' }}></div>
        <div className="project-slide" style={{ background: '#ffff00' }}></div>
        <div className="project-slide" style={{ background: '#ff00ff' }}></div>
      </div>
      
    </>
  )
}

export default ProjectsOverlay