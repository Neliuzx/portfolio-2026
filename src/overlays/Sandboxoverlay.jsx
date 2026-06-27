import { useRef, useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'
import '../App.css'
import ExitButton from '../ui/ExitButton'

const GEOMETRIES = {
  box: { label: 'Box', args: [1, 1, 1] },
  sphere: { label: 'Sphere', args: [0.8, 32, 32] },
  cone: { label: 'Cone', args: [0.7, 1.4, 32] },
  torus: { label: 'Torus', args: [0.6, 0.25, 16, 64] },
  torusKnot: { label: 'TorusKnot', args: [0.6, 0.2, 100, 16] },
  icosahedron: { label: 'Icosahedron', args: [0.9, 0] },
}

const MATERIALS = {
  standard: 'MeshStandardMaterial',
  basic: 'MeshBasicMaterial',
  normal: 'MeshNormalMaterial',
  phong: 'MeshPhongMaterial',
}

const DEFAULTS = {
  geometry: 'box',
  material: 'standard',
  color: '#c9a574',
  wireframe: false,
  metalness: 0.3,
  roughness: 0.4,
  rotate: true,
  speed: 1,
  bg: '#EDEDED',
}

function buildGeometry (type) {
  const a = GEOMETRIES[type].args
  switch (type) {
    case 'box':
      return new THREE.BoxGeometry(...a)
    case 'sphere':
      return new THREE.SphereGeometry(...a)
    case 'cone':
      return new THREE.ConeGeometry(...a)
    case 'torus':
      return new THREE.TorusGeometry(...a)
    case 'torusKnot':
      return new THREE.TorusKnotGeometry(...a)
    case 'icosahedron':
      return new THREE.IcosahedronGeometry(...a)
    default:
      return new THREE.BoxGeometry(1, 1, 1)
  }
}

function buildMaterial (s) {
  const opts = { color: s.color, wireframe: s.wireframe }
  switch (s.material) {
    case 'basic':
      return new THREE.MeshBasicMaterial(opts)
    case 'normal':
      return new THREE.MeshNormalMaterial({ wireframe: s.wireframe })
    case 'phong':
      return new THREE.MeshPhongMaterial(opts)
    case 'standard':
    default:
      return new THREE.MeshStandardMaterial({
        ...opts,
        metalness: s.metalness,
        roughness: s.roughness,
      })
  }
}

function geoConstructor (type) {
  const a = GEOMETRIES[type].args.join(', ')
  const map = {
    box: 'BoxGeometry',
    sphere: 'SphereGeometry',
    cone: 'ConeGeometry',
    torus: 'TorusGeometry',
    torusKnot: 'TorusKnotGeometry',
    icosahedron: 'IcosahedronGeometry',
  }
  return { name: map[type], args: a }
}

function matLine (s, indent) {
  const mat = MATERIALS[s.material]
  if (s.material === 'normal') {
    return `${indent}const material = new THREE.${mat}({ wireframe: ${s.wireframe} })`
  }
  if (s.material === 'standard') {
    return `${indent}const material = new THREE.${mat}({\n${indent}  color: '${s.color}',\n${indent}  metalness: ${s.metalness},\n${indent}  roughness: ${s.roughness},\n${indent}  wireframe: ${s.wireframe},\n${indent}})`
  }
  return `${indent}const material = new THREE.${mat}({ color: '${s.color}', wireframe: ${s.wireframe} })`
}

function generateVanilla (s) {
  const g = geoConstructor(s.geometry)
  const needsLight = s.material === 'standard' || s.material === 'phong'
  const rot = s.rotate
    ? `\n  mesh.rotation.x += ${(0.01 * s.speed).toFixed(3)}\n  mesh.rotation.y += ${(0.01 * s.speed).toFixed(3)}`
    : ''
  return `import * as THREE from 'three'

const scene = new THREE.Scene()
scene.background = new THREE.Color('${s.bg}')

const geometry = new THREE.${g.name}(${g.args})

${matLine(s, '')}

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
${
  needsLight
    ? `
const ambient = new THREE.AmbientLight('#ffffff', 0.6)
const point = new THREE.PointLight('#ffffff', 1.2)
point.position.set(3, 3, 3)
scene.add(ambient, point)
`
    : ''
}
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100)
camera.position.z = 3

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)

function tick() {${rot}
  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}
tick()`
}

function generateR3F (s) {
  const g = geoConstructor(s.geometry)
  const geoJSX = {
    box: 'boxGeometry',
    sphere: 'sphereGeometry',
    cone: 'coneGeometry',
    torus: 'torusGeometry',
    torusKnot: 'torusKnotGeometry',
    icosahedron: 'icosahedronGeometry',
  }[s.geometry]
  const matJSX = {
    standard: 'meshStandardMaterial',
    basic: 'meshBasicMaterial',
    normal: 'meshNormalMaterial',
    phong: 'meshPhongMaterial',
  }[s.material]
  const needsLight = s.material === 'standard' || s.material === 'phong'

  let matProps
  if (s.material === 'normal') {
    matProps = ` wireframe={${s.wireframe}}`
  } else if (s.material === 'standard') {
    matProps = `\n          color="${s.color}"\n          metalness={${s.metalness}}\n          roughness={${s.roughness}}\n          wireframe={${s.wireframe}}\n        `
  } else {
    matProps = ` color="${s.color}" wireframe={${s.wireframe}}`
  }

  const rotateHook = s.rotate
    ? `
  useFrame((_, delta) => {
    ref.current.rotation.x += delta * ${s.speed}
    ref.current.rotation.y += delta * ${s.speed}
  })
`
    : ''

  return `import { Canvas${
    s.rotate ? ', useFrame' : ''
  } } from '@react-three/fiber'
import { useRef } from 'react'

function Shape() {
  const ref = useRef()
${rotateHook}  return (
    <mesh ref={ref}>
      <${geoJSX} args={[${g.args}]} />
      <${matJSX}${matProps}/>
    </mesh>
  )
}

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
      <color attach="background" args={['${s.bg}']} />
${
  needsLight
    ? `      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 3]} intensity={1.2} />
`
    : ''
}      <Shape />
    </Canvas>
  )
}`
}

function SandboxCanvas ({ settings }) {
  const mountRef = useRef(null)
  const stateRef = useRef({})

  useEffect(() => {
    const mount = mountRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    )
    camera.position.z = 3

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight('#ffffff', 0.6)
    const point = new THREE.PointLight('#ffffff', 1.2)
    point.position.set(3, 3, 3)
    scene.add(ambient, point)

    const mesh = new THREE.Mesh()
    scene.add(mesh)

    let pointerX = 0
    let pointerY = 0
    let dragging = false
    let lastX = 0
    let lastY = 0

    const onDown = (e) => {
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
    }
    const onUp = () => (dragging = false)
    const onMove = (e) => {
      if (!dragging) return
      pointerY += (e.clientX - lastX) * 0.01
      pointerX += (e.clientY - lastY) * 0.01
      lastX = e.clientX
      lastY = e.clientY
    }
    renderer.domElement.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointermove', onMove)

    const clock = new THREE.Clock()
    let raf
    const tick = () => {
      const delta = clock.getDelta()
      const s = stateRef.current
      if (s.rotate && !dragging) {
        mesh.rotation.x += delta * (s.speed || 1)
        mesh.rotation.y += delta * (s.speed || 1)
      } else {
        mesh.rotation.x = pointerX
        mesh.rotation.y = pointerY
      }
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    tick()

    const onResize = () => {
      if (!mount.clientWidth) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(mount)

    stateRef.current.mesh = mesh
    stateRef.current.scene = scene
    stateRef.current.ambient = ambient
    stateRef.current.point = point

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.domElement.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointermove', onMove)
      mesh.geometry?.dispose()
      mesh.material?.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode) mount.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => {
    const st = stateRef.current
    if (!st.mesh) return
    st.rotate = settings.rotate
    st.speed = settings.speed

    st.mesh.geometry?.dispose()
    st.mesh.material?.dispose()
    st.mesh.geometry = buildGeometry(settings.geometry)
    st.mesh.material = buildMaterial(settings)

    const lit = settings.material === 'standard' || settings.material === 'phong'
    st.ambient.visible = lit
    st.point.visible = lit

    st.scene.background = new THREE.Color(settings.bg)
  }, [settings])

  return <div ref={mountRef} className="sb-canvas" />
}

function Field ({ label, children }) {
  return (
    <div className="sb-field">
      <span className="sb-field-label">{label}</span>
      {children}
    </div>
  )
}

function Controls ({ settings, set }) {
  return (
    <div className="sb-controls">
      <Field label="GEOMETRY">
        <div className="sb-chips">
          {Object.entries(GEOMETRIES).map(([k, v]) => (
            <button
              key={k}
              className={`sb-chip ${settings.geometry === k ? 'active' : ''}`}
              onClick={() => set('geometry', k)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="MATERIAL">
        <div className="sb-chips">
          {Object.keys(MATERIALS).map((k) => (
            <button
              key={k}
              className={`sb-chip ${settings.material === k ? 'active' : ''}`}
              onClick={() => set('material', k)}
            >
              {k}
            </button>
          ))}
        </div>
      </Field>

      <div className="sb-field-row">
        <Field label="COLOR">
          <label className="sb-color">
            <input
              type="color"
              value={settings.color}
              disabled={settings.material === 'normal'}
              onChange={(e) => set('color', e.target.value)}
            />
            <span>{settings.material === 'normal' ? 'n/a' : settings.color}</span>
          </label>
        </Field>

        <Field label="BACKGROUND">
          <label className="sb-color">
            <input
              type="color"
              value={settings.bg}
              onChange={(e) => set('bg', e.target.value)}
            />
            <span>{settings.bg}</span>
          </label>
        </Field>
      </div>

      {settings.material === 'standard' && (
        <div className="sb-field-row">
          <Field label={`METALNESS ${settings.metalness.toFixed(2)}`}>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.metalness}
              onChange={(e) => set('metalness', parseFloat(e.target.value))}
            />
          </Field>
          <Field label={`ROUGHNESS ${settings.roughness.toFixed(2)}`}>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.roughness}
              onChange={(e) => set('roughness', parseFloat(e.target.value))}
            />
          </Field>
        </div>
      )}

      <Field label={`ROTATION SPEED ${settings.speed.toFixed(1)}`}>
        <input
          type="range"
          min="0"
          max="3"
          step="0.1"
          value={settings.speed}
          disabled={!settings.rotate}
          onChange={(e) => set('speed', parseFloat(e.target.value))}
        />
      </Field>

      <div className="sb-toggles">
        <button
          className={`sb-toggle ${settings.wireframe ? 'on' : ''}`}
          onClick={() => set('wireframe', !settings.wireframe)}
        >
          <span className="sb-toggle-dot" /> WIREFRAME
        </button>
        <button
          className={`sb-toggle ${settings.rotate ? 'on' : ''}`}
          onClick={() => set('rotate', !settings.rotate)}
        >
          <span className="sb-toggle-dot" /> AUTO-ROTATE
        </button>
        <button className="sb-toggle sb-reset" onClick={() => set('__reset')}>
          RESET
        </button>
      </div>
    </div>
  )
}

function CodePanel ({ settings }) {
  const [syntax, setSyntax] = useState('vanilla')
  const [copied, setCopied] = useState(false)

  const code = useMemo(
    () =>
      syntax === 'vanilla' ? generateVanilla(settings) : generateR3F(settings),
    [settings, syntax]
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="sb-code">
      <div className="sb-code-header">
        <div className="sb-dots">
          <span className="sb-dot red" />
          <span className="sb-dot yellow" />
          <span className="sb-dot green" />
        </div>
        <div className="sb-syntax-switch">
          <button
            className={syntax === 'vanilla' ? 'active' : ''}
            onClick={() => setSyntax('vanilla')}
          >
            three.js
          </button>
          <button
            className={syntax === 'r3f' ? 'active' : ''}
            onClick={() => setSyntax('r3f')}
          >
            react / r3f
          </button>
        </div>
        <button className="sb-copy" onClick={copy}>
          {copied ? 'copied ✓' : 'copy'}
        </button>
      </div>
      <pre className="sb-code-body">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function SandboxOverlay ({ activeOverlay, setActiveOverlay }) {
  const [settings, setSettings] = useState(DEFAULTS)

  const set = (key, value) => {
    if (key === '__reset') return setSettings(DEFAULTS)
    setSettings((s) => ({ ...s, [key]: value }))
  }

  useEffect(() => {
    if (activeOverlay !== 'sandbox') return
    const onKey = (e) => e.key === 'Escape' && setActiveOverlay(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeOverlay, setActiveOverlay])

  if (activeOverlay !== 'sandbox') {
    return null
  }

  return (
    <div className="sandbox-overlay">
      <ExitButton setActiveOverlay={setActiveOverlay} />

      <div className="sb-left">
        <div className="sb-stage">
          <SandboxCanvas settings={settings} />
          <span className="sb-hud">drag to orbit · esc to exit</span>
        </div>
        <CodePanel settings={settings} />
      </div>

      <div className="sb-right">
        <div className="sb-right-head">
          <h2 className="sb-title">SANDBOX</h2>
          <p className="sb-sub">
            Start with a cube. Change everything. Read the code as it writes
            itself.
          </p>
        </div>
        <Controls settings={settings} set={set} />
      </div>
    </div>
  )
}

export default SandboxOverlay