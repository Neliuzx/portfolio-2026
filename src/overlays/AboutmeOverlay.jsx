import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import "../App.css";
import ExitButton from "../ui/ExitButton";
import SocialBar from "../ui/SocialBar";

const DIALOGUE = {
  intro:
    "> Hey! I'm Julien, aka Neliuzx. Creative front-end developer. Pick a command to learn more about me.",
  questions: [
    {
      icon: "◆",
      label: "Who are you?",
      answer:
        "> Digital Project Management student at Normandie Web School, web dev specialization. Before that I worked in roofing and zinc work: a hands-on past that gives me real discipline.",
    },
    {
      icon: "▣",
      label: "Your stack?",
      answer:
        "> React + Vite + Three.js + GSAP for the creative side. WordPress when a client needs it.",
    },
    {
      icon: "▶",
      label: "Your projects?",
      answer:
        "> portfolio-2026 (3D cube navigation), Clic & Copie (client site) and some other little projects available on Github.",
    },
    {
      icon: "✦",
      label: "What are you after?",
      answer:
        "> A front-end apprenticeship starting September 2026. Open to the entire world. My thing: immersive web experiences.",
    },
    {
      icon: "❤",
      label: "Your passions?",
      answer:
        "> Passionate about creative coding, horror movies, and learning new things. Often up late into the night.",
    },
    {
      icon: "✉",
      label: "Contact you?",
      answer:
        "> Use the Contact menu in the portfolio. I reply fast, especially about a creative project or an apprenticeship.",
    },
  ],
};

const TYPE_SPEED = 16;

function Blob() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 1;
    const height = mount.clientHeight || 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#1a1a1a") },
      uColorB: { value: new THREE.Color("#6b6b6b") },
    };

    const vertexShader = `
      uniform float uTime;
      varying float vNoise;
      varying vec3 vNormal;

      // simplex noise 3D (Ashima Arts, condensed)
      vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
      vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
      float snoise(vec3 v){
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
        i = mod(i, 289.0);
        vec4 p = permute(permute(permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 1.0/7.0;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0) * 2.0 + 1.0;
        vec4 s1 = floor(b1) * 2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      void main() {
        vNormal = normal;
        float n = snoise(normal * 1.6 + uTime * 0.35);
        vNoise = n;
        vec3 pos = position + normal * n * 0.28;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader =  `
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      varying float vNoise;
      varying vec3 vNormal;

      void main() {
        float light = dot(normalize(vNormal), normalize(vec3(0.5, 0.8, 1.0))) * 0.5 + 0.5;
        vec3 col = mix(uColorA, uColorB, smoothstep(-0.4, 0.6, vNoise) * light);
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const geometry = new THREE.IcosahedronGeometry(1, 48);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();
    let frameId;

    const animate = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      mesh.rotation.y += 0.003;
      mesh.rotation.x += 0.001;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="ab-blob" />;
}

export default function AboutOverlay({ activeOverlay, setActiveOverlay }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);

  const typeWriter = (str) => {
    clearInterval(timerRef.current);
    setDisplayed("");
    setDone(false);
    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      setDisplayed(str.slice(0, i));
      if (i >= str.length) {
        clearInterval(timerRef.current);
        setDone(true);
      }
    }, TYPE_SPEED);
  };

  useEffect(() => {
    if (activeOverlay !== "aboutme") return;
    typeWriter(DIALOGUE.intro);
    return () => clearInterval(timerRef.current);
  }, [activeOverlay]);

  if (activeOverlay !== "aboutme") {
    return null;
  }

  return (
    <div className="about-overlay">
      <ExitButton setActiveOverlay={setActiveOverlay} />

      <div className="ab-stage">
        <div className="ab-grid" />

        <div className="ab-dots">
          <span className="ab-dot red" />
          <span className="ab-dot yellow" />
          <span className="ab-dot green" />
        </div>

        <div className="ab-char">
          <Blob />
        </div>

        <div className="ab-dialogue-wrap">
          <div className="ab-name">JULIEN</div>
          <div className="ab-dialogue">
            <p className="ab-text">{displayed}</p>
            <div className="ab-hint" style={{ opacity: done ? undefined : 0 }}>
              ▶
            </div>
          </div>
        </div>
      </div>

      <div className="ab-choices">
        {DIALOGUE.questions.map((q) => (
          <button key={q.label} onClick={() => typeWriter(q.answer)}>
            <span className="ab-qi">{q.icon}</span>
            {q.label}
          </button>
        ))}
      </div>

      <SocialBar />
    </div>
  );
}