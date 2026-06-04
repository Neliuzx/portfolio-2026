import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import gsap from 'gsap'

const Scene = ({ setActiveOverlay }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const isDebug = window.location.hash === '#debug'
    const gui = new GUI({
      width: 300,
      title: 'Debug Panel',
      closeFolders: true
    })

    if (!isDebug){
      gui.hide()
    }

    window.addEventListener('keydown', (e) => {
      if((e.ctrlKey || e.metaKey) && e.shiftKey && e.key == 'K'){
        gui.show(gui._hidden)
      }
    })

    const debugObject = {}

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#fff')

    const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
    const textureLoader = new THREE.TextureLoader()

    const materials = [
      new THREE.MeshBasicMaterial({ map: textureLoader.load('/textures/Contact.png') }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load('/textures/About Me.png') }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load('/textures/Github.png') }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load('/textures/Projects.png') }), 
      new THREE.MeshBasicMaterial({ map: textureLoader.load('/textures/Skills.png') }),
      new THREE.MeshBasicMaterial({ map: textureLoader.load('/textures/Sandbox.png') }),
    ]

    const mesh = new THREE.Mesh(geometry, materials)
    scene.add(mesh)

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    canvas.addEventListener('click', (e) => {
      mouse.x = (e.clientX / sizes.width) * 2 - 1
      mouse.y = -(e.clientY / sizes.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)

      const intersects = raycaster.intersectObject(mesh)

      if(intersects.length > 0) {
        const faceIndex = Math.floor(intersects[0].faceIndex / (geometry.parameters.widthSegments * 2))
        // faceIndex 0-1   devant droite (avec texture projet)
        // faceIndex 2-3   derrière gauche
        // faceIndex 4-5   dessus
        // faceIndex 6-7   dessous
        // faceIndex 8-9   devant gauche
        // faceIndex 10-11 derrière droite
        console.log(faceIndex)
        if(faceIndex === 6 || faceIndex === 7) {
          setActiveOverlay('projects')
        }else if(faceIndex === 8 || faceIndex === 9){
          setActiveOverlay('skills')
        }else if(faceIndex === 5 || faceIndex === 4){
          setActiveOverlay('github')
        }       

      }
    })

    const cubeTweaks = gui.addFolder('Cube')

    cubeTweaks
      .add(mesh.position, 'y')
      .min(-3).max(3).step(0.01)
      .name('Verticale (axe Y)')

    cubeTweaks
      .add(mesh.position, 'x')
      .min(-3).max(3).step(0.01)
      .name('Horizontale (axe X)')

    cubeTweaks
      .add(mesh.position, 'z')
      .min(-3).max(3).step(0.01)
      .name('Profondeur (axe Z)')

    cubeTweaks.add(mesh, 'visible')

    cubeTweaks.add({ wireframe: false }, 'wireframe').onChange((val) => {
      materials.forEach(m => m.wireframe = val)
    })

    window.addEventListener('keydown', (e) => {
      if(e.key == 'r') {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })
      }
    })

    window.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowUp':
          mesh.position.y += 0.1
          break
        case 'ArrowDown':
          mesh.position.y -= 0.1
          break
        case 'ArrowLeft':
          mesh.position.x -= 0.1
          break
        case 'ArrowRight':
          mesh.position.x += 0.1
          break
      }
    })
    

    debugObject.spin = () => {
      gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })
    }
    cubeTweaks.add(debugObject, 'spin')

    debugObject.subdivision = 2
    cubeTweaks
      .add(debugObject, 'subdivision') 
      .min(1).max(20).step(1)
      .onFinishChange(() => {
        mesh.geometry.dispose()
        mesh.geometry = new THREE.BoxGeometry(
          1, 1, 1,
          debugObject.subdivision, debugObject.subdivision, debugObject.subdivision
        )
      })

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    window.addEventListener('resize', () => {
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.x = 1.3
    camera.position.y = 1.3
    camera.position.z = 1.3
    scene.add(camera)

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    const renderer = new THREE.WebGLRenderer({ canvas })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const tick = () => {
      mesh.rotation.y += 0.003
      mesh.rotation.x += 0.001
      controls.update()
      renderer.render(scene, camera)
      window.requestAnimationFrame(tick)
    }

    tick()

    return () => {
      gui.destroy()
      renderer.dispose()
    }

  }, [])

  return <canvas ref={canvasRef} className="webgl" tabIndex={-1}/>
}

export default Scene