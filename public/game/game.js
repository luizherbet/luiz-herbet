(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const MODES = {
    smooth: {
      eyebrow: "Músculo liso",
      title: "Monte a célula fusiforme",
      win:
        "Formato em fuso, núcleo central, corpos/placas densas, cavéolas + REL e via Ca²⁺–CaM–MLCK. Sem sarcômero nem tríade.",
      silhouette: "smooth",
      slots: [
        { id: "nucleus", label: "Núcleo", x: 50, y: 48, accept: "nucleus-central" },
        { id: "dense", label: "Âncoras", x: 32, y: 34, accept: "dense-bodies" },
        { id: "plaque", label: "Membrana", x: 78, y: 30, accept: "dense-plaques" },
        { id: "caveolae", label: "Superfície", x: 18, y: 58, accept: "caveolae" },
        { id: "rel", label: "Ca²⁺ interno", x: 68, y: 62, accept: "rel" },
        { id: "myosin", label: "Filamento", x: 48, y: 72, accept: "myosin-folded" },
      ],
      pieces: [
        { id: "nucleus-central", name: "Núcleo central", blurb: "Único, no meio do fuso", correct: true },
        { id: "dense-bodies", name: "Corpos densos", blurb: "Âncoras de actina no citoplasma", correct: true },
        { id: "dense-plaques", name: "Placas densas", blurb: "Âncoras no sarcolema", correct: true },
        { id: "caveolae", name: "Cavéolas", blurb: "Entrada de Ca²⁺ na membrana", correct: true },
        { id: "rel", name: "REL próximo", blurb: "Libera mais Ca²⁺ (IP₃)", correct: true },
        { id: "myosin-folded", name: "Miosina 10S", blurb: "Dobrada / depois lateral-polar", correct: true },
        { id: "triad", name: "Tríade T–RS", blurb: "Armadilha do esquelético", correct: false },
        { id: "troponin", name: "Troponina C", blurb: "Armadilha do esquelético", correct: false },
      ],
    },
    striated: {
      eyebrow: "Estriado esquelético",
      title: "Monte a fibra estriada",
      win:
        "Fibra cilíndrica com núcleos periféricos, sarcômero organizado, placa motora, tríade e controle fino por troponina.",
      silhouette: "striated",
      slots: [
        { id: "nuclei", label: "Núcleos", x: 18, y: 28, accept: "nuclei-peripheral" },
        { id: "sarcomere", label: "Unidade", x: 50, y: 48, accept: "sarcomere" },
        { id: "nmj", label: "Estímulo", x: 50, y: 16, accept: "motor-endplate" },
        { id: "triad", label: "Acoplamento", x: 72, y: 38, accept: "triad" },
        { id: "myosin", label: "Espesso", x: 50, y: 68, accept: "myosin-bipolar" },
        { id: "troponin", label: "Controle", x: 28, y: 68, accept: "troponin" },
      ],
      pieces: [
        { id: "nuclei-peripheral", name: "Núcleos periféricos", blurb: "Vários, sob o sarcolema", correct: true },
        { id: "sarcomere", name: "Sarcômero Z–I–A–H–M", blurb: "Unidade de contração", correct: true },
        { id: "motor-endplate", name: "Placa motora", blurb: "Junção neuromuscular", correct: true },
        { id: "triad", name: "Tríade (T + RS)", blurb: "Na junção A–I", correct: true },
        { id: "myosin-bipolar", name: "Miosina bipolar", blurb: "Zona desnuda no centro", correct: true },
        { id: "troponin", name: "Troponina C", blurb: "Sensor de Ca²⁺ no fino", correct: true },
        { id: "caveolae", name: "Cavéolas", blurb: "Armadilha do liso", correct: false },
        { id: "cam-mlck", name: "CaM → MLCK", blurb: "Armadilha do liso", correct: false },
      ],
    },
  };

  const state = {
    mode: null,
    selected: null,
    placed: {}, // slotId -> pieceId
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

  function neededCount() {
    return mod().slots.length;
  }

  function placedCount() {
    return Object.keys(state.placed).length;
  }

  function drawSilhouette() {
    const svg = $("cell-svg");
    const kind = mod().silhouette;
    if (kind === "smooth") {
      svg.innerHTML = `
        <defs>
          <linearGradient id="cellFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f3c4d4"/>
            <stop offset="100%" stop-color="#d9a0b4"/>
          </linearGradient>
        </defs>
        <ellipse cx="320" cy="180" rx="250" ry="110" fill="url(#cellFill)" stroke="#9a5f74" stroke-width="3"/>
        <ellipse cx="320" cy="180" rx="42" ry="28" fill="#6b3f7a" opacity="0.28"/>
        <text x="320" y="330" text-anchor="middle" fill="#5a6d78" font-size="14" font-family="Source Sans 3, sans-serif">Célula muscular lisa (fusiforme)</text>
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
              `<line x1="${x}" y1="100" x2="${x}" y2="240" stroke="${i % 2 ? "#8aa5b8" : "#a9c0cf"}" stroke-width="${i % 2 ? 10 : 4}" opacity="0.55"/>`
          )
          .join("")}
        <ellipse cx="100" cy="120" rx="10" ry="14" fill="#6b3f7a"/>
        <ellipse cx="100" cy="220" rx="10" ry="14" fill="#6b3f7a"/>
        <ellipse cx="540" cy="120" rx="10" ry="14" fill="#6b3f7a"/>
        <ellipse cx="540" cy="220" rx="10" ry="14" fill="#6b3f7a"/>
        <text x="320" y="330" text-anchor="middle" fill="#5a6d78" font-size="14" font-family="Source Sans 3, sans-serif">Fibra muscular esquelética</text>
      `;
    }
  }

  function pieceById(id) {
    return mod().pieces.find((p) => p.id === id);
  }

  function updateHud() {
    $("score-badge").textContent = `${placedCount()} / ${neededCount()}`;
    if (state.selected) {
      const p = pieceById(state.selected);
      $("hint-badge").textContent = p ? p.name : "Peça";
    } else {
      $("hint-badge").textContent = "Toque numa peça";
    }
  }

  function setTip(msg) {
    $("tip").textContent = msg;
  }

  function renderSlots() {
    const host = $("slots");
    host.innerHTML = "";
    mod().slots.forEach((slot) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "slot" + (state.placed[slot.id] ? " filled" : "");
      el.style.left = `${slot.x}%`;
      el.style.top = `${slot.y}%`;
      el.dataset.slotId = slot.id;
      if (state.placed[slot.id]) {
        const p = pieceById(state.placed[slot.id]);
        el.innerHTML = `<span class="slot-label">${slot.label}</span><span class="slot-piece">${p.name}</span>`;
      } else {
        el.innerHTML = `<span class="slot-label">${slot.label}</span><span class="slot-piece">Encaixe aqui</span>`;
      }
      el.addEventListener("click", () => onSlotTap(slot.id));
      host.appendChild(el);
    });
  }

  function renderTray() {
    const tray = $("tray");
    tray.innerHTML = "";
    const order = shuffle(mod().pieces);
    // keep stable order after first render using dataset on tray
    const saved = tray.dataset.order ? JSON.parse(tray.dataset.order) : null;
    const list = saved
      ? saved.map((id) => pieceById(id)).filter(Boolean)
      : order;
    if (!saved) tray.dataset.order = JSON.stringify(list.map((p) => p.id));

    list.forEach((piece) => {
      const used = Object.values(state.placed).includes(piece.id);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "piece" +
        (used ? " used" : "") +
        (state.selected === piece.id ? " selected" : "");
      btn.dataset.pieceId = piece.id;
      btn.innerHTML = `<strong>${piece.name}</strong><span>${piece.blurb}</span>`;
      btn.addEventListener("click", () => onPieceTap(piece.id));
      enableDrag(btn, piece.id);
      tray.appendChild(btn);
    });
  }

  function onPieceTap(pieceId) {
    if (Object.values(state.placed).includes(pieceId)) return;
    state.selected = state.selected === pieceId ? null : pieceId;
    document.querySelectorAll(".slot").forEach((s) => s.classList.toggle("target", !!state.selected && !s.classList.contains("filled")));
    renderTray();
    updateHud();
    const p = pieceById(pieceId);
    setTip(state.selected ? `Agora toque no encaixe certo para “${p.name}”.` : "Selecione uma peça abaixo e toque no encaixe certo.");
  }

  function onSlotTap(slotId) {
    if (!state.selected) {
      setTip("Primeiro escolha uma peça na bandeja.");
      return;
    }
    tryPlace(state.selected, slotId);
  }

  function tryPlace(pieceId, slotId) {
    const slot = mod().slots.find((s) => s.id === slotId);
    const piece = pieceById(pieceId);
    if (!slot || !piece) return;
    if (state.placed[slotId]) {
      setTip("Esse encaixe já está preenchido. Limpe ou use outro.");
      return;
    }

    const slotEl = document.querySelector(`[data-slot-id="${slotId}"]`);

    if (slot.accept === pieceId) {
      state.placed[slotId] = pieceId;
      state.selected = null;
      setTip(`Certo: ${piece.name} encaixa em “${slot.label}”.`);
      renderSlots();
      renderTray();
      updateHud();
      checkWin();
      return;
    }

    // wrong
    if (slotEl) {
      slotEl.classList.add("wrong");
      setTimeout(() => slotEl.classList.remove("wrong"), 380);
    }
    if (!piece.correct) {
      setTip(`“${piece.name}” não pertence a este tipo de célula.`);
    } else {
      setTip(`“${piece.name}” é deste tipo, mas não neste lugar. Tente outro encaixe.`);
    }
  }

  function checkWin() {
    if (placedCount() < neededCount()) return;
    $("win").classList.remove("hidden");
    $("win-body").textContent = mod().win;
    setTip("Célula completa. Compare mentalmente com o outro tipo.");
  }

  function resetBoard(keepMode) {
    state.selected = null;
    state.placed = {};
    $("tray").dataset.order = "";
    $("win").classList.add("hidden");
    if (keepMode && state.mode) {
      drawSilhouette();
      renderSlots();
      renderTray();
      updateHud();
      setTip("Selecione uma peça abaixo e toque no encaixe certo.");
    }
  }

  function startMode(mode) {
    state.mode = mode;
    state.selected = null;
    state.placed = {};
    $("tray").dataset.order = "";
    $("chooser").classList.add("hidden");
    $("board").classList.remove("hidden");
    $("win").classList.add("hidden");
    $("sim-eyebrow").textContent = mod().eyebrow;
    $("sim-title").textContent = mod().title;
    drawSilhouette();
    renderSlots();
    renderTray();
    updateHud();
    setTip("Selecione uma peça abaixo e toque no encaixe certo. Há peças-armadilha.");
  }

  function enableDrag(el, pieceId) {
    el.addEventListener("pointerdown", (e) => {
      if (Object.values(state.placed).includes(pieceId)) return;
      if (e.pointerType === "touch") return; // mobile usa tap-tap
      el.setPointerCapture(e.pointerId);
      state.drag = { pieceId, startX: e.clientX, startY: e.clientY, moved: false };
      state.selected = pieceId;
      renderTray();
      updateHud();
    });
    el.addEventListener("pointermove", (e) => {
      if (!state.drag || state.drag.pieceId !== pieceId) return;
      const dx = e.clientX - state.drag.startX;
      const dy = e.clientY - state.drag.startY;
      if (Math.hypot(dx, dy) > 6) state.drag.moved = true;
      if (state.drag.moved) {
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        el.style.zIndex = "20";
        el.style.opacity = "0.9";
      }
    });
    el.addEventListener("pointerup", (e) => {
      if (!state.drag || state.drag.pieceId !== pieceId) return;
      el.style.transform = "";
      el.style.zIndex = "";
      el.style.opacity = "";
      const moved = state.drag.moved;
      state.drag = null;
      if (!moved) return; // click handled separately
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const slotEl = target && target.closest ? target.closest(".slot") : null;
      if (slotEl && slotEl.dataset.slotId) {
        tryPlace(pieceId, slotEl.dataset.slotId);
      } else {
        setTip("Solte a peça sobre um encaixe da célula.");
        renderTray();
        updateHud();
      }
    });
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
