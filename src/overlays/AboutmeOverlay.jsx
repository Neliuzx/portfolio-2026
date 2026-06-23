import { useState, useEffect, useRef } from "react";
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

        <div className="ab-hud-left">
          <span className="ab-dim">~/about</span> <span>LVL.21</span>
        </div>

        <div className="ab-dots">
          <span className="ab-dot red" />
          <span className="ab-dot yellow" />
          <span className="ab-dot green" />
        </div>

        <div className="ab-char">
          <div className="ab-shadow" />
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