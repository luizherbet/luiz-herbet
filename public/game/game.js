(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const canvas = $("cell");
  const ctx = canvas.getContext("2d");

  const ICONS = {
    dense: `<svg class="ico" viewBox="0 0 64 64"><circle cx="22" cy="24" r="5" fill="#8a5a2b"/><circle cx="40" cy="22" r="5" fill="#8a5a2b"/><circle cx="30" cy="38" r="5" fill="#8a5a2b"/><circle cx="46" cy="40" r="4" fill="#8a5a2b"/><circle cx="18" cy="42" r="4" fill="#8a5a2b"/></svg>`,
    actin: `<svg class="ico" viewBox="0 0 64 64"><path d="M12 44 C20 20, 28 20, 32 32 C36 44, 44 20, 52 20" fill="none" stroke="#c0392b" stroke-width="4"/><path d="M14 48 C22 28, 30 28, 34 38 C38 48, 46 28, 54 28" fill="none" stroke="#c0392b" stroke-width="3" opacity="0.55"/></svg>`,
    myosin: `<svg class="ico" viewBox="0 0 64 64"><path d="M18 40 C18 22, 34 22, 34 34 C34 46, 18 46, 18 34" fill="none" stroke="#2b6cb0" stroke-width="4"/><path d="M30 40 C30 22, 46 22, 46 34 C46 46, 30 46, 30 34" fill="none" stroke="#2b6cb0" stroke-width="4"/><circle cx="18" cy="34" r="4" fill="#1e4e8c"/><circle cx="46" cy="34" r="4" fill="#1e4e8c"/></svg>`,
  };

  const DENSE = [
    { x: -0.48, y: -0.28 },
    { x: -0.2, y: 0.36 },
    { x: 0.08, y: -0.4 },
    { x: 0.3, y: 0.3 },
    { x: 0.48, y: -0.2 },
    { x: -0.3, y: 0.02 },
  ];

  const state = {
    step: 0,
    W: 960,
    H: 560,
    anim: 0,
    done: {},
    quizDone: false,
    drag: null,
    placed: {},
  };

  const STEPS = [
    {
      id: "forma",
      phase: "Forma",
      title: "Formato da célula",
      heading: "Qual a forma desta célula?",
      body: "A célula já aparece com núcleo e organelas. Digite o formato característico do músculo liso.",
      mode: "text",
      accept: ["fusiforme"],
      ok: "Correto: célula fusiforme.",
    },
    {
      id: "corpos",
      phase: "Âncoras",
      title: "Corpos densos",
      heading: "Coloque os corpos densos",
      body: "Arraste os corpos densos para o encaixe. Depois responda sobre a actina e os filamentos intermediários.",
      mode: "drag-quiz",
      piece: { id: "dense", name: "Corpos densos", icon: "dense" },
      slot: { id: "dense", x: 34, y: 36 },
      quiz: [
        {
          q: "Os corpos densos contêm qual proteína relacionada à actina?",
          options: ["Troponina C", "α-actinina", "Tropomiosina"],
          answer: 1,
        },
        {
          q: "Quais filamentos intermediários ligam essa rede?",
          options: ["Queratina e lamínina", "Desmina e vimentina", "Tubulina e dineína"],
          answer: 1,
        },
      ],
      ok: "Corpos densos no lugar. α-actinina; desmina e vimentina.",
    },
    {
      id: "caveolas",
      phase: "Membrana",
      title: "Cavéolas",
      heading: "O que a seta indica?",
      body: "Olhe a seta na superfície da célula e digite o nome dessas invaginações.",
      mode: "text",
      accept: ["caveolos", "caveolas", "caveolae", "caveola"],
      showArrow: true,
      ok: "Correto: cavéolas (caveolos).",
    },
    {
      id: "actina",
      phase: "Filamentos",
      title: "Filamentos de actina",
      heading: "Ligue os corpos densos com actina",
      body: "Arraste os filamentos de actina até o encaixe. O nome aparece só quando estiver certo.",
      mode: "drag",
      piece: { id: "actin", name: "Filamentos de actina", icon: "actin" },
      slot: { id: "actin", x: 52, y: 58 },
      ok: "Actina ligando os corpos densos.",
    },
    {
      id: "miosina",
      phase: "Filamentos",
      title: "Miosina curva",
      heading: "Coloque a miosina 10S",
      body: "Arraste os filamentos de miosina curvos (forma dobrada) até o encaixe.",
      mode: "drag",
      piece: { id: "myosin", name: "Miosina 10S (curva)", icon: "myosin" },
      slot: { id: "myosin", x: 66, y: 44 },
      ok: "Miosina curva (10S) posicionada.",
    },
  ];

  function step() {
    return STEPS[state.step];
  }

  function normalize(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "")
      .trim();
  }

  function resize() {
    const vp = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.W = Math.max(280, Math.floor(vp.width));
    state.H = Math.max(200, Math.floor(vp.height));
    canvas.width = Math.floor(state.W * dpr);
    canvas.height = Math.floor(state.H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function geom() {
    return {
      cx: state.W * 0.5,
      cy: state.H * 0.48,
      rx: state.W * 0.38,
      ry: state.H * 0.28,
    };
  }

  function densePoint(i, g) {
    const d = DENSE[i];
    return {
      x: g.cx + d.x * g.rx * 0.82,
      y: g.cy + d.y * g.ry * 0.75,
    };
  }

  function drawCell() {
    const g = geom();
    const s = step();
    ctx.clearRect(0, 0, state.W, state.H);

    // background wash
    ctx.fillStyle = "#e8f0f4";
    ctx.fillRect(0, 0, state.W, state.H);

    // neighboring faded cells
    ctx.save();
    ctx.globalAlpha = 0.22;
    drawFusiform(g.cx - g.rx * 0.55, g.cy - g.ry * 1.35, g.rx * 0.55, g.ry * 0.55);
    drawFusiform(g.cx + g.rx * 0.6, g.cy + g.ry * 1.25, g.rx * 0.5, g.ry * 0.5);
    ctx.restore();

    // main cell
    drawFusiform(g.cx, g.cy, g.rx, g.ry);

    // organelles already present
    drawOrganelles(g);

    // nucleus always
    drawNucleus(g);

    if (state.done.corpos || state.step > 1) drawDenseBodies(g);
    if (state.done.actina || state.step > 3) drawActin(g);
    if (state.done.miosina || state.step > 4) drawMyosin(g);
    if (s.showArrow || state.done.caveolas) drawCaveolae(g, !!s.showArrow && !state.done.caveolas);

    // caption
    ctx.fillStyle = "#5a6d78";
    ctx.font = `600 ${Math.max(12, state.W * 0.018)}px "Source Sans 3", sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Célula muscular lisa", g.cx, state.H - 16);
  }

  function drawFusiform(cx, cy, rx, ry) {
    const grd = ctx.createLinearGradient(cx - rx, cy - ry, cx + rx, cy + ry);
    grd.addColorStop(0, "#f3c4d4");
    grd.addColorStop(1, "#d9a0b4");
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.strokeStyle = "#9a5f74";
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  function drawNucleus(g) {
    ctx.beginPath();
    ctx.ellipse(g.cx, g.cy, g.rx * 0.16, g.ry * 0.28, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#6b3f7a";
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(g.cx - g.rx * 0.04, g.cy - g.ry * 0.05, g.rx * 0.04, g.ry * 0.06, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#9b6aad";
    ctx.fill();
  }

  function drawOrganelles(g) {
    // mito-like
    const bits = [
      [-0.55, -0.15, 0.07, 0.045],
      [0.42, 0.18, 0.08, 0.04],
      [-0.15, 0.42, 0.06, 0.035],
      [0.2, -0.35, 0.07, 0.04],
    ];
    bits.forEach(([x, y, rx, ry]) => {
      ctx.beginPath();
      ctx.ellipse(g.cx + x * g.rx, g.cy + y * g.ry, rx * g.rx, ry * g.ry, x, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(120, 70, 90, 0.35)";
      ctx.fill();
    });

    // REL wisps near membrane
    ctx.strokeStyle = "rgba(47, 125, 154, 0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(g.cx + g.rx * 0.72, g.cy - g.ry * 0.1);
    ctx.bezierCurveTo(
      g.cx + g.rx * 0.6,
      g.cy - g.ry * 0.35,
      g.cx + g.rx * 0.55,
      g.cy + g.ry * 0.05,
      g.cx + g.rx * 0.68,
      g.cy + g.ry * 0.22
    );
    ctx.stroke();
  }

  function drawDenseBodies(g) {
    DENSE.forEach((_, i) => {
      const p = densePoint(i, g);
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(4, g.rx * 0.028), 0, Math.PI * 2);
      ctx.fillStyle = "#8a5a2b";
      ctx.fill();
    });
    // plaques on membrane
    for (let i = 0; i < 8; i++) {
      const a = -Math.PI + (i / 7) * Math.PI * 1.7;
      const x = g.cx + Math.cos(a) * g.rx * 0.98;
      const y = g.cy + Math.sin(a) * g.ry * 0.98;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(3.5, g.rx * 0.022), 0, Math.PI * 2);
      ctx.fillStyle = "#6e4520";
      ctx.fill();
    }
  }

  function drawActin(g) {
    ctx.strokeStyle = "rgba(192, 57, 43, 0.85)";
    ctx.lineWidth = 2.2;
    const pairs = [
      [0, 1],
      [1, 3],
      [0, 2],
      [2, 4],
      [3, 4],
      [5, 1],
      [5, 3],
    ];
    pairs.forEach(([a, b]) => {
      const p = densePoint(a, g);
      const q = densePoint(b, g);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.quadraticCurveTo((p.x + q.x) / 2 + 8, (p.y + q.y) / 2 - 10, q.x, q.y);
      ctx.stroke();
    });
  }

  function drawMyosin(g) {
    const loops = [
      [-0.12, 0.08],
      [0.12, -0.12],
      [0.02, 0.22],
    ];
    loops.forEach(([x, y], i) => {
      const cx = g.cx + x * g.rx;
      const cy = g.cy + y * g.ry;
      const r = g.rx * 0.07;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0.2, Math.PI * 1.6);
      ctx.strokeStyle = "#2b6cb0";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + r * 0.9, cy, r * 0.85, Math.PI * 0.4, Math.PI * 1.8);
      ctx.stroke();
    });
  }

  function drawCaveolae(g, withArrow) {
    const spots = [
      { a: Math.PI * 0.85, n: 3 },
      { a: Math.PI * 1.15, n: 3 },
    ];
    spots.forEach(({ a, n }) => {
      for (let i = 0; i < n; i++) {
        const ang = a + i * 0.12;
        const x = g.cx + Math.cos(ang) * g.rx * 0.98;
        const y = g.cy + Math.sin(ang) * g.ry * 0.98;
        const nx = Math.cos(ang);
        const ny = Math.sin(ang);
        ctx.beginPath();
        ctx.arc(x - nx * 6, y - ny * 6, 5, 0, Math.PI * 2);
        ctx.strokeStyle = "#1a6a7a";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "rgba(126, 200, 212, 0.55)";
        ctx.fill();
      }
    });

    if (withArrow) {
      const a = Math.PI * 0.95;
      const tipX = g.cx + Math.cos(a) * g.rx * 0.92;
      const tipY = g.cy + Math.sin(a) * g.ry * 0.92;
      const fromX = tipX - 70;
      const fromY = tipY + 36;
      ctx.strokeStyle = "#c45c3a";
      ctx.fillStyle = "#c45c3a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.lineTo(tipX - 12, tipY + 8);
      ctx.lineTo(tipX - 4, tipY + 14);
      ctx.closePath();
      ctx.fill();
    }
  }

  function setFeedback(el, msg, kind) {
    el.textContent = msg;
    el.className = "feedback" + (kind ? ` ${kind}` : "");
  }

  function showBlock(which) {
    $("text-block").classList.toggle("hidden", which !== "text");
    $("quiz-block").classList.toggle("hidden", which !== "quiz" && which !== "drag-quiz");
    $("drag-block").classList.toggle("hidden", which !== "drag" && which !== "drag-quiz");
  }

  function renderSlots() {
    const host = $("slots");
    host.innerHTML = "";
    const s = step();
    if (!s.slot) return;
    if (!(s.mode === "drag" || s.mode === "drag-quiz")) return;
    if (state.placed[s.slot.id]) {
      const el = document.createElement("div");
      el.className = "slot filled";
      el.style.left = `${s.slot.x}%`;
      el.style.top = `${s.slot.y}%`;
      el.innerHTML = `${ICONS[s.piece.icon].replace('class="ico"', 'class="slot-icon"')}<span class="slot-name">${s.piece.name}</span>`;
      host.appendChild(el);
      return;
    }
    const el = document.createElement("div");
    el.className = "slot";
    el.style.left = `${s.slot.x}%`;
    el.style.top = `${s.slot.y}%`;
    el.dataset.slotId = s.slot.id;
    host.appendChild(el);
  }

  function renderTray() {
    const tray = $("tray");
    tray.innerHTML = "";
    const s = step();
    if (!s.piece) return;
    const used = !!state.placed[s.slot.id];
    const el = document.createElement("div");
    el.className = "piece" + (used ? " used" : "");
    el.dataset.pieceId = s.piece.id;
    el.innerHTML = ICONS[s.piece.icon];
    if (!used) bindDrag(el, s.piece.id);
    tray.appendChild(el);
  }

  function renderQuiz() {
    const list = $("quiz-list");
    list.innerHTML = "";
    const s = step();
    if (!s.quiz) return;
    s.quiz.forEach((item, qi) => {
      const box = document.createElement("div");
      box.className = "quiz-q";
      box.innerHTML = `<p>${item.q}</p>`;
      const opts = document.createElement("div");
      opts.className = "quiz-options";
      item.options.forEach((label, oi) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "quiz-opt";
        btn.textContent = label;
        btn.onclick = () => answerQuiz(qi, oi, btn, opts);
        opts.appendChild(btn);
      });
      box.appendChild(opts);
      list.appendChild(box);
    });
    state.quizAnswers = {};
    state.quizDone = false;
  }

  function answerQuiz(qi, oi, btn, opts) {
    const s = step();
    const item = s.quiz[qi];
    if (state.quizAnswers[qi] === true) return;
    const ok = oi === item.answer;
    if (ok) {
      state.quizAnswers[qi] = true;
      [...opts.children].forEach((b, i) => {
        b.disabled = true;
        if (i === item.answer) b.classList.add("correct");
      });
    } else {
      btn.classList.add("wrong");
      setTimeout(() => btn.classList.remove("wrong"), 400);
      setFeedback($("quiz-feedback"), "Não é essa. Tente de novo.", "bad");
      return;
    }
    const allOk = s.quiz.every((_, i) => state.quizAnswers[i] === true);
    if (allOk) {
      state.quizDone = true;
      setFeedback($("quiz-feedback"), "Respostas corretas.", "ok");
      maybeUnlockNext();
    }
  }

  function maybeUnlockNext() {
    const s = step();
    let ready = false;
    if (s.mode === "text") ready = !!state.done[s.id];
    if (s.mode === "drag") ready = !!state.placed[s.slot.id];
    if (s.mode === "drag-quiz") ready = !!state.placed[s.slot.id] && state.quizDone;
    $("btn-next").disabled = !ready;
    if (ready && s.mode !== "text") {
      state.done[s.id] = true;
      const fb =
        s.mode === "drag" ? $("drag-feedback") : $("quiz-feedback");
      if (s.mode === "drag") setFeedback(fb, s.ok, "ok");
    }
  }

  function loadStep() {
    const s = step();
    state.placed = {};
    state.quizAnswers = {};
    state.quizDone = false;
    state.drag = null;
    $("ghost").classList.add("hidden");
    $("btn-next").disabled = true;
    $("btn-next").textContent = state.step === STEPS.length - 1 ? "Concluir" : "Próxima";

    $("step-title").textContent = s.title;
    $("step-badge").textContent = `${state.step + 1} / ${STEPS.length}`;
    $("phase-tag").textContent = s.phase;
    $("step-count").textContent = `Etapa ${state.step + 1}`;
    $("prompt-title").textContent = s.heading;
    $("prompt-body").textContent = s.body;
    $("progress-fill").style.width = `${((state.step + 1) / STEPS.length) * 100}%`;

    $("text-input").value = "";
    setFeedback($("text-feedback"), "", "");
    setFeedback($("quiz-feedback"), "", "");
    setFeedback($("drag-feedback"), "", "");

    if (s.mode === "text") {
      showBlock("text");
      $("slots").innerHTML = "";
      setTimeout(() => $("text-input").focus(), 50);
    } else if (s.mode === "drag") {
      showBlock("drag");
      renderSlots();
      renderTray();
    } else if (s.mode === "drag-quiz") {
      showBlock("drag-quiz");
      $("quiz-block").classList.remove("hidden");
      $("drag-block").classList.remove("hidden");
      renderSlots();
      renderTray();
      renderQuiz();
    }
    drawCell();
  }

  function checkText() {
    const s = step();
    const val = normalize($("text-input").value);
    const ok = s.accept.some((a) => normalize(a) === val);
    if (ok) {
      state.done[s.id] = true;
      setFeedback($("text-feedback"), s.ok, "ok");
      $("btn-next").disabled = false;
      drawCell();
    } else {
      setFeedback($("text-feedback"), "Ainda não. Tente de novo.", "bad");
      $("btn-next").disabled = true;
    }
  }

  function clearHot() {
    document.querySelectorAll(".slot.hot").forEach((el) => el.classList.remove("hot"));
  }

  function slotFromPoint(x, y) {
    const ghost = $("ghost");
    ghost.style.pointerEvents = "none";
    const stack = document.elementsFromPoint(x, y);
    for (const node of stack) {
      if (node.classList && node.classList.contains("slot") && !node.classList.contains("filled")) {
        return node;
      }
    }
    return null;
  }

  function tryPlace(pieceId) {
    const s = step();
    if (!s.slot || pieceId !== s.piece.id) return false;
    if (state.placed[s.slot.id]) return false;

    state.placed[s.slot.id] = pieceId;
    state.done[s.id] = s.mode === "drag";
    setFeedback($("drag-feedback"), s.piece.name, "ok");
    renderSlots();
    renderTray();
    drawCell();
    maybeUnlockNext();
    return true;
  }

  function bindDrag(el, pieceId) {
    el.addEventListener("pointerdown", (e) => {
      if (e.button != null && e.button !== 0) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      const s = step();
      const ghost = $("ghost");
      ghost.innerHTML = ICONS[s.piece.icon];
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
      if (Math.hypot(e.clientX - state.drag.startX, e.clientY - state.drag.startY) > 4) {
        state.drag.moved = true;
      }
      $("ghost").style.left = `${e.clientX}px`;
      $("ghost").style.top = `${e.clientY}px`;
      clearHot();
      const over = slotFromPoint(e.clientX, e.clientY);
      if (over) over.classList.add("hot");
    });

    const end = (e) => {
      if (!state.drag || state.drag.pieceId !== pieceId) return;
      if (state.drag.pointerId !== e.pointerId) return;
      const moved = state.drag.moved;
      const x = e.clientX;
      const y = e.clientY;
      state.drag = null;
      clearHot();
      $("ghost").classList.add("hidden");
      el.classList.remove("dragging");
      if (!moved) {
        setFeedback($("drag-feedback"), "Arraste até o encaixe.", "bad");
        return;
      }
      const over = slotFromPoint(x, y);
      if (over && over.dataset.slotId) {
        tryPlace(pieceId);
      } else {
        const slotEl = document.querySelector(".slot:not(.filled)");
        if (slotEl) {
          slotEl.classList.add("wrong");
          setTimeout(() => slotEl.classList.remove("wrong"), 350);
        }
        setFeedback($("drag-feedback"), "Solte sobre o encaixe marcado.", "bad");
      }
    };

    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  }

  function nextStep() {
    if (state.step >= STEPS.length - 1) {
      $("prompt-title").textContent = "Etapas do músculo liso concluídas";
      $("prompt-body").textContent =
        "Forma fusiforme, corpos densos (α-actinina; desmina/vimentina), cavéolas, actina e miosina curva.";
      showBlock("text");
      $("text-block").classList.add("hidden");
      $("btn-next").disabled = true;
      $("btn-next").textContent = "Concluído";
      $("slots").innerHTML = "";
      setFeedback($("text-feedback"), "Depois montamos o estriado.", "ok");
      drawCell();
      return;
    }
    state.step += 1;
    loadStep();
  }

  $("btn-check").onclick = checkText;
  $("text-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkText();
  });
  $("btn-next").onclick = nextStep;

  window.addEventListener("resize", () => {
    resize();
    drawCell();
    renderSlots();
  });

  function loop() {
    state.anim++;
    drawCell();
    requestAnimationFrame(loop);
  }

  resize();
  loadStep();
  loop();
})();
