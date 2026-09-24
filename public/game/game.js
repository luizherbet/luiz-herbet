(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const canvas = $("cell");
  const ctx = canvas.getContext("2d");

  const state = {
    index: 0,
    W: 960,
    H: 560,
    anim: 0,
    placed: {},
    quizDone: {},
    drag: null,
    // visual flags unlocked by steps
    showDense: false,
    showCaveArrow: false,
    showActin: false,
    showMyosin: false,
    showTropomyosin: false,
    showCaldesmon: false,
    showCalponin: false,
    showCaOut: false,
    showCaRel: false,
    showCaM: false,
    showMlck: false,
  };

  const ICONS = {
    corpos: svgDots("#8a5a2b"),
    actina: svgLines("#c0392b"),
    miosina: svgCurves("#2b6cb0"),
    tropomiosina: svgCoil("#8e44ad"),
    caldesmona: svgBlob("#16a085"),
    calponina: svgBlob("#d35400"),
    calmodulina: svgRing("#27ae60"),
    mlck: svgBox("#0d6e6e"),
    ca_out: svgCa("#3498db"),
    ca_rel: svgCa("#1a6a7a"),
  };

  function svgDots(c) {
    return `<svg class="ico" viewBox="0 0 64 64"><circle cx="20" cy="22" r="6" fill="${c}"/><circle cx="40" cy="20" r="6" fill="${c}"/><circle cx="30" cy="38" r="6" fill="${c}"/><circle cx="46" cy="40" r="5" fill="${c}"/></svg>`;
  }
  function svgLines(c) {
    return `<svg class="ico" viewBox="0 0 64 64"><path d="M12 48 L32 16 L52 48" fill="none" stroke="${c}" stroke-width="4"/><path d="M18 48 L32 24 L46 48" fill="none" stroke="${c}" stroke-width="3" opacity="0.7"/></svg>`;
  }
  function svgCurves(c) {
    return `<svg class="ico" viewBox="0 0 64 64"><path d="M16 42 C16 22 34 22 34 34 C34 48 16 48 16 34" fill="none" stroke="${c}" stroke-width="4"/><path d="M30 42 C30 22 48 22 48 34 C48 48 30 48 30 34" fill="none" stroke="${c}" stroke-width="4"/><circle cx="16" cy="34" r="4" fill="${c}"/><circle cx="48" cy="34" r="4" fill="${c}"/></svg>`;
  }
  function svgCoil(c) {
    return `<svg class="ico" viewBox="0 0 64 64"><path d="M12 32 C20 18 28 46 36 32 C44 18 52 46 56 32" fill="none" stroke="${c}" stroke-width="4"/></svg>`;
  }
  function svgBlob(c) {
    return `<svg class="ico" viewBox="0 0 64 64"><ellipse cx="32" cy="32" rx="18" ry="14" fill="${c}"/><circle cx="26" cy="28" r="3" fill="#fff" opacity="0.5"/></svg>`;
  }
  function svgRing(c) {
    return `<svg class="ico" viewBox="0 0 64 64"><circle cx="32" cy="32" r="16" fill="none" stroke="${c}" stroke-width="6"/><circle cx="32" cy="32" r="6" fill="${c}"/></svg>`;
  }
  function svgBox(c) {
    return `<svg class="ico" viewBox="0 0 64 64"><rect x="14" y="16" width="36" height="32" rx="8" fill="${c}"/><rect x="22" y="24" width="20" height="8" rx="2" fill="#dff" fill="#d9fff8"/></svg>`;
  }
  function svgCa(c) {
    return `<svg class="ico" viewBox="0 0 64 64"><circle cx="32" cy="32" r="18" fill="${c}" opacity="0.25"/><circle cx="22" cy="28" r="5" fill="${c}"/><circle cx="36" cy="24" r="4" fill="${c}"/><circle cx="40" cy="38" r="5" fill="${c}"/><circle cx="26" cy="40" r="3.5" fill="${c}"/></svg>`;
  }

  // fix svgBox double fill typo
  ICONS.mlck = `<svg class="ico" viewBox="0 0 64 64"><rect x="14" y="16" width="36" height="32" rx="8" fill="#0d6e6e"/><rect x="22" y="24" width="20" height="8" rx="2" fill="#d9fff8"/></svg>`;

  const PIECES = {
    corpos: { id: "corpos", name: "Corpos densos", icon: "corpos" },
    actina: { id: "actina", name: "Actina", icon: "actina" },
    miosina: { id: "miosina", name: "Miosina", icon: "miosina" },
    tropomiosina: { id: "tropomiosina", name: "Tropomiosina", icon: "tropomiosina" },
    caldesmona: { id: "caldesmona", name: "Caldesmona", icon: "caldesmona" },
    calponina: { id: "calponina", name: "Calponina", icon: "calponina" },
    calmodulina: { id: "calmodulina", name: "Calmodulina", icon: "calmodulina" },
    mlck: { id: "mlck", name: "MLCK", icon: "mlck" },
    ca_out: { id: "ca_out", name: "Ca²⁺ fora", icon: "ca_out", pool: true },
    ca_rel: { id: "ca_rel", name: "Ca²⁺ do REL", icon: "ca_rel", pool: true },
  };

  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9+²]/gi, "")
      .trim();
  }

  function matchAny(value, list) {
    const v = norm(value);
    return list.some((x) => v === norm(x) || v.includes(norm(x)));
  }

  const STEPS = [
    {
      id: "forma",
      phase: "Forma",
      title: "Qual a forma desta célula?",
      body: "A célula muscular lisa já está aqui, com núcleo central e organelas. Digite a forma típica.",
      type: "text",
      answers: ["fusiforme", "fuso", "formato fusiforme"],
      feedback: "Correto — célula fusiforme (em fuso).",
    },
    {
      id: "corpos",
      phase: "Âncoras",
      title: "Coloque os corpos densos",
      body: "Arraste os corpos densos para o citoplasma. Depois responda sobre as âncoras.",
      type: "place+quiz",
      piece: "corpos",
      slot: { id: "corpos", x: 42, y: 42 },
      unlock: () => { state.showDense = true; },
      quiz: [
        {
          q: "Que proteína de actina ancora nos corpos densos?",
          options: ["α-actinina", "Troponina C", "Titina"],
          answer: 0,
        },
        {
          q: "Quais filamentos intermediários ligam a rede?",
          options: ["Desmina e vimentina", "Queratina e lamína", "Tubulina e dineína"],
          answer: 0,
        },
      ],
      feedback: "Corpos densos no lugar — α-actinina + desmina/vimentina.",
    },
    {
      id: "caveolas",
      phase: "Membrana",
      title: "O que são essas invaginações?",
      body: "A seta aponta as invaginações da membrana onde entra Ca²⁺. Digite o nome.",
      type: "text",
      answers: ["caveolos", "caveolas", "caveola", "caveolo"],
      unlock: () => { state.showCaveArrow = true; },
      onEnter: () => showArrow(14, 56),
      onLeave: () => hideArrow(),
      feedback: "Correto — cavéolas (caveolos).",
    },
    {
      id: "actina",
      phase: "Filamentos",
      title: "Ligue os corpos densos com actina",
      body: "Arraste a actina. Ela conecta corpos densos e placas densas.",
      type: "place",
      piece: "actina",
      slot: { id: "actina", x: 50, y: 58 },
      unlock: () => { state.showActin = true; },
      feedback: "Actina no lugar — malha ligando os densos.",
    },
    {
      id: "miosina",
      phase: "Filamentos",
      title: "Coloque a miosina curva",
      body: "No liso, a miosina inativa fica dobrada (10S). Arraste até o encaixe.",
      type: "place",
      piece: "miosina",
      slot: { id: "miosina", x: 58, y: 40 },
      unlock: () => { state.showMyosin = true; },
      feedback: "Miosina curva no lugar.",
    },
    {
      id: "tropomiosina",
      phase: "Regulação fina",
      title: "Encaixe a tropomiosina",
      body: "No filamento fino do liso também há tropomiosina.",
      type: "place",
      piece: "tropomiosina",
      slot: { id: "tropomiosina", x: 36, y: 62 },
      unlock: () => { state.showTropomyosin = true; },
      feedback: "Tropomiosina colocada.",
    },
    {
      id: "caldesmona",
      phase: "Regulação fina",
      title: "Encaixe a caldesmona",
      body: "Proteína associada ao fino no músculo liso.",
      type: "place",
      piece: "caldesmona",
      slot: { id: "caldesmona", x: 66, y: 66 },
      unlock: () => { state.showCaldesmon = true; },
      feedback: "Caldesmona colocada.",
    },
    {
      id: "calponina",
      phase: "Regulação fina",
      title: "Encaixe a calponina",
      body: "Outra proteína reguladora do filamento fino no liso.",
      type: "place",
      piece: "calponina",
      slot: { id: "calponina", x: 28, y: 48 },
      unlock: () => { state.showCalponin = true; },
      feedback: "Calponina colocada.",
    },
    {
      id: "ca_out",
      phase: "Cálcio",
      title: "Traga Ca²⁺ de fora da célula",
      body: "Arraste o reservatório de Ca²⁺ extracelular até as cavéolas.",
      type: "place",
      piece: "ca_out",
      slot: { id: "ca_out", x: 12, y: 48 },
      unlock: () => { state.showCaOut = true; },
      feedback: "Ca²⁺ entrando pelas cavéolas.",
    },
    {
      id: "ca_rel",
      phase: "Cálcio",
      title: "Liberte Ca²⁺ do REL",
      body: "A entrada nas cavéolas é pouca — o REL libera mais Ca²⁺. Arraste o reservatório interno.",
      type: "place",
      piece: "ca_rel",
      slot: { id: "ca_rel", x: 72, y: 48 },
      unlock: () => { state.showCaRel = true; },
      feedback: "Ca²⁺ liberado do REL.",
    },
    {
      id: "calmodulina",
      phase: "Sensor",
      title: "Ative a calmodulina",
      body: "Sem troponina no liso: o Ca²⁺ liga-se à calmodulina (CaM).",
      type: "place",
      piece: "calmodulina",
      slot: { id: "calmodulina", x: 50, y: 36 },
      unlock: () => { state.showCaM = true; },
      feedback: "Calmodulina ativada por Ca²⁺.",
    },
    {
      id: "mlck",
      phase: "Contração",
      title: "Ative a MLCK",
      body: "O complexo Ca²⁺–CaM ativa a MLCK, que fosforila a miosina.",
      type: "place",
      piece: "mlck",
      slot: { id: "mlck", x: 62, y: 30 },
      unlock: () => { state.showMlck = true; },
      feedback: "MLCK ativada — a célula pode contrair.",
      final: true,
    },
  ];

  function step() {
    return STEPS[state.index];
  }

  function resize() {
    const vp = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.W = Math.max(320, Math.floor(vp.width));
    state.H = Math.max(200, Math.floor(vp.height));
    canvas.width = Math.floor(state.W * dpr);
    canvas.height = Math.floor(state.H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function geom() {
    return {
      cx: state.W * 0.5,
      cy: state.H * 0.48,
      rx: state.W * 0.46,
      ry: state.H * 0.16,
    };
  }

  function showArrow(xPct, yPct) {
    const a = $("arrow");
    a.classList.remove("hidden");
    a.style.left = `${xPct}%`;
    a.style.top = `${yPct}%`;
  }
  function hideArrow() {
    $("arrow").classList.add("hidden");
  }

  function draw() {
    const g = geom();
    ctx.clearRect(0, 0, state.W, state.H);

    // background wash
    ctx.fillStyle = "#e8f1f6";
    ctx.fillRect(0, 0, state.W, state.H);

    // neighboring ghost cells
    ctx.globalAlpha = 0.25;
    drawSpindle(g.cx - g.rx * 0.55, g.cy - g.ry * 1.15, g.rx * 0.55, g.ry * 0.55);
    drawSpindle(g.cx + g.rx * 0.5, g.cy + g.ry * 1.1, g.rx * 0.5, g.ry * 0.5);
    ctx.globalAlpha = 1;

    // main cell
    drawSpindle(g.cx, g.cy, g.rx, g.ry, true);

    // organelles already present
    drawOrganelles(g);

    // nucleus
    drawNucleus(g);

    if (state.showDense) drawDense(g);
    if (state.showActin) drawActin(g);
    if (state.showMyosin) drawMyosin(g);
    if (state.showTropomyosin || state.showCaldesmon || state.showCalponin) drawFineReg(g);
    if (state.showCaOut) drawCaInflux(g);
    if (state.showCaRel) drawCaRel(g);
    if (state.showCaM) drawCaM(g);
    if (state.showMlck) drawMlck(g);

    // label
    ctx.fillStyle = "#5a6d78";
    ctx.font = "600 13px 'Source Sans 3', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Célula muscular lisa", g.cx, state.H - 16);

    state.anim++;
    requestAnimationFrame(draw);
  }

  function drawSpindle(cx, cy, rx, ry, main) {
    const grd = ctx.createLinearGradient(cx - rx, cy - ry, cx + rx, cy + ry);
    grd.addColorStop(0, main ? "#f6c9d7" : "#e0b4c3");
    grd.addColorStop(1, main ? "#d89aaf" : "#c98ea4");
    // pontas afiladas (fusiforme), não elipse oval
    ctx.beginPath();
    ctx.moveTo(cx - rx, cy);
    ctx.bezierCurveTo(
      cx - rx * 0.45, cy - ry * 1.15,
      cx + rx * 0.45, cy - ry * 1.15,
      cx + rx, cy
    );
    ctx.bezierCurveTo(
      cx + rx * 0.45, cy + ry * 1.15,
      cx - rx * 0.45, cy + ry * 1.15,
      cx - rx, cy
    );
    ctx.closePath();
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.strokeStyle = "#9a5f74";
    ctx.lineWidth = main ? 3 : 2;
    ctx.stroke();
  }

  function drawNucleus(g) {
    ctx.beginPath();
    ctx.ellipse(g.cx, g.cy, Math.max(18, g.rx * 0.1), Math.max(12, g.ry * 0.45), 0, 0, Math.PI * 2);
    ctx.fillStyle = "#6b3f7a";
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(g.cx - 5, g.cy - 3, 4, 3, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#9b6aad";
    ctx.fill();
    ctx.fillStyle = "#4a2c57";
    ctx.font = "700 11px 'Source Sans 3', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("núcleo", g.cx, g.cy + Math.max(18, g.ry * 0.45) + 14);
  }

  function drawOrganelles(g) {
    // mitochondria-ish
    const mitos = [
      [-0.55, -0.35], [-0.35, 0.4], [0.45, -0.38], [0.55, 0.3], [0.15, -0.55],
    ];
    mitos.forEach(([dx, dy]) => {
      const x = g.cx + dx * g.rx;
      const y = g.cy + dy * g.ry;
      ctx.beginPath();
      ctx.ellipse(x, y, 14, 7, dx, 0, Math.PI * 2);
      ctx.fillStyle = "#c45c3a";
      ctx.globalAlpha = 0.55;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    // REL sketch near membrane left
    ctx.strokeStyle = "#2f7d9a";
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(g.cx - g.rx * 0.82, g.cy - 10);
    ctx.bezierCurveTo(
      g.cx - g.rx * 0.7, g.cy - 30,
      g.cx - g.rx * 0.65, g.cy + 25,
      g.cx - g.rx * 0.78, g.cy + 18
    );
    ctx.stroke();
    ctx.globalAlpha = 1;
    // caveolae cups on left membrane
    for (let i = 0; i < 4; i++) {
      const a = Math.PI + (-0.35 + i * 0.22);
      const x = g.cx + Math.cos(a) * g.rx;
      const y = g.cy + Math.sin(a) * g.ry;
      ctx.beginPath();
      ctx.arc(x, y, 7, a - 1.1, a + 1.1);
      ctx.strokeStyle = "#1a6a7a";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  function drawDense(g) {
    const cyto = [
      [-0.35, -0.25], [-0.1, 0.35], [0.25, -0.3], [0.4, 0.25], [0.05, 0.05], [-0.25, 0.1],
    ];
    cyto.forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.arc(g.cx + dx * g.rx * 0.85, g.cy + dy * g.ry * 0.85, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#8a5a2b";
      ctx.fill();
    });
    // plaques on membrane
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(g.cx + Math.cos(a) * g.rx * 0.98, g.cy + Math.sin(a) * g.ry * 0.98, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = "#6e4520";
      ctx.fill();
    }
  }

  function drawActin(g) {
    const pairs = [
      [[-0.35, -0.25], [0.25, -0.3]],
      [[-0.1, 0.35], [0.4, 0.25]],
      [[-0.35, -0.25], [-0.25, 0.1]],
      [[0.05, 0.05], [0.4, 0.25]],
      [[-0.1, 0.35], [0.05, 0.05]],
    ];
    ctx.strokeStyle = "#c0392b";
    ctx.lineWidth = 2.5;
    pairs.forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(g.cx + a[0] * g.rx * 0.85, g.cy + a[1] * g.ry * 0.85);
      ctx.lineTo(g.cx + b[0] * g.rx * 0.85, g.cy + b[1] * g.ry * 0.85);
      ctx.stroke();
    });
  }

  function drawMyosin(g) {
    const loops = [
      [g.cx - 30, g.cy - 20],
      [g.cx + 20, g.cy + 10],
      [g.cx + 50, g.cy - 5],
    ];
    ctx.strokeStyle = "#2b6cb0";
    ctx.lineWidth = 3;
    loops.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 12, 0.2, Math.PI * 1.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + 10, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#1e4e8c";
      ctx.fill();
    });
  }

  function drawFineReg(g) {
    if (state.showTropomyosin) {
      ctx.strokeStyle = "#8e44ad";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(g.cx - 40, g.cy + 40);
      ctx.bezierCurveTo(g.cx - 10, g.cy + 20, g.cx + 10, g.cy + 60, g.cx + 40, g.cy + 35);
      ctx.stroke();
    }
    if (state.showCaldesmon) {
      ctx.fillStyle = "#16a085";
      ctx.beginPath();
      ctx.ellipse(g.cx + 70, g.cy + 55, 12, 8, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    if (state.showCalponin) {
      ctx.fillStyle = "#d35400";
      ctx.beginPath();
      ctx.ellipse(g.cx - 70, g.cy + 20, 11, 8, -0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawCaInflux(g) {
    const t = (state.anim % 60) / 60;
    for (let i = 0; i < 5; i++) {
      const a = Math.PI + 0.1 * i;
      const x0 = g.cx + Math.cos(a) * (g.rx + 28);
      const y0 = g.cy + Math.sin(a) * (g.ry + 8);
      const x1 = g.cx + Math.cos(a) * (g.rx - 10);
      const y1 = g.cy + Math.sin(a) * (g.ry - 6);
      const x = x0 + (x1 - x0) * ((t + i * 0.15) % 1);
      const y = y0 + (y1 - y0) * ((t + i * 0.15) % 1);
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#3498db";
      ctx.fill();
    }
  }

  function drawCaRel(g) {
    const t = (state.anim % 50) / 50;
    for (let i = 0; i < 6; i++) {
      const x = g.cx + g.rx * 0.55 + Math.sin(i + t * 6) * 8;
      const y = g.cy - 10 + i * 8 + t * 10;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#1a6a7a";
      ctx.fill();
    }
  }

  function drawCaM(g) {
    ctx.beginPath();
    ctx.arc(g.cx, g.cy - g.ry * 0.35, 16, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(39,174,96,0.25)";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#27ae60";
    ctx.stroke();
  }

  function drawMlck(g) {
    ctx.fillStyle = "#0d6e6e";
    roundRect(g.cx + g.rx * 0.25, g.cy - g.ry * 0.55, 36, 22, 6);
    ctx.fill();
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function setFeedback(ok, msg) {
    const el = $("feedback");
    el.classList.remove("hidden", "ok", "bad");
    el.classList.add(ok ? "ok" : "bad");
    el.textContent = msg;
  }

  function clearFeedback() {
    $("feedback").classList.add("hidden");
  }

  function renderUI() {
    const s = step();
    $("step-title").textContent = "Célula muscular lisa";
    $("step-count").textContent = `${state.index + 1} / ${STEPS.length}`;
    $("progress-fill").style.width = `${((state.index) / (STEPS.length - 1)) * 100}%`;
    $("phase").textContent = s.phase;
    $("prompt").textContent = s.title;
    $("body").textContent = s.body;

    $("text-form").classList.toggle("hidden", s.type !== "text");
    $("quiz").classList.add("hidden");
    $("tray-wrap").classList.add("hidden");
    $("btn-next").classList.add("hidden");
    clearFeedback();
    hideArrow();
    if (s.onLeave) { /* noop on render */ }
    if (s.onEnter) s.onEnter();

    $("answer").value = "";
    if (s.type === "text") {
      $("answer-label").textContent = "Digite aqui";
      setTimeout(() => $("answer").focus(), 50);
    }

    if (s.type === "place" || s.type === "place+quiz") {
      $("tray-wrap").classList.remove("hidden");
      renderTray(s);
      renderSlots(s);
      if (s.type === "place+quiz" && state.placed[s.slot.id] && !allQuizDone(s)) {
        renderQuiz(s);
      }
    } else {
      $("slots").innerHTML = "";
      $("tray").innerHTML = "";
      $("pools").innerHTML = "";
    }
  }

  function allQuizDone(s) {
    if (!s.quiz) return true;
    return s.quiz.every((_, i) => state.quizDone[`${s.id}:${i}`]);
  }

  function renderQuiz(s) {
    const box = $("quiz");
    box.classList.remove("hidden");
    const nextIdx = s.quiz.findIndex((_, i) => !state.quizDone[`${s.id}:${i}`]);
    if (nextIdx < 0) {
      box.classList.add("hidden");
      finishStep(s);
      return;
    }
    const item = s.quiz[nextIdx];
    box.innerHTML = "";
    const q = document.createElement("p");
    q.className = "quiz-q";
    q.textContent = item.q;
    box.appendChild(q);
    const opts = document.createElement("div");
    opts.className = "quiz-opts";
    item.options.forEach((label, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "quiz-opt";
      b.textContent = label;
      b.onclick = () => {
        if (i === item.answer) {
          b.classList.add("ok");
          state.quizDone[`${s.id}:${nextIdx}`] = true;
          clearFeedback();
          setTimeout(() => renderQuiz(s), 280);
        } else {
          b.classList.add("bad");
          setFeedback(false, "Não é essa. Tente outra.");
        }
      };
      opts.appendChild(b);
    });
    box.appendChild(opts);
  }

  function renderTray(s) {
    const tray = $("tray");
    const pools = $("pools");
    tray.innerHTML = "";
    pools.innerHTML = "";

    // show current piece + already collected pieces as visual reference? Only current + unused distractors later.
    // For guided mode: only the piece needed for this step, plus Ca pools when relevant.
    const needed = PIECES[s.piece];
    if (!needed) return;

    if (needed.pool) {
      const el = document.createElement("div");
      el.className = "pool" + (state.placed[s.slot.id] ? " used" : "");
      el.dataset.pieceId = needed.id;
      el.innerHTML = `${ICONS[needed.icon]}<span class="pool-label">${needed.name}</span>`;
      // pools show names as reservoirs labels per user request
      if (!state.placed[s.slot.id]) bindDrag(el, needed.id);
      pools.appendChild(el);
      // also show the other pool as visible context (not draggable this step)
      const otherId = needed.id === "ca_out" ? "ca_rel" : "ca_out";
      const other = PIECES[otherId];
      const o = document.createElement("div");
      o.className = "pool used";
      o.innerHTML = `${ICONS[other.icon]}<span class="pool-label">${other.name}</span>`;
      pools.appendChild(o);
    } else {
      // all 8 structural pieces visible; only current is active, others greyed until their step
      const order = ["actina", "tropomiosina", "caldesmona", "calponina", "miosina", "corpos", "calmodulina", "mlck"];
      order.forEach((id) => {
        const p = PIECES[id];
        const unlocked = canDragPiece(id, s);
        const used = Object.values(state.placed).includes(id);
        const el = document.createElement("div");
        el.className = "piece" + (used || !unlocked ? " used" : "");
        el.dataset.pieceId = id;
        el.innerHTML = ICONS[p.icon];
        if (unlocked && !used) bindDrag(el, id);
        tray.appendChild(el);
      });
    }
  }

  function canDragPiece(id, s) {
    return s.piece === id;
  }

  function renderSlots(s) {
    const host = $("slots");
    host.innerHTML = "";
    if (!s.slot) return;
    const el = document.createElement("div");
    const filled = !!state.placed[s.slot.id];
    el.className = "slot active" + (filled ? " filled" : "");
    el.style.left = `${s.slot.x}%`;
    el.style.top = `${s.slot.y}%`;
    el.dataset.slotId = s.slot.id;
    if (filled) {
      const p = PIECES[state.placed[s.slot.id]];
      el.innerHTML = `${ICONS[p.icon].replace('class="ico"', 'class="slot-icon"')}<span class="slot-name">${p.name}</span>`;
    }
    host.appendChild(el);
  }

  function finishStep(s) {
    if (s.unlock) s.unlock();
    setFeedback(true, s.feedback || "Correto!");
    $("btn-next").classList.remove("hidden");
    $("btn-next").textContent = s.final ? "Concluir" : "Próxima etapa";
    if (s.onLeave) s.onLeave();
    hideArrow();
  }

  function goNext() {
    const s = step();
    if (s.onLeave) s.onLeave();
    if (s.final) {
      state.index = 0;
      resetVisuals();
      renderUI();
      setFeedback(true, "Célula montada. Recomeçando o percurso.");
      return;
    }
    state.index += 1;
    renderUI();
  }

  function resetVisuals() {
    Object.assign(state, {
      placed: {},
      quizDone: {},
      showDense: false,
      showCaveArrow: false,
      showActin: false,
      showMyosin: false,
      showTropomyosin: false,
      showCaldesmon: false,
      showCalponin: false,
      showCaOut: false,
      showCaRel: false,
      showCaM: false,
      showMlck: false,
    });
  }

  function tryPlace(pieceId, slotId) {
    const s = step();
    if (!s.slot || s.slot.id !== slotId) return;
    if (s.piece !== pieceId) {
      const slotEl = document.querySelector(`[data-slot-id="${slotId}"]`);
      if (slotEl) {
        slotEl.classList.add("wrong");
        setTimeout(() => slotEl.classList.remove("wrong"), 350);
      }
      setFeedback(false, "Não é essa peça nesta etapa.");
      return;
    }
    state.placed[slotId] = pieceId;
    if (s.unlock) s.unlock();
    renderSlots(s);
    renderTray(s);
    setFeedback(true, PIECES[pieceId].name);
    if (s.type === "place+quiz") {
      renderQuiz(s);
    } else {
      finishStep(s);
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
      if (node.classList && node.classList.contains("slot") && !node.classList.contains("filled")) return node;
    }
    return null;
  }

  function bindDrag(el, pieceId) {
    el.addEventListener("pointerdown", (e) => {
      if (e.button != null && e.button !== 0) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      const ghost = $("ghost");
      const p = PIECES[pieceId];
      ghost.innerHTML = ICONS[p.icon];
      ghost.classList.remove("hidden");
      ghost.style.left = `${e.clientX}px`;
      ghost.style.top = `${e.clientY}px`;
      el.classList.add("dragging");
      state.drag = { pieceId, pointerId: e.pointerId, x0: e.clientX, y0: e.clientY, moved: false };
    });

    el.addEventListener("pointermove", (e) => {
      if (!state.drag || state.drag.pieceId !== pieceId || state.drag.pointerId !== e.pointerId) return;
      if (Math.hypot(e.clientX - state.drag.x0, e.clientY - state.drag.y0) > 4) state.drag.moved = true;
      $("ghost").style.left = `${e.clientX}px`;
      $("ghost").style.top = `${e.clientY}px`;
      clearHot();
      const over = slotFromPoint(e.clientX, e.clientY);
      if (over) over.classList.add("hot");
    });

    const end = (e) => {
      if (!state.drag || state.drag.pieceId !== pieceId || state.drag.pointerId !== e.pointerId) return;
      const moved = state.drag.moved;
      const x = e.clientX;
      const y = e.clientY;
      state.drag = null;
      clearHot();
      $("ghost").classList.add("hidden");
      el.classList.remove("dragging");
      if (!moved) return;
      const over = slotFromPoint(x, y);
      if (over && over.dataset.slotId) tryPlace(pieceId, over.dataset.slotId);
      else setFeedback(false, "Solte sobre o encaixe ativo.");
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  }

  $("text-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const s = step();
    if (s.type !== "text") return;
    const val = $("answer").value;
    if (matchAny(val, s.answers)) {
      finishStep(s);
    } else {
      setFeedback(false, "Ainda não. Tente de novo.");
    }
  });

  $("btn-next").onclick = goNext;
  $("btn-restart").onclick = () => {
    state.index = 0;
    resetVisuals();
    renderUI();
  };

  window.addEventListener("resize", resize);
  window.addEventListener("orientationchange", () => setTimeout(resize, 120));
  if (window.visualViewport) window.visualViewport.addEventListener("resize", resize);

  resize();
  renderUI();
  draw();
})();
