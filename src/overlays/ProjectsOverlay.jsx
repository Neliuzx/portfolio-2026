import { useRef, useEffect, useCallback, useMemo } from "react";
import gsap from "gsap";

export default function ProjectsOverlay({ activeOverlay, setActiveOverlay }) {
  const isOpen = activeOverlay === "projects";

  const stageRef = useRef(null);
  const worldRef = useRef(null);
  const detailRef = useRef(null);
  const detailImgRef = useRef(null);
  const detailTitleRef = useRef(null);

  const state = useRef({
    x: 0, y: 0,
    px: 0, py: 0,
    sx: 0, sy: 0,
    vx: 0, vy: 0,
    dragging: false,
    raf: 0,
    openItem: null,
    openRect: null,
  });

  const dims = useMemo(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    const isMobile = w <= 768;
    const isSmall = w <= 480;

    const CARD_W = isSmall ? 130 : isMobile ? 150 : 300;
    const CARD_H = isSmall ? 165 : isMobile ? 190 : 380;
    const GAP_X = isMobile ? 30 : 80;
    const GAP_Y = isMobile ? 30 : 80;
    const DETAIL_W = Math.min(w * 0.82, 600);
    const DETAIL_H = DETAIL_W * 1.2;

    return { CARD_W, CARD_H, GAP_X, GAP_Y, DETAIL_W, DETAIL_H };
  }, [isOpen]);

  const CELL_W = dims.CARD_W + dims.GAP_X;
  const CELL_H = dims.CARD_H + dims.GAP_Y;

  const COLS = 4;
  const ROWS = 3;
  const PER_TILE = COLS * ROWS;
  const TILE_W = CELL_W * COLS;
  const TILE_H = CELL_H * ROWS;

  const cells = [];
  for (let i = 0; i < PER_TILE; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    cells.push({
      idx: i,
      project: projects[i % projects.length],
      left: col * CELL_W,
      top: row * CELL_H,
    });
  }

  const apply = useCallback(() => {
    const s = state.current;
    if (worldRef.current) {
      worldRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
    }
  }, []);

  const tick = useCallback(() => {
    const s = state.current;
    if (!s.dragging) {
      s.x += s.vx;
      s.y += s.vy;
      s.vx *= 0.92;
      s.vy *= 0.92;
      if (Math.abs(s.vx) < 0.05) s.vx = 0;
      if (Math.abs(s.vy) < 0.05) s.vy = 0;
    }
    if (s.x <= -TILE_W) s.x += TILE_W;
    if (s.x > 0) s.x -= TILE_W;
    if (s.y <= -TILE_H) s.y += TILE_H;
    if (s.y > 0) s.y -= TILE_H;
    apply();
    s.raf = requestAnimationFrame(tick);
  }, [apply, TILE_W, TILE_H]);

  useEffect(() => {
    if (!isOpen) return;
    const s = state.current;
    s.x = -TILE_W;
    s.y = -TILE_H;
    s.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(s.raf);
  }, [isOpen, tick, TILE_W, TILE_H]);

  const onPointerDown = (e) => {
    const s = state.current;
    s.dragging = true;
    s.px = s.sx = e.clientX;
    s.py = s.sy = e.clientY;
    s.vx = 0;
    s.vy = 0;
    stageRef.current.setPointerCapture?.(e.pointerId);
    stageRef.current.classList.add("grabbing");
  };

  const onPointerMove = (e) => {
    const s = state.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.px;
    const dy = e.clientY - s.py;
    s.x += dx;
    s.y += dy;
    s.vx = dx;
    s.vy = dy;
    s.px = e.clientX;
    s.py = e.clientY;
  };

  const onPointerUp = (e) => {
    const s = state.current;
    if (!s.dragging) return;
    s.dragging = false;
    stageRef.current?.releasePointerCapture?.(e.pointerId);
    stageRef.current?.classList.remove("grabbing");

    const dist = Math.abs(e.clientX - s.sx) + Math.abs(e.clientY - s.sy);
    if (dist < 10) {
      const stack = document.elementsFromPoint(e.clientX, e.clientY);
      const card = stack.find((el) => el.classList.contains("ip-card"));
      if (card) {
        const id = card.dataset.id;
        const project = projects.find((p) => p.id === id);
        if (project) openProject(project, card);
      }
    }
  };

  const openProject = (project, el) => {
    const s = state.current;
    if (s.openItem) return;

    const detail = detailRef.current;
    const img = detailImgRef.current;
    const title = detailTitleRef.current;

    const rect = el.getBoundingClientRect();
    const stageRect = stageRef.current.getBoundingClientRect();

    img.src = project.src;
    title.textContent = project.title;

    const startRect = {
      left: rect.left - stageRect.left,
      top: rect.top - stageRect.top,
      width: rect.width,
      height: rect.height,
    };
    s.openRect = startRect;

    const dw = dims.DETAIL_W;
    const dh = dims.DETAIL_H;

    gsap.set(detail, { display: "block", pointerEvents: "auto" });
    gsap.fromTo(img, startRect, {
      left: stageRect.width / 2 - dw / 2,
      top: stageRect.height / 2 - dh / 2,
      width: dw,
      height: dh,
      duration: 0.85,
      ease: "expo.inOut",
    });
    gsap.fromTo(detail, { "--bg": 0 }, { "--bg": 1, duration: 0.6, ease: "power2.out" });
    gsap.fromTo(title, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.45, ease: "power3.out" });

    s.openItem = project;
  };

  const closeProject = () => {
    const s = state.current;
    if (!s.openItem) return;
    const detail = detailRef.current;
    const img = detailImgRef.current;
    const title = detailTitleRef.current;

    gsap.killTweensOf([img, title, detail]);
    gsap.to(title, { opacity: 0, y: 20, duration: 0.3, ease: "power2.in" });
    gsap.to(detail, { "--bg": 0, duration: 0.7, ease: "power2.inOut" });

    const back = s.openRect || { left: 0, top: 0, width: dims.CARD_W, height: dims.CARD_H };
    gsap.to(img, {
      left: back.left,
      top: back.top,
      width: back.width,
      height: back.height,
      duration: 0.7,
      ease: "expo.inOut",
      onComplete: () => gsap.set(detail, { display: "none", pointerEvents: "none" }),
    });

    s.openItem = null;
    s.openRect = null;
  };

  const closeOverlay = () => {
    closeProject();
    setActiveOverlay(null);
  };

  const tiles = [];
  for (let ty = 0; ty < 3; ty++) {
    for (let tx = 0; tx < 3; tx++) tiles.push({ tx, ty });
  }

  if (!isOpen) return null;

  return (
    <div className="projects-overlay">
      <button className="exit-button" onClick={closeOverlay} aria-label="Fermer">✕</button>

      <div
        className="ip-stage"
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="ip-world" ref={worldRef}>
          {tiles.map(({ tx, ty }) => (
            <div
              className="ip-tile"
              key={`${tx}-${ty}`}
              style={{ transform: `translate3d(${tx * TILE_W}px, ${ty * TILE_H}px, 0)` }}
            >
              {cells.map((c) => (
                <div
                  className="ip-card"
                  data-id={c.project.id}
                  key={`${tx}-${ty}-${c.idx}`}
                  style={{ left: c.left, top: c.top, width: dims.CARD_W, height: dims.CARD_H }}
                >
                  <img src={c.project.src} alt={c.project.title} draggable={false} />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="ip-detail" ref={detailRef} onClick={closeProject}>
          <img className="ip-detail-img" ref={detailImgRef} alt="" draggable={false} />
          <h2 className="ip-detail-title" ref={detailTitleRef} />
          <button className="ip-detail-close" aria-label="Fermer le projet" onClick={closeProject}>✕</button>
        </div>
      </div>
    </div>
  );
}

const projects = [
  { id: "neliuzx", title: "neliuzx.com", src: "https://picsum.photos/seed/a/600/720" },
  { id: "bytefill", title: "ByteFill", src: "https://picsum.photos/seed/b/600/720" },
  { id: "clic", title: "Clic & Copie", src: "https://picsum.photos/seed/c/600/720" },
  { id: "synth", title: "SYNTHCHECK", src: "https://picsum.photos/seed/d/600/720" },
  { id: "osint", title: "OSINT Casino", src: "https://picsum.photos/seed/e/600/720" },
];