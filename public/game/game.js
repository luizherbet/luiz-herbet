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
    focus: null, // 'dense' | 'actinin' | 'desmin' | 'caveolae'
    // visual flags unlocked by steps
    showDense: false,
    showActinin: false,
    showDesmin: false,
    showCaveolae: true, // sempre visíveis; destaque no focus
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

  // posições no fuso: t = eixo longo (-1..1), u = espessura (-1..1)
  const DENSE_CYTO = [
    [-0.45, -0.25], [-0.2, 0.45], [0.05, -0.5], [0.28, 0.35],
    [0.5, -0.2], [-0.05, 0.1], [0.15, 0.55], [-0.32, -0.5],
  ];
  const DENSE_PLAQUE = [
    [-0.7, -0.85], [-0.35, 0.9], [0.0, -0.95], [0.35, 0.9],
    [0.7, -0.85], [-0.55, 0.75], [0.55, 0.75], [0.2, -0.9],
  ];
  // cavéolas ao longo da membrana (lado ventral/dorsal)
  const CAVEOLAE = [
    [-0.55, -1], [-0.35, -1], [-0.15, -1], [0.1, -1], [0.3, -1],
    [-0.5, 1], [-0.25, 1], [0.0, 1], [0.25, 1], [0.45, 1],
  ];

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
      body: "Os pontos mais claros dentro do fuso são os alvos. Arraste os corpos densos para o citoplasma.",
      type: "place+quiz",
      piece: "corpos",
      slot: { id: "corpos", x: 50, y: 48 },
      onEnter: () => { state.focus = "dense"; },
      unlock: () => { state.showDense = true; state.focus = "dense"; },
      quiz: [
        {
          q: "Que proteína de actina ancora nos corpos densos?",
          options: ["α-actinina", "Troponina C", "Titina"],
          answer: 0,
          onShow: () => { state.focus = "actinin"; state.showActinin = true; },
        },
        {
          q: "Quais filamentos intermediários ligam a rede?",
          options: ["Desmina e vimentina", "Queratina e lamína", "Tubulina e dineína"],
          answer: 0,
          onShow: () => { state.focus = "desmin"; state.showDesmin = true; },
        },
      ],
      feedback: "Corpos densos no lugar — α-actinina + desmina/vimentina.",
    },
    {
      id: "caveolas",
      phase: "Membrana",
      title: "O que são essas invaginações?",
      body: "Veja as curvas em frasco na membrana (seta). Digite o nome dessas invaginações.",
      type: "text",
      answers: ["caveolos", "caveolas", "caveola", "caveolo"],
      onEnter: () => {
        state.focus = "caveolae";
        const g = geom();
        // seta sobre a primeira cavéola superior
        const p = spindlePoint(g, -0.35, -1);
        showArrow((p.x / state.W) * 100, (p.y / state.H) * 100 - 4);
      },
      onLeave: () => { hideArrow(); state.focus = null; },
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
      cy: state.H * 0.46,
      rx: state.W * 0.44,
      ry: state.H * 0.17,
    };
  }

  /** Altura do fuso em t ∈ [-1,1] — afila nas pontas */
  function halfH(g, t) {
    const s = 1 - t * t;
    return g.ry * Math.max(0.08, s);
  }

  function spindlePoint(g, t, u) {
    return {
      x: g.cx + t * g.rx,
      y: g.cy + u * halfH(g, t),
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

    ctx.fillStyle = "#e8f1f6";
    ctx.fillRect(0, 0, state.W, state.H);

    const dim = state.focus === "dense" || state.focus === "actinin" || state.focus === "desmin" || state.focus === "caveolae";

    // células vizinhas
    ctx.globalAlpha = dim ? 0.1 : 0.22;
    drawSpindle(g.cx - g.rx * 0.5, g.cy - g.ry * 1.35, g.rx * 0.5, g.ry * 0.55);
    drawSpindle(g.cx + g.rx * 0.48, g.cy + g.ry * 1.3, g.rx * 0.48, g.ry * 0.5);
    ctx.globalAlpha = 1;

    drawSpindle(g.cx, g.cy, g.rx, g.ry, true);

    // organelas (mitocôndrias + REL) — esmaecidas no foco
    ctx.globalAlpha = dim ? 0.28 : 0.85;
    drawMitosAndRel(g);
    ctx.globalAlpha = 1;

    drawNucleus(g);

    // cavéolas sempre; destaque forte no foco
    drawCaveolae(g, state.focus === "caveolae");

    // corpos densos: preview claro na etapa, sólidos depois de colocar
    if (state.focus === "dense" && !state.showDense) {
      drawDense(g, { preview: true, glow: true });
    }
    if (state.showDense) {
      drawDense(g, {
        preview: false,
        glow: state.focus === "dense" || state.focus === "actinin",
        actinin: state.showActinin && state.focus === "actinin",
      });
    }
    if (state.showDesmin) drawDesmin(g, state.focus === "desmin");
    if (state.showActin) drawActin(g);
    if (state.showMyosin) drawMyosin(g);
    if (state.showTropomyosin || state.showCaldesmon || state.showCalponin) drawFineReg(g);
    if (state.showCaOut) drawCaInflux(g);
    if (state.showCaRel) drawCaRel(g);
    if (state.showCaM) drawCaM(g);
    if (state.showMlck) drawMlck(g);

    ctx.fillStyle = "#5a6d78";
    ctx.font = "600 13px 'Source Sans 3', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Célula muscular lisa fusiforme", g.cx, state.H - 14);

    state.anim++;
    requestAnimationFrame(draw);
  }

  function drawSpindle(cx, cy, rx, ry, main) {
    const grd = ctx.createLinearGradient(cx - rx, cy - ry, cx + rx, cy + ry);
    grd.addColorStop(0, main ? "#f7cedb" : "#e0b4c3");
    grd.addColorStop(1, main ? "#d89aaf" : "#c98ea4");
    ctx.beginPath();
    ctx.moveTo(cx - rx, cy);
    ctx.bezierCurveTo(
      cx - rx * 0.4, cy - ry * 1.2,
      cx + rx * 0.4, cy - ry * 1.2,
      cx + rx, cy
    );
    ctx.bezierCurveTo(
      cx + rx * 0.4, cy + ry * 1.2,
      cx - rx * 0.4, cy + ry * 1.2,
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
    const dim = state.focus && state.focus !== "dense";
    ctx.globalAlpha = dim ? 0.45 : 1;
    ctx.beginPath();
    ctx.ellipse(g.cx, g.cy, Math.max(16, g.rx * 0.09), Math.max(11, g.ry * 0.42), 0, 0, Math.PI * 2);
    ctx.fillStyle = "#6b3f7a";
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(g.cx - 4, g.cy - 3, 3.5, 2.8, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#9b6aad";
    ctx.fill();
    ctx.fillStyle = "#4a2c57";
    ctx.font = "700 11px 'Source Sans 3', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("núcleo", g.cx, g.cy + Math.max(16, g.ry * 0.42) + 12);
    ctx.globalAlpha = 1;
  }

  function drawMitosAndRel(g) {
    const mitos = [
      [-0.5, -0.2], [-0.3, 0.35], [0.4, -0.3], [0.52, 0.25], [0.12, -0.4],
    ];
    mitos.forEach(([t, u]) => {
      const p = spindlePoint(g, t, u);
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, 11, 5.5, t * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = "#c45c3a";
      ctx.fill();
    });
    // REL perto da membrana esquerda (dentro)
    const a = spindlePoint(g, -0.72, -0.15);
    const b = spindlePoint(g, -0.62, 0.35);
    ctx.strokeStyle = "#2f7d9a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y - 8);
    ctx.bezierCurveTo(a.x + 14, a.y - 18, b.x + 8, b.y + 10, b.x, b.y);
    ctx.stroke();
  }

  /** Cavéolas em frasco na membrana — curvas abertas para fora */
  function drawCaveolae(g, highlight) {
    CAVEOLAE.forEach(([t, side], idx) => {
      const rim = spindlePoint(g, t, side * 0.98);
      const inward = side > 0 ? -1 : 1; // direção para dentro do citoplasma
      const nx = 0;
      const ny = inward;
      const mouth = 7 + (highlight ? 2 : 0);
      const depth = 11 + (highlight ? 3 : 0);

      // centro do "frasco" ligeiramente para dentro
      const cx = rim.x + nx * depth * 0.15;
      const cy = rim.y + ny * (depth * 0.55);

      ctx.beginPath();
      // abertura na membrana + fundo arredondado (Ω / frasco)
      ctx.moveTo(rim.x - mouth, rim.y);
      ctx.quadraticCurveTo(rim.x - mouth * 0.7, cy + ny * depth * 0.1, cx - mouth * 0.55, cy + ny * depth * 0.35);
      ctx.quadraticCurveTo(cx, cy + ny * depth * 0.85, cx + mouth * 0.55, cy + ny * depth * 0.35);
      ctx.quadraticCurveTo(rim.x + mouth * 0.7, cy + ny * depth * 0.1, rim.x + mouth, rim.y);
      ctx.strokeStyle = highlight ? "#0a5c6a" : "#1a6a7a";
      ctx.lineWidth = highlight ? 3 : 2.2;
      ctx.stroke();
      if (highlight) {
        ctx.fillStyle = "rgba(126, 200, 212, 0.45)";
        ctx.fill();
        // pulso
        const pulse = 0.5 + 0.5 * Math.sin(state.anim * 0.12 + idx);
        ctx.strokeStyle = `rgba(13,110,110,${0.35 + pulse * 0.45})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });
  }

  function drawDense(g, opts) {
    const { preview, glow, actinin } = opts;
    const color = preview ? "rgba(168, 120, 60, 0.55)" : "#7a4a1e";
    const glowCol = actinin ? "rgba(226, 184, 74, 0.7)" : "rgba(200, 150, 70, 0.45)";

    DENSE_CYTO.forEach(([t, u]) => {
      const p = spindlePoint(g, t, u * 0.75);
      if (glow || preview) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, preview ? 9 : 10, 0, Math.PI * 2);
        ctx.fillStyle = glowCol;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, preview ? 4.5 : 5.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      if (actinin) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#e2b84a";
        ctx.fill();
      }
    });

    DENSE_PLAQUE.forEach(([t, u]) => {
      const p = spindlePoint(g, t, u * 0.92);
      if (glow || preview) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = glowCol;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, preview ? 4 : 5, 0, Math.PI * 2);
      ctx.fillStyle = preview ? "rgba(110, 69, 32, 0.55)" : "#5c3a18";
      ctx.fill();
      if (actinin) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#e2b84a";
        ctx.fill();
      }
    });

    if (actinin) {
      ctx.fillStyle = "#8a5a18";
      ctx.font = "700 12px 'Source Sans 3', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("α-actinina nos densos", g.cx, g.cy - g.ry - 18);
    }
  }

  function drawDesmin(g, highlight) {
    const pts = DENSE_CYTO.map(([t, u]) => spindlePoint(g, t, u * 0.75));
    const links = [[0, 2], [2, 4], [1, 3], [3, 5], [5, 0], [1, 6], [6, 4], [7, 0], [7, 5]];
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = highlight ? "#6b3f7a" : "#8a6a9a";
    ctx.lineWidth = highlight ? 2.4 : 1.6;
    links.forEach(([a, b]) => {
      if (!pts[a] || !pts[b]) return;
      ctx.beginPath();
      ctx.moveTo(pts[a].x, pts[a].y);
      ctx.lineTo(pts[b].x, pts[b].y);
      ctx.stroke();
    });
    ctx.setLineDash([]);
    if (highlight) {
      ctx.fillStyle = "#6b3f7a";
      ctx.font = "700 12px 'Source Sans 3', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("desmina + vimentina", g.cx, g.cy - g.ry - 18);
    }
  }

  function drawActin(g) {
    const pts = DENSE_CYTO.map(([t, u]) => spindlePoint(g, t, u * 0.75));
    const plaques = DENSE_PLAQUE.map(([t, u]) => spindlePoint(g, t, u * 0.92));
    ctx.strokeStyle = "#c0392b";
    ctx.lineWidth = 2.4;
    // densos ↔ densos
    [[0, 2], [2, 4], [1, 3], [3, 5], [5, 0], [1, 6]].forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(pts[a].x, pts[a].y);
      ctx.lineTo(pts[b].x, pts[b].y);
      ctx.stroke();
    });
    // densos ↔ placas
    [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5]].forEach(([ci, pi]) => {
      ctx.beginPath();
      ctx.moveTo(pts[ci].x, pts[ci].y);
      ctx.lineTo(plaques[pi].x, plaques[pi].y);
      ctx.stroke();
    });
  }

  function drawMyosin(g) {
    const loops = [
      spindlePoint(g, -0.25, 0.2),
      spindlePoint(g, 0.15, -0.25),
      spindlePoint(g, 0.4, 0.15),
    ];
    ctx.strokeStyle = "#2b6cb0";
    ctx.lineWidth = 3;
    loops.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 11, 0.2, Math.PI * 1.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.x + 9, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#1e4e8c";
      ctx.fill();
    });
  }

  function drawFineReg(g) {
    if (state.showTropomyosin) {
      const a = spindlePoint(g, -0.35, 0.4);
      const b = spindlePoint(g, 0.4, 0.35);
      ctx.strokeStyle = "#8e44ad";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.bezierCurveTo(g.cx - 20, g.cy + 30, g.cx + 20, g.cy + 40, b.x, b.y);
      ctx.stroke();
    }
    if (state.showCaldesmon) {
      const p = spindlePoint(g, 0.5, 0.4);
      ctx.fillStyle = "#16a085";
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, 10, 7, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    if (state.showCalponin) {
      const p = spindlePoint(g, -0.4, 0.3);
      ctx.fillStyle = "#d35400";
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, 10, 7, -0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawCaInflux(g) {
    const t = (state.anim % 60) / 60;
    CAVEOLAE.filter((c) => c[1] < 0).forEach(([tt], i) => {
      const rim = spindlePoint(g, tt, -0.98);
      const inn = spindlePoint(g, tt, -0.35);
      const k = (t + i * 0.12) % 1;
      const x = rim.x + (inn.x - rim.x) * k;
      const y = rim.y + (inn.y - rim.y) * k;
      ctx.beginPath();
      ctx.arc(x, y, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = "#3498db";
      ctx.fill();
    });
  }

  function drawCaRel(g) {
    const t = (state.anim % 50) / 50;
    for (let i = 0; i < 6; i++) {
      const p = spindlePoint(g, 0.55, -0.2 + i * 0.12);
      ctx.beginPath();
      ctx.arc(p.x + Math.sin(i + t * 5) * 4, p.y + t * 6, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = "#1a6a7a";
      ctx.fill();
    }
  }

  function drawCaM(g) {
    const p = spindlePoint(g, 0, -0.35);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(39,174,96,0.25)";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#27ae60";
    ctx.stroke();
  }

  function drawMlck(g) {
    const p = spindlePoint(g, 0.3, -0.45);
    ctx.fillStyle = "#0d6e6e";
    roundRect(p.x - 16, p.y - 10, 32, 20, 6);
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
    if (item.onShow) item.onShow();
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
    if (s.id === "corpos") state.focus = null;
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
      focus: null,
      showDense: false,
      showActinin: false,
      showDesmin: false,
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
