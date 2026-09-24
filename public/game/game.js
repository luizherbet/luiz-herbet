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
    showCaveolae: true,
    showActin: false,
    showMyosin: false,
    showTropomyosin: false,
    showCaldesmon: false,
    showCalponin: false,
    viewMode: "cell", // 'cell' | 'filament'
    thinParts: { actin: false, tropo: false, cald: false, calp: false },
    focusHighlight: null, // 'cald' | 'calp' | 'tropo' | null
    showCaOut: false,
    showCaRel: false,
    showCaM: false,
    showRelNearCaveolae: false,
    caAnim: { playing: false, phase: "idle", t0: 0, done: false },
    cascadeAnim: { playing: false, phase: "idle", t0: 0, done: false, step: 0 },
    shorten: 0,
    shortenTarget: 0,
    myosinActive: false,
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
      title: "Qual o nome desta estrutura?",
      body: "Os pontos escuros no citoplasma e na membrana contêm α-actinina. A rede tracejada que os liga é de desmina e vimentina. Digite o nome da estrutura.",
      type: "text",
      answers: [
        "corpos densos",
        "corpo denso",
        "corpos densos e placas densas",
        "placas densas",
        "corpo densos",
      ],
      onEnter: () => {
        state.focus = "desmin";
        state.showDense = true;
        state.showActinin = true;
        state.showDesmin = true;
      },
      onLeave: () => { state.focus = null; },
      feedback: "Correto — corpos densos (com α-actinina; rede de desmina e vimentina).",
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
      id: "filamento-liga",
      phase: "Filamentos",
      title: "Qual filamento se liga aos corpos densos?",
      body: "Escolha o filamento que ancora nos corpos densos e nas placas densas.",
      type: "quiz",
      onEnter: () => {
        state.viewMode = "cell";
        state.focus = "dense";
      },
      quiz: [
        {
          q: "Qual filamento se liga aos corpos densos?",
          options: ["Actina", "Miosina"],
          answer: 0,
        },
      ],
      unlock: () => {
        state.showActin = true;
        state.focus = null;
      },
      feedback: "Correto — a actina (filamento fino) ancora nos corpos densos.",
    },
    {
      id: "filamento-fino",
      phase: "Filamento fino",
      title: "Monte o filamento fino do liso",
      body: "Começamos só com a actina. Depois entram tropomiosina, caldesmona e calponina — como no esquema do filamento fino.",
      type: "quiz",
      onEnter: () => {
        state.viewMode = "filament";
        state.thinParts = { actin: true, tropo: false, cald: false, calp: false };
        state.focusHighlight = null;
      },
      onLeave: () => {
        state.viewMode = "cell";
        state.focusHighlight = null;
      },
      quiz: [
        {
          q: "A base azul deste filamento é:",
          options: ["F-actina", "Miosina (filamento espesso)", "Troponina"],
          answer: 0,
          onShow: () => {
            state.thinParts = { actin: true, tropo: false, cald: false, calp: false };
            state.focusHighlight = null;
          },
        },
        {
          q: "Qual o papel da caldesmona?",
          options: [
            "Bloqueia o sítio de ligação da miosina na actina",
            "É o sensor de Ca²⁺ do filamento fino (como troponina C)",
            "Monta o filamento espesso bipolar",
          ],
          answer: 0,
          onShow: () => {
            state.thinParts = { actin: true, tropo: true, cald: true, calp: false };
            state.focusHighlight = "cald";
            state.showTropomyosin = true;
            state.showCaldesmon = true;
          },
        },
        {
          q: "Qual o papel da calponina?",
          options: [
            "Também bloqueia o sítio da miosina na actina (depende de Ca²⁺ / fosforilação)",
            "Forma a cavéola na membrana",
            "Fosforila a miosina (é a MLCK)",
          ],
          answer: 0,
          onShow: () => {
            state.thinParts = { actin: true, tropo: true, cald: true, calp: true };
            state.focusHighlight = "calp";
            state.showCalponin = true;
          },
        },
        {
          q: "E a troponina no músculo liso?",
          options: [
            "Está ausente; caldesmona e calponina regulam o filamento fino",
            "Está no filamento fino, igual ao esquelético",
            "Substitui a calmodulina no citosol",
          ],
          answer: 0,
          onShow: () => {
            state.thinParts = { actin: true, tropo: true, cald: true, calp: true };
            state.focusHighlight = "tropo";
          },
        },
      ],
      feedback: "Filamento fino: actina + tropomiosina + caldesmona + calponina (sem troponina).",
    },
    {
      id: "miosina",
      phase: "Filamento espesso",
      title: "Miosina lateral-polar no liso",
      body: "Os filamentos espessos aparecem na célula: cabeças em sentidos opostos em cada face, sem zona nua no centro.",
      type: "quiz",
      onEnter: () => {
        state.viewMode = "cell";
        state.focusHighlight = null;
        state.showMyosin = true;
        state.focus = "myosin";
      },
      onLeave: () => { state.focus = null; },
      quiz: [
        {
          q: "O que NÃO existe na organização da miosina na célula muscular lisa?",
          options: [
            "Zona nua central",
            "Organização lateral-polar das moléculas",
            "Cabeças de miosina com atividade ATPase",
          ],
          answer: 0,
        },
      ],
      feedback: "Correto — no liso a miosina é lateral-polar e não tem zona nua central (diferente do estriado bipolar).",
    },
    {
      id: "calcio",
      phase: "Cálcio",
      title: "Entrada de Ca²⁺ e liberação do REL",
      body: "O REL fica junto das cavéolas e armazena Ca²⁺. Toque no botão para ver: ① Ca²⁺ entra pela membrana nas cavéolas ② IP₃ estimula o REL ③ o REL libera mais Ca²⁺.",
      type: "anim",
      animId: "ca",
      animLabel: "Animar entrada de Ca²⁺",
      animRepeat: "Repetir animação",
      onEnter: () => {
        state.viewMode = "cell";
        state.focus = "caveolae";
        state.showRelNearCaveolae = true;
        state.caAnim = { playing: false, phase: "idle", t0: 0, done: false };
        state.showCaOut = false;
        state.showCaRel = false;
      },
      onLeave: () => {
        state.focus = null;
        state.caAnim = { playing: false, phase: "idle", t0: 0, done: state.caAnim.done };
      },
      feedback: "Ca²⁺ entrou pelas cavéolas e o REL liberou mais Ca²⁺ (via IP₃).",
    },
    {
      id: "contracao",
      phase: "Contração",
      title: "Cascata até a contração",
      body: "Veja o caminho: Ca²⁺ → calmodulina → MLCK → miosina ativa → interação com actina → contração da célula.",
      type: "anim",
      animId: "contracao",
      animLabel: "Animar cascata e contração",
      animRepeat: "Repetir cascata",
      final: true,
      onEnter: () => {
        state.viewMode = "cascade";
        state.focus = null;
        state.showRelNearCaveolae = false;
        state.cascadeAnim = { playing: false, phase: "idle", t0: 0, done: false, step: 0 };
        state.shorten = 0;
        state.showCaM = false;
        state.showMlck = false;
        state.myosinActive = false;
      },
      onLeave: () => {
        state.viewMode = "cell";
        state.cascadeAnim = { playing: false, phase: "idle", t0: 0, done: state.cascadeAnim.done, step: 0 };
      },
      feedback: "Cascata completa: Ca²⁺–CaM → MLCK → miosina ativa → actina ↔ miosina → contração.",
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
    const s = state.shorten || 0;
    return {
      cx: state.W * 0.5,
      cy: state.H * 0.46,
      rx: state.W * 0.44 * (1 - s * 0.28),
      ry: state.H * 0.17 * (1 + s * 0.55),
      s,
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

    if (state.viewMode === "filament") {
      drawThinFilament();
      state.anim++;
      requestAnimationFrame(draw);
      return;
    }

    if (state.viewMode === "cascade") {
      updateCascadeAnim();
      drawCascade();
      state.anim++;
      requestAnimationFrame(draw);
      return;
    }

    // se a cascata passou para a célula (fase contração), continua o timer
    if (state.cascadeAnim && state.cascadeAnim.playing) {
      updateCascadeAnim();
    }

    // suaviza encurtamento da célula
    if (typeof state.shortenTarget === "number") {
      state.shorten += (state.shortenTarget - state.shorten) * 0.06;
    }

    const dim = state.focus === "dense" || state.focus === "actinin" || state.focus === "desmin" || state.focus === "caveolae" || state.focus === "myosin";

    ctx.globalAlpha = dim ? 0.1 : 0.22;
    drawSpindle(g.cx - g.rx * 0.5, g.cy - g.ry * 1.35, g.rx * 0.5, g.ry * 0.55);
    drawSpindle(g.cx + g.rx * 0.48, g.cy + g.ry * 1.3, g.rx * 0.48, g.ry * 0.5);
    ctx.globalAlpha = 1;

    drawSpindle(g.cx, g.cy, g.rx, g.ry, true);

    ctx.globalAlpha = dim && state.focus !== "myosin" ? 0.28 : state.focus === "myosin" ? 0.35 : 0.85;
    drawMitosAndRel(g);
    ctx.globalAlpha = 1;

    drawNucleus(g);
    drawCaveolae(g, state.focus === "caveolae");

    if (state.showDense) {
      drawDense(g, {
        preview: false,
        glow: state.focus === "dense" || state.focus === "actinin" || state.focus === "desmin",
        actinin: state.showActinin && state.focus !== "myosin",
      });
    }
    if (state.showDesmin && state.focus !== "myosin") drawDesmin(g, state.focus === "desmin");
    if (state.showActin) drawActin(g);
    if (state.showMyosin) drawMyosin(g, state.focus === "myosin");
    if (state.focus === "myosin") drawMyosinCallout(g);
    if (state.showRelNearCaveolae || state.caAnim.playing || state.caAnim.done) {
      drawRelNearCaveolae(g, state.caAnim.phase);
      drawCalciumAnimation(g);
    }
    if (state.showCaM) drawCaM(g);
    if (state.showMlck) drawMlck(g);
    if ((state.shorten || 0) > 0.2) {
      ctx.fillStyle = "#c45c3a";
      ctx.font = "700 18px Literata, Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("CONTRAÇÃO", g.cx, 28);
    }

    ctx.fillStyle = "#5a6d78";
    ctx.font = "600 13px 'Source Sans 3', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Célula muscular lisa fusiforme", g.cx, state.H - 14);

    state.anim++;
    requestAnimationFrame(draw);
  }

  /** Filamento fino estilo do esquema: actina (azul) + tropomiosina (rosa) + caldesmona (amarelo) + calponina (verde) */
  function drawThinFilament() {
    const cx = state.W * 0.5;
    const cy = state.H * 0.42;
    const len = Math.min(state.W * 0.82, 520);
    const x0 = cx - len / 2;
    const x1 = cx + len / 2;
    const parts = state.thinParts;
    const hi = state.focusHighlight;

    ctx.fillStyle = "#f7fafc";
    ctx.strokeStyle = "#c5d3dc";
    ctx.lineWidth = 1;
    roundRect(24, 24, state.W - 48, state.H - 48, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#1c2a33";
    ctx.font = "700 16px Literata, Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("Filamento fino do músculo liso", cx, 52);

    ctx.font = "600 12px 'Source Sans 3', sans-serif";
    ctx.fillStyle = "#5a6d78";
    ctx.fillText(
      parts.cald || parts.calp
        ? "actina + proteínas reguladoras"
        : parts.tropo
          ? "actina + tropomiosina"
          : "F-actina (base do aparelho contrátil)",
      cx,
      74
    );

    // actina: dupla hélice de esferas azuis
    if (parts.actin) {
      const n = 28;
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        const x = x0 + t * len;
        const phase = t * Math.PI * 6;
        const y1 = cy - 10 * Math.sin(phase);
        const y2 = cy - 10 * Math.sin(phase + Math.PI);
        ctx.beginPath();
        ctx.arc(x, y1, 7, 0, Math.PI * 2);
        ctx.fillStyle = "#3b82c4";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y2, 7, 0, Math.PI * 2);
        ctx.fillStyle = "#5a9fd4";
        ctx.fill();
      }
    }

    // tropomiosina: fitas rosa ao longo
    if (parts.tropo) {
      ctx.strokeStyle = hi === "tropo" ? "#c0265a" : "#e07a9a";
      ctx.lineWidth = hi === "tropo" ? 4 : 3;
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) {
        const t = i / 40;
        const x = x0 + t * len;
        const y = cy - 16 * Math.sin(t * Math.PI * 6);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) {
        const t = i / 40;
        const x = x0 + t * len;
        const y = cy - 16 * Math.sin(t * Math.PI * 6 + Math.PI);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // caldesmona: aglomerados amarelos
    if (parts.cald) {
      const positions = [0.18, 0.42, 0.66, 0.88];
      positions.forEach((t, idx) => {
        const x = x0 + t * len;
        const y = cy - 22 + (idx % 2) * 8;
        drawLobe(x, y, "#e2b84a", hi === "cald");
      });
    }

    // calponina: aglomerados verdes
    if (parts.calp) {
      const positions = [0.28, 0.52, 0.76];
      positions.forEach((t, idx) => {
        const x = x0 + t * len;
        const y = cy + 18 - (idx % 2) * 6;
        drawLobe(x, y, "#3d9e6f", hi === "calp");
      });
    }

    // legenda
    const legendY = state.H - 70;
    const items = [];
    if (parts.actin) items.push(["Actina", "#3b82c4"]);
    if (parts.tropo) items.push(["Tropomiosina", "#e07a9a"]);
    if (parts.cald) items.push(["Caldesmona", "#e2b84a"]);
    if (parts.calp) items.push(["Calponina", "#3d9e6f"]);
    const gap = Math.min(120, (state.W - 80) / Math.max(items.length, 1));
    const lx0 = cx - ((items.length - 1) * gap) / 2;
    items.forEach(([name, color], i) => {
      const x = lx0 + i * gap;
      ctx.beginPath();
      ctx.arc(x - 38, legendY, 7, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.fillStyle = "#1c2a33";
      ctx.font = "600 12px 'Source Sans 3', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(name, x - 26, legendY + 4);
    });

    if (hi === "tropo") {
      ctx.fillStyle = "#6b3f7a";
      ctx.font = "700 13px 'Source Sans 3', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Sem troponina no liso", cx, legendY - 28);
    }
  }

  function drawLobe(x, y, color, highlight) {
    if (highlight) {
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(13,110,110,0.15)";
      ctx.fill();
    }
    [[-6, -4], [6, -3], [0, 6], [-5, 5], [5, 4]].forEach(([dx, dy], i) => {
      ctx.beginPath();
      ctx.arc(x + dx, y + dy, 6 - (i % 2), 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });
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
    const s = g.s || 0;
    ctx.beginPath();
    if (s > 0.35) {
      // núcleo em saca-rolhas na contração
      ctx.ellipse(g.cx - s * 6, g.cy, Math.max(14, g.rx * 0.09), Math.max(10, g.ry * 0.38), -0.45 * s, 0, Math.PI * 2);
    } else {
      ctx.ellipse(g.cx, g.cy, Math.max(16, g.rx * 0.09), Math.max(11, g.ry * 0.42), 0, 0, Math.PI * 2);
    }
    ctx.fillStyle = "#6b3f7a";
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(g.cx - 4, g.cy - 3, 3.5, 2.8, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#9b6aad";
    ctx.fill();
    ctx.fillStyle = "#4a2c57";
    ctx.font = "700 11px 'Source Sans 3', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(s > 0.35 ? "núcleo (saca-rolhas)" : "núcleo", g.cx, g.cy + Math.max(16, g.ry * 0.42) + 12);
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
      ctx.fillText("α-actinina", g.cx - g.rx * 0.35, g.cy - g.ry - 10);
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
      ctx.fillText("desmina + vimentina", g.cx + g.rx * 0.2, g.cy - g.ry - 10);
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

  /** Filamentos espessos lateral-polares (liso): cabeças em sentidos opostos em cada face; sem zona nua central; pontas afiladas */
  function drawMyosin(g, highlight) {
    const filaments = [
      { t0: -0.55, t1: 0.05, u: -0.35 },
      { t0: -0.15, t1: 0.45, u: 0.25 },
      { t0: 0.1, t1: 0.65, u: -0.15 },
    ];
    filaments.forEach((f) => drawSidePolarFilament(g, f.t0, f.t1, f.u, highlight));
  }

  function drawSidePolarFilament(g, t0, t1, u, highlight) {
    const a = spindlePoint(g, t0, u);
    const b = spindlePoint(g, t1, u);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const px = -uy;
    const py = ux;

    // cauda (rosa/avermelhada)
    ctx.strokeStyle = highlight ? "#c45c7a" : "#b85a72";
    ctx.lineWidth = highlight ? 5 : 3.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();

    // extremidades afiladas/desnudas (sem cabeças)
    const bare = len * 0.12;
    const n = 10;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const dist = t * len;
      if (dist < bare || dist > len - bare) continue;
      const x = a.x + ux * dist;
      const y = a.y + uy * dist;
      // face “de cima”: cabeças para um sentido (ao longo do filamento, +ux)
      drawMyosinHead(x + px * 7, y + py * 7, ux, uy, highlight);
      // face “de baixo”: sentido contrário
      drawMyosinHead(x - px * 7, y - py * 7, -ux, -uy, highlight);
    }
  }

  function drawMyosinHead(x, y, dirx, diry, highlight) {
    const hx = x + dirx * 6;
    const hy = y + diry * 6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(hx, hy);
    ctx.strokeStyle = highlight ? "#1e4e8c" : "#2b6cb0";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(hx, hy, highlight ? 4.5 : 3.5, 0, Math.PI * 2);
    ctx.fillStyle = highlight ? "#2563a8" : "#3a7ec4";
    ctx.fill();
  }

  function drawMyosinCallout(g) {
    const boxW = Math.min(220, state.W * 0.42);
    const boxH = 88;
    const x = state.W - boxW - 14;
    const y = 12;
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.strokeStyle = "#9bb0be";
    ctx.lineWidth = 1;
    roundRect(x, y, boxW, boxH, 10);
    ctx.fill();
    ctx.stroke();

    // mini esquema lateral-polar
    const mx = x + 16;
    const my = y + 36;
    const mlen = boxW - 32;
    ctx.strokeStyle = "#b85a72";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(mx, my);
    ctx.lineTo(mx + mlen, my);
    ctx.stroke();
    for (let i = 2; i < 10; i++) {
      const px = mx + (i / 11) * mlen;
      ctx.beginPath();
      ctx.arc(px, my - 8, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#2b6cb0";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, my + 8, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    // pontas desnudas
    ctx.fillStyle = "#5a6d78";
    ctx.font = "600 10px 'Source Sans 3', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Lateral-polar · sem zona nua central", x + 12, y + 18);
    ctx.fillText("Pontas afiladas/desnudas", x + 12, y + boxH - 12);
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

  function drawRelNearCaveolae(g, phase) {
    const sites = CAVEOLAE.filter((c) => c[1] < 0).slice(0, 5);
    sites.forEach(([t], i) => {
      const rim = spindlePoint(g, t, -0.98);
      const rel = spindlePoint(g, t, -0.42);
      ctx.strokeStyle = phase === "ip3" || phase === "release" ? "#0d6e6e" : "#2f7d9a";
      ctx.lineWidth = phase === "ip3" ? 3 : 2.2;
      ctx.beginPath();
      ctx.moveTo(rel.x - 10, rel.y - 6);
      ctx.bezierCurveTo(rel.x - 2, rel.y - 14, rel.x + 8, rel.y + 10, rel.x + 14, rel.y);
      ctx.bezierCurveTo(rel.x + 6, rel.y + 12, rel.x - 8, rel.y + 8, rel.x - 10, rel.y - 6);
      ctx.stroke();

      if (phase === "idle" || phase === "entry" || phase === "ip3" || !phase) {
        for (let k = 0; k < 3; k++) {
          ctx.beginPath();
          ctx.arc(rel.x - 4 + k * 5, rel.y + (k % 2) * 3, 2.4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(26,106,122,0.85)";
          ctx.fill();
        }
      }

      if (i === 1) {
        ctx.fillStyle = "#1a6a7a";
        ctx.font = "700 11px 'Source Sans 3', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("REL", rel.x + 16, rel.y - 8);
        ctx.font = "600 10px 'Source Sans 3', sans-serif";
        ctx.fillStyle = "#5a6d78";
        ctx.fillText("estoque de Ca²⁺", rel.x + 16, rel.y + 5);
      }

      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = "rgba(13,110,110,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rim.x, rim.y + 6);
      ctx.lineTo(rel.x, rel.y - 4);
      ctx.stroke();
      ctx.setLineDash([]);
    });
  }

  function drawCalciumAnimation(g) {
    const anim = state.caAnim || { playing: false, phase: "idle", t0: 0, done: false };
    if (!anim.playing && anim.phase === "idle") return;

    const now = performance.now();
    let elapsed = anim.playing ? (now - anim.t0) / 1000 : 999;

    let phase = anim.phase;
    if (anim.playing) {
      if (elapsed < 1.6) phase = "entry";
      else if (elapsed < 2.4) phase = "ip3";
      else if (elapsed < 4.2) phase = "release";
      else {
        phase = "done";
        anim.playing = false;
        anim.done = true;
        anim.phase = "done";
        onCaAnimDone();
      }
      anim.phase = phase;
      updateAnimCaption(phase);
    }

    const caves = CAVEOLAE.filter((c) => c[1] < 0);

    if (phase === "entry" || phase === "ip3") {
      const localT = phase === "entry" ? elapsed / 1.6 : 1;
      caves.forEach(([t], i) => {
        const rim = spindlePoint(g, t, -0.98);
        const inn = spindlePoint(g, t, -0.45);
        for (let p = 0; p < 3; p++) {
          const k = Math.min(1, Math.max(0, localT * 1.2 - p * 0.18 - i * 0.05));
          const x = rim.x + (inn.x - rim.x) * k;
          const y = rim.y + (inn.y - rim.y) * k;
          ctx.beginPath();
          ctx.arc(x, y, 3.4, 0, Math.PI * 2);
          ctx.fillStyle = "#3498db";
          ctx.fill();
        }
        if (i === 2) {
          ctx.fillStyle = "#0d6e6e";
          ctx.font = "700 11px 'Source Sans 3', sans-serif";
          ctx.textAlign = "right";
          ctx.fillText("Ca²⁺ entra", rim.x - 10, rim.y - 8);
        }
      });
    }

    if (phase === "ip3" || phase === "release") {
      caves.slice(0, 4).forEach(([t], i) => {
        const rel = spindlePoint(g, t, -0.42);
        const pulse = 0.5 + 0.5 * Math.sin(state.anim * 0.2 + i);
        ctx.beginPath();
        ctx.arc(rel.x + 8, rel.y - 14, 10 + pulse * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196, 92, 58, ${0.2 + pulse * 0.25})`;
        ctx.fill();
        if (i === 1) {
          ctx.fillStyle = "#c45c3a";
          ctx.font = "700 11px 'Source Sans 3', sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("IP₃", rel.x + 8, rel.y - 11);
        }
      });
    }

    if (phase === "release" || phase === "done") {
      const localT = phase === "done" ? 1 : Math.max(0, (elapsed - 2.4) / 1.8);
      caves.forEach(([t], i) => {
        const rel = spindlePoint(g, t, -0.42);
        const cyt = spindlePoint(g, t * 0.5, 0.05);
        for (let p = 0; p < 4; p++) {
          const k = Math.min(1, Math.max(0, localT * 1.15 - p * 0.12 - i * 0.04));
          const x = rel.x + (cyt.x - rel.x) * k + Math.sin(p + state.anim * 0.1) * 3;
          const y = rel.y + (cyt.y - rel.y) * k;
          ctx.beginPath();
          ctx.arc(x, y, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = "#1a6a7a";
          ctx.fill();
        }
        if (i === 2) {
          ctx.fillStyle = "#1a6a7a";
          ctx.font = "700 11px 'Source Sans 3', sans-serif";
          ctx.textAlign = "left";
          ctx.fillText("Ca²⁺ sai do REL", rel.x + 18, rel.y + 16);
        }
      });
    }
  }

  function onCaAnimDone() {
    const s = step();
    if (!s || s.id !== "calcio") return;
    state.showCaOut = true;
    state.showCaRel = true;
    const btn = $("btn-anim");
    if (btn) {
      btn.disabled = false;
      btn.textContent = s.animRepeat || "Repetir animação";
    }
    setFeedback(true, s.feedback);
    $("btn-next").classList.remove("hidden");
    $("btn-next").textContent = "Próxima etapa";
    updateAnimCaption("done");
  }

  function startCaAnim() {
    state.caAnim = {
      playing: true,
      phase: "entry",
      t0: performance.now(),
      done: !!(state.caAnim && state.caAnim.done),
    };
    const btn = $("btn-anim");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Animando…";
    }
    $("btn-next").classList.add("hidden");
    clearFeedback();
    updateAnimCaption("entry");
  }

  const CASCADE_STEPS = [
    { key: "ca", label: "Ca²⁺", sub: "citosol" },
    { key: "cam", label: "CALMODULINA", sub: "sensor" },
    { key: "complex", label: "Ca²⁺–CALMODULINA", sub: "complexo ativo" },
    { key: "mlck", label: "MLCK", sub: "quinase" },
    { key: "phos", label: "fosforila a MIOSINA", sub: "cadeia leve" },
    { key: "active", label: "MIOSINA ATIVA", sub: "lateral-polar" },
    { key: "cross", label: "ACTINA  ↔  MIOSINA", sub: "ciclagem de pontes" },
    { key: "contract", label: "CONTRAÇÃO", sub: "célula encurta" },
  ];

  function startContractionAnim() {
    state.viewMode = "cascade";
    state.shorten = 0;
    state.shortenTarget = 0;
    state.showCaM = false;
    state.showMlck = false;
    state.myosinActive = false;
    state.cascadeAnim = {
      playing: true,
      phase: "run",
      t0: performance.now(),
      done: !!(state.cascadeAnim && state.cascadeAnim.done),
      step: 0,
    };
    const btn = $("btn-anim");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Animando…";
    }
    $("btn-next").classList.add("hidden");
    clearFeedback();
    updateAnimCaption("cascade");
  }

  function updateCascadeAnim() {
    const anim = state.cascadeAnim;
    if (!anim || !anim.playing) return;
    const elapsed = (performance.now() - anim.t0) / 1000;
    const stepDur = 0.85;
    const step = Math.min(CASCADE_STEPS.length - 1, Math.floor(elapsed / stepDur));
    anim.step = step;

    if (step >= 1) state.showCaM = true;
    if (step >= 3) state.showMlck = true;
    if (step >= 5) state.myosinActive = true;

    if (step >= 7) {
      anim.phase = "contract";
      state.viewMode = "cell";
      state.focus = null;
      state.showRelNearCaveolae = false;
      state.showCaOut = true;
      state.showCaRel = true;
      state.showActin = true;
      state.showMyosin = true;
      state.shortenTarget = 0.88;
      // keep playing until contraction settles ~2s after contract start
      const contractStart = 7 * stepDur;
      if (elapsed > contractStart + 2.2) {
        anim.playing = false;
        anim.done = true;
        anim.phase = "done";
        onCascadeAnimDone();
      }
    }

    const captions = [
      "Ca²⁺ no citosol…",
      "Ca²⁺ encontra a calmodulina…",
      "Forma-se Ca²⁺–calmodulina…",
      "O complexo ativa a MLCK…",
      "MLCK fosforila a miosina…",
      "Miosina fica ativa…",
      "Actina ↔ miosina (pontes cruzadas)…",
      "A célula se contrai!",
    ];
    updateAnimCaption("custom", captions[step] || "");
  }

  function updateAnimCaption(phase, custom) {
    const el = $("anim-caption");
    if (!el) return;
    if (phase === "custom") {
      el.textContent = custom;
      return;
    }
    if (phase === "cascade") {
      el.textContent = "Toque para ver a cascata até a contração.";
      return;
    }
    const map = {
      idle: "REL junto das cavéolas armazena Ca²⁺. Toque para animar.",
      entry: "① Ca²⁺ entra pela membrana nas cavéolas…",
      ip3: "② IP₃ estimula o REL próximo…",
      release: "③ REL libera Ca²⁺ para o citosol…",
      done: "Animação concluída. Pode avançar ou repetir.",
    };
    el.textContent = map[phase] || map.idle;
  }

  function onCascadeAnimDone() {
    const s = step();
    if (!s || s.id !== "contracao") return;
    const btn = $("btn-anim");
    if (btn) {
      btn.disabled = false;
      btn.textContent = s.animRepeat || "Repetir cascata";
    }
    setFeedback(true, s.feedback);
    $("btn-next").classList.remove("hidden");
    $("btn-next").textContent = "Concluir";
    updateAnimCaption("custom", "Contração concluída. Pode repetir ou concluir.");
  }

  function drawCascade() {
    const cx = state.W * 0.5;
    const anim = state.cascadeAnim || { step: -1 };
    const active = anim.step|0;

    ctx.fillStyle = "#f4f8fa";
    ctx.fillRect(0, 0, state.W, state.H);

    ctx.fillStyle = "#1c2a33";
    ctx.font = "700 16px Literata, Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("Via de contração do músculo liso", cx, 36);

    const startY = 58;
    const gap = Math.min(52, (state.H - 90) / CASCADE_STEPS.length);

    CASCADE_STEPS.forEach((item, i) => {
      const y = startY + i * gap;
      const on = i <= active;
      const current = i === active;

      // seta
      if (i > 0) {
        ctx.strokeStyle = i <= active ? "#0d6e6e" : "#c5d3dc";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, y - gap + 18);
        ctx.lineTo(cx, y - 14);
        ctx.stroke();
        // ponta
        if (on) {
          ctx.beginPath();
          ctx.moveTo(cx, y - 12);
          ctx.lineTo(cx - 5, y - 20);
          ctx.lineTo(cx + 5, y - 20);
          ctx.closePath();
          ctx.fillStyle = "#0d6e6e";
          ctx.fill();
        }
      }

      const w = Math.min(280, state.W * 0.7);
      const h = 34;
      const x = cx - w / 2;
      ctx.beginPath();
      roundRect(x, y - h / 2, w, h, 10);
      if (current) {
        ctx.fillStyle = "#0d6e6e";
        ctx.fill();
        ctx.fillStyle = "#f4fffe";
      } else if (on) {
        ctx.fillStyle = "#e6f5ec";
        ctx.fill();
        ctx.strokeStyle = "#8fc5a5";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = "#1f7a4d";
      } else {
        ctx.fillStyle = "#eef3f6";
        ctx.fill();
        ctx.strokeStyle = "#c5d3dc";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "#8a9aa5";
      }
      ctx.font = "700 13px 'Source Sans 3', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(item.label, cx, y + 1);
      ctx.font = "600 10px 'Source Sans 3', sans-serif";
      ctx.globalAlpha = current ? 0.85 : 0.7;
      ctx.fillText(item.sub, cx, y + 14);
      ctx.globalAlpha = 1;

      // Ca²⁺ visual no topo
      if (i === 0 && on) {
        for (let k = 0; k < 5; k++) {
          ctx.beginPath();
          ctx.arc(cx - 40 + k * 20, y - 28, 4, 0, Math.PI * 2);
          ctx.fillStyle = "#3498db";
          ctx.fill();
        }
      }
    });
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
    $("anim-wrap").classList.add("hidden");
    $("btn-next").classList.add("hidden");
    clearFeedback();
    hideArrow();
    if (s.onEnter) s.onEnter();

    $("answer").value = "";
    if (s.type === "text") {
      $("answer-label").textContent = "Digite aqui";
      setTimeout(() => $("answer").focus(), 50);
    }

    if (s.type === "quiz") {
      $("slots").innerHTML = "";
      $("tray").innerHTML = "";
      $("pools").innerHTML = "";
      renderQuiz(s);
    } else if (s.type === "anim") {
      $("slots").innerHTML = "";
      $("tray").innerHTML = "";
      $("pools").innerHTML = "";
      $("anim-wrap").classList.remove("hidden");
      const btn = $("btn-anim");
      const done = s.animId === "ca" ? state.caAnim.done : state.cascadeAnim.done;
      btn.disabled = false;
      btn.textContent = done ? (s.animRepeat || "Repetir") : (s.animLabel || "Animar");
      if (s.animId === "ca") updateAnimCaption(done ? "done" : "idle");
      else updateAnimCaption(done ? "custom" : "cascade", done ? "Contração concluída. Pode repetir ou concluir." : "");
      if (done) {
        setFeedback(true, s.feedback);
        $("btn-next").classList.remove("hidden");
        $("btn-next").textContent = s.final ? "Concluir" : "Próxima etapa";
      }
    } else if (s.type === "place" || s.type === "place+quiz") {
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
      const order = ["calmodulina", "mlck"];
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
      focus: null,
      focusHighlight: null,
      viewMode: "cell",
      thinParts: { actin: false, tropo: false, cald: false, calp: false },
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
      showRelNearCaveolae: false,
      caAnim: { playing: false, phase: "idle", t0: 0, done: false },
      cascadeAnim: { playing: false, phase: "idle", t0: 0, done: false, step: 0 },
      shorten: 0,
      shortenTarget: 0,
      myosinActive: false,
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
  $("btn-anim").onclick = () => {
    const s = step();
    if (s.animId === "contracao") startContractionAnim();
    else startCaAnim();
  };
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
