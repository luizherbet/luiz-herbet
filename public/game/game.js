(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const ICONS = {
    "nucleus-central": `
      <svg class="ico" viewBox="0 0 64 64" aria-hidden="true">
        <ellipse cx="32" cy="32" rx="18" ry="14" fill="#6b3f7a"/>
        <ellipse cx="28" cy="30" rx="4" ry="3" fill="#9b6aad"/>
      </svg>`,
    "dense-bodies": `
      <svg class="ico" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="22" cy="24" r="5" fill="#8a5a2b"/>
        <circle cx="40" cy="22" r="5" fill="#8a5a2b"/>
        <circle cx="30" cy="38" r="5" fill="#8a5a2b"/>
        <circle cx="46" cy="40" r="4" fill="#8a5a2b"/>
        <circle cx="18" cy="42" r="4" fill="#8a5a2b"/>
      </svg>`,
    "dense-plaques": `
      <svg class="ico" viewBox="0 0 64 64" aria-hidden="true">
        <ellipse cx="32" cy="32" rx="24" ry="18" fill="none" stroke="#9a5f74" stroke-width="3"/>
        <circle cx="12" cy="28" r="4" fill="#8a5a2b"/>
        <circle cx="20" cy="16" r="4" fill="#8a5a2b"/>
        <circle cx="44" cy="16" r="4" fill="#8a5a2b"/>
        <circle cx="52" cy="30" r="4" fill="#8a5a2b"/>
        <circle cx="46" cy="46" r="4" fill="#8a5a2b"/>
        <circle cx="18" cy="46" r="4" fill="#8a5a2b"/>
      </svg>`,
    caveolae: `
      <svg class="ico" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M8 20 Q20 20 20 32 Q20 44 8 44" fill="none" stroke="#1a6a7a" stroke-width="3"/>
        <path d="M8 24 Q16 24 16 32 Q16 40 8 40" fill="#7ec8d4" opacity="0.7"/>
        <path d="M28 18 Q40 18 40 32 Q40 46 28 46" fill="none" stroke="#1a6a7a" stroke-width="3"/>
        <path d="M28 22 Q36 22 36 32 Q36 42 28 42" fill="#7ec8d4" opacity="0.7"/>
        <path d="M48 20 Q58 20 58 32 Q58 44 48 44" fill="none" stroke="#1a6a7a" stroke-width="3"/>
      </svg>`,
    rel: `
      <svg class="ico" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M12 20 C24 12, 28 28, 40 20 C48 14, 52 28, 52 36 C52 46, 40 50, 32 44 C24 38, 20 50, 12 42 Z"
          fill="none" stroke="#2f7d9a" stroke-width="3"/>
        <circle cx="22" cy="28" r="3" fill="#5eb0d0"/>
        <circle cx="38" cy="34" r="3" fill="#5eb0d0"/>
        <circle cx="30" cy="42" r="3" fill="#5eb0d0"/>
      </svg>`,
    "myosin-folded": `
      <svg class="ico" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M18 40 C18 22, 34 22, 34 34 C34 46, 18 46, 18 34" fill="none" stroke="#2b6cb0" stroke-width="4"/>
        <path d="M30 40 C30 22, 46 22, 46 34 C46 46, 30 46, 30 34" fill="none" stroke="#2b6cb0" stroke-width="4"/>
        <circle cx="18" cy="34" r="4" fill="#1e4e8c"/>
        <circle cx="46" cy="34" r="4" fill="#1e4e8c"/>
      </svg>`,
    triad: `
      <svg class="ico" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="12" y="14" width="12" height="36" rx="4" fill="#c45c3a"/>
        <rect x="26" y="10" width="12" height="44" rx="3" fill="#3d7ea6"/>
        <rect x="40" y="14" width="12" height="36" rx="4" fill="#c45c3a"/>
      </svg>`,
    troponin: `
      <svg class="ico" viewBox="0 0 64 64" aria-hidden="true">
        <line x1="10" y1="32" x2="54" y2="32" stroke="#c0392b" stroke-width="4" stroke-linecap="round"/>
        <circle cx="20" cy="32" r="5" fill="#e2b84a"/>
        <circle cx="32" cy="32" r="5" fill="#e2b84a"/>
        <circle cx="44" cy="32" r="5" fill="#e2b84a"/>
      </svg>`,
    "nuclei-peripheral": `
      <svg class="ico" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="8" y="18" width="48" height="28" rx="14" fill="#c5d8e6" stroke="#6d8ea3" stroke-width="2"/>
        <ellipse cx="16" cy="24" rx="5" ry="7" fill="#6b3f7a"/>
        <ellipse cx="16" cy="40" rx="5" ry="7" fill="#6b3f7a"/>
        <ellipse cx="48" cy="24" rx="5" ry="7" fill="#6b3f7a"/>
        <ellipse cx="48" cy="40" rx="5" ry="7" fill="#6b3f7a"/>
      </svg>`,
    sarcomere: `
      <svg class="ico" viewBox="0 0 64 64" aria-hidden="true">
        <line x1="10" y1="16" x2="10" y2="48" stroke="#333" stroke-width="3"/>
        <line x1="54" y1="16" x2="54" y2="48" stroke="#333" stroke-width="3"/>
        <rect x="22" y="20" width="20" height="24" fill="#8aa5b8"/>
        <rect x="12" y="28" width="10" height="8" fill="#d9e6ef"/>
        <rect x="42" y="28" width="10" height="8" fill="#d9e6ef"/>
        <line x1="32" y1="22" x2="32" y2="42" stroke="#1c2a33" stroke-width="2"/>
      </svg>`,
    "motor-endplate": `
      <svg class="ico" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M12 18 C20 10, 28 22, 36 14 C42 10, 48 20, 52 16" fill="none" stroke="#6b3f7a" stroke-width="3"/>
        <ellipse cx="32" cy="40" rx="20" ry="10" fill="#9b6aad"/>
        <circle cx="24" cy="40" r="2.5" fill="#f4e8ff"/>
        <circle cx="32" cy="38" r="2.5" fill="#f4e8ff"/>
        <circle cx="40" cy="40" r="2.5" fill="#f4e8ff"/>
      </svg>`,
    "myosin-bipolar": `
      <svg class="ico" viewBox="0 0 64 64" aria-hidden="true">
        <line x1="12" y1="32" x2="52" y2="32" stroke="#2b6cb0" stroke-width="5" stroke-linecap="round"/>
        <circle cx="14" cy="24" r="4" fill="#1e4e8c"/>
        <circle cx="14" cy="40" r="4" fill="#1e4e8c"/>
        <circle cx="50" cy="24" r="4" fill="#1e4e8c"/>
        <circle cx="50" cy="40" r="4" fill="#1e4e8c"/>
        <rect x="28" y="28" width="8" height="8" fill="#d9e4ec"/>
      </svg>`,
    "cam-mlck": `
      <svg class="ico" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="22" cy="32" r="12" fill="#2f9e6b"/>
        <circle cx="22" cy="32" r="5" fill="#d8ffe8"/>
        <path d="M34 32 H44" stroke="#0d6e6e" stroke-width="3"/>
        <rect x="44" y="22" width="14" height="20" rx="4" fill="#0d6e6e"/>
      </svg>`,
  };

  const MODES = {
    smooth: {
      eyebrow: "Músculo liso",
      title: "Monte a célula fusiforme",
      win: "Fuso com núcleo central, corpos/placas densas, cavéolas + REL e miosina 10S. Sem tríade nem troponina.",
      silhouette: "smooth",
      slots: [
        { id: "nucleus", x: 50, y: 48, accept: "nucleus-central" },
        { id: "dense", x: 34, y: 32, accept: "dense-bodies" },
        { id: "plaque", x: 78, y: 28, accept: "dense-plaques" },
        { id: "caveolae", x: 16, y: 56, accept: "caveolae" },
        { id: "rel", x: 70, y: 64, accept: "rel" },
        { id: "myosin", x: 48, y: 74, accept: "myosin-folded" },
      ],
      pieces: [
        { id: "nucleus-central", name: "Núcleo central", correct: true },
        { id: "dense-bodies", name: "Corpos densos", correct: true },
        { id: "dense-plaques", name: "Placas densas", correct: true },
        { id: "caveolae", name: "Cavéolas", correct: true },
        { id: "rel", name: "REL", correct: true },
        { id: "myosin-folded", name: "Miosina 10S", correct: true },
        { id: "triad", name: "Tríade T–RS", correct: false },
        { id: "troponin", name: "Troponina C", correct: false },
        { id: "sarcomere", name: "Sarcômero", correct: false },
        { id: "motor-endplate", name: "Placa motora", correct: false },
      ],
    },
    striated: {
      eyebrow: "Estriado esquelético",
      title: "Monte a fibra estriada",
      win: "Fibra com núcleos periféricos, sarcômero, placa motora, tríade, miosina bipolar e troponina.",
      silhouette: "striated",
      slots: [
        { id: "nuclei", x: 16, y: 30, accept: "nuclei-peripheral" },
        { id: "sarcomere", x: 50, y: 50, accept: "sarcomere" },
        { id: "nmj", x: 50, y: 16, accept: "motor-endplate" },
        { id: "triad", x: 74, y: 36, accept: "triad" },
        { id: "myosin", x: 50, y: 74, accept: "myosin-bipolar" },
        { id: "troponin", x: 26, y: 70, accept: "troponin" },
      ],
      pieces: [
        { id: "nuclei-peripheral", name: "Núcleos periféricos", correct: true },
        { id: "sarcomere", name: "Sarcômero", correct: true },
        { id: "motor-endplate", name: "Placa motora", correct: true },
        { id: "triad", name: "Tríade T–RS", correct: true },
        { id: "myosin-bipolar", name: "Miosina bipolar", correct: true },
        { id: "troponin", name: "Troponina C", correct: true },
        { id: "caveolae", name: "Cavéolas", correct: false },
        { id: "cam-mlck", name: "CaM → MLCK", correct: false },
        { id: "dense-bodies", name: "Corpos densos", correct: false },
        { id: "myosin-folded", name: "Miosina 10S", correct: false },
      ],
    },
  };

  const state = {
    mode: null,
    placed: {},
    order: [],
    drag: null,
  };

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function mod() {
    return MODES[state.mode];
  }

  function pieceById(id) {
    return mod().pieces.find((p) => p.id === id);
  }

  function iconHtml(id) {
    return ICONS[id] || `<div class="ico"></div>`;
  }

  function neededCount() {
    return mod().slots.length;
  }

  function placedCount() {
    return Object.keys(state.placed).length;
  }

  function setTip(msg) {
    $("tip").textContent = msg;
  }

  function updateHud() {
    $("score-badge").textContent = `${placedCount()} / ${neededCount()}`;
  }

  function drawSilhouette() {
    const svg = $("cell-svg");
    if (mod().silhouette === "smooth") {
      svg.innerHTML = `
        <defs>
          <linearGradient id="cellFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f3c4d4"/>
            <stop offset="100%" stop-color="#d9a0b4"/>
          </linearGradient>
        </defs>
        <ellipse cx="320" cy="180" rx="250" ry="110" fill="url(#cellFill)" stroke="#9a5f74" stroke-width="3"/>
      `;
    } else {
      svg.innerHTML = `
        <defs>
          <linearGradient id="fiberFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#d8e7f2"/>
            <stop offset="100%" stop-color="#b7cfe0"/>
          </linearGradient>
        </defs>
        <rect x="70" y="90" width="500" height="160" rx="70" fill="url(#fiberFill)" stroke="#6d8ea3" stroke-width="3"/>
        ${[120, 180, 240, 300, 360, 420, 480]
          .map(
            (x, i) =>
              `<line x1="${x}" y1="100" x2="${x}" y2="240" stroke="${i % 2 ? "#8aa5b8" : "#a9c0cf"}" stroke-width="${i % 2 ? 10 : 4}" opacity="0.5"/>`
          )
          .join("")}
      `;
    }
  }

  function renderSlots() {
    const host = $("slots");
    host.innerHTML = "";
    mod().slots.forEach((slot) => {
      const el = document.createElement("div");
      el.className = "slot" + (state.placed[slot.id] ? " filled" : "");
      el.style.left = `${slot.x}%`;
      el.style.top = `${slot.y}%`;
      el.dataset.slotId = slot.id;

      if (state.placed[slot.id]) {
        const p = pieceById(state.placed[slot.id]);
        el.innerHTML = `${iconHtml(p.id).replace('class="ico"', 'class="slot-icon"')}<span class="slot-name">${p.name}</span>`;
      } else {
        el.innerHTML = `<span class="empty-mark"></span>`;
      }
      host.appendChild(el);
    });
  }

  function renderTray() {
    const tray = $("tray");
    tray.innerHTML = "";
    state.order.forEach((id) => {
      const piece = pieceById(id);
      if (!piece) return;
      const used = Object.values(state.placed).includes(piece.id);
      const el = document.createElement("div");
      el.className = "piece" + (used ? " used" : "");
      el.dataset.pieceId = piece.id;
      el.setAttribute("role", "listitem");
      el.setAttribute("aria-label", "elemento");
      el.innerHTML = iconHtml(piece.id);
      if (!used) bindDrag(el, piece.id);
      tray.appendChild(el);
    });
  }

  function clearHot() {
    document.querySelectorAll(".slot.hot").forEach((s) => s.classList.remove("hot"));
  }

  function slotFromPoint(x, y) {
    const ghost = $("ghost");
    const prev = ghost.style.pointerEvents;
    ghost.style.pointerEvents = "none";
    const stack = document.elementsFromPoint(x, y);
    ghost.style.pointerEvents = prev || "none";
    for (const node of stack) {
      if (node.classList && node.classList.contains("slot") && !node.classList.contains("filled")) {
        return node;
      }
    }
    return null;
  }

  function tryPlace(pieceId, slotId) {
    const slot = mod().slots.find((s) => s.id === slotId);
    const piece = pieceById(pieceId);
    if (!slot || !piece || state.placed[slotId]) return false;

    const slotEl = document.querySelector(`[data-slot-id="${slotId}"]`);

    if (slot.accept === pieceId) {
      state.placed[slotId] = pieceId;
      setTip(`${piece.name}`);
      renderSlots();
      renderTray();
      updateHud();
      checkWin();
      return true;
    }

    if (slotEl) {
      slotEl.classList.add("wrong");
      setTimeout(() => slotEl.classList.remove("wrong"), 360);
    }
    setTip(piece.correct ? "Elemento deste tipo, mas no lugar errado." : "Esse elemento não pertence a esta célula.");
    return false;
  }

  function checkWin() {
    if (placedCount() < neededCount()) return;
    $("win").classList.remove("hidden");
    $("win-body").textContent = mod().win;
    setTip("Célula completa.");
  }

  function bindDrag(el, pieceId) {
    el.addEventListener("pointerdown", (e) => {
      if (e.button != null && e.button !== 0) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);

      const ghost = $("ghost");
      ghost.innerHTML = iconHtml(pieceId);
      ghost.classList.remove("hidden");
      ghost.style.left = `${e.clientX}px`;
      ghost.style.top = `${e.clientY}px`;
      el.classList.add("dragging");

      state.drag = {
        pieceId,
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        moved: false,
      };
    });

    el.addEventListener("pointermove", (e) => {
      if (!state.drag || state.drag.pieceId !== pieceId) return;
      if (state.drag.pointerId !== e.pointerId) return;

      const dx = e.clientX - state.drag.startX;
      const dy = e.clientY - state.drag.startY;
      if (Math.hypot(dx, dy) > 4) state.drag.moved = true;

      const ghost = $("ghost");
      ghost.style.left = `${e.clientX}px`;
      ghost.style.top = `${e.clientY}px`;

      clearHot();
      const over = slotFromPoint(e.clientX, e.clientY);
      if (over) over.classList.add("hot");
    });

    const end = (e) => {
      if (!state.drag || state.drag.pieceId !== pieceId) return;
      if (state.drag.pointerId !== e.pointerId) return;

      const { moved } = state.drag;
      const x = e.clientX;
      const y = e.clientY;
      state.drag = null;

      clearHot();
      $("ghost").classList.add("hidden");
      el.classList.remove("dragging");

      if (!moved) {
        setTip("Arraste o elemento até um encaixe da célula.");
        return;
      }

      const over = slotFromPoint(x, y);
      if (over && over.dataset.slotId) {
        tryPlace(pieceId, over.dataset.slotId);
      } else {
        setTip("Solte sobre um encaixe vazio.");
      }
    };

    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  }

  function resetBoard(keepMode) {
    state.placed = {};
    state.drag = null;
    $("ghost").classList.add("hidden");
    $("win").classList.add("hidden");
    clearHot();
    if (keepMode && state.mode) {
      state.order = shuffle(mod().pieces.map((p) => p.id));
      drawSilhouette();
      renderSlots();
      renderTray();
      updateHud();
      setTip("Arraste cada elemento até o encaixe certo.");
    }
  }

  function startMode(mode) {
    state.mode = mode;
    state.placed = {};
    state.drag = null;
    state.order = shuffle(mod().pieces.map((p) => p.id));
    $("chooser").classList.add("hidden");
    $("board").classList.remove("hidden");
    $("win").classList.add("hidden");
    $("ghost").classList.add("hidden");
    $("sim-eyebrow").textContent = mod().eyebrow;
    $("sim-title").textContent = mod().title;
    drawSilhouette();
    renderSlots();
    renderTray();
    updateHud();
    setTip("Arraste cada elemento até o encaixe certo. O nome só aparece quando estiver certo.");
  }

  $("pick-smooth").onclick = () => startMode("smooth");
  $("pick-striated").onclick = () => startMode("striated");
  $("btn-home").onclick = () => {
    state.mode = null;
    resetBoard(false);
    $("board").classList.add("hidden");
    $("chooser").classList.remove("hidden");
  };
  $("btn-reset").onclick = () => resetBoard(true);
  $("btn-again").onclick = () => resetBoard(true);
})();
