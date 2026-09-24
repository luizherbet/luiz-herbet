(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const canvas = $("cell");
  const ctx = canvas.getContext("2d");

  const state = {
    mode: null,
    index: 0,
    shorten: 0,
    anim: 0,
    W: 960,
    H: 560,
  };

  // ── Conteúdo didático (8 etapas, texto curto) ──────────────
  const SMOOTH = {
    eyebrow: "Músculo liso",
    title: "Célula fusiforme",
    steps: [
      {
        phase: "Forma",
        title: "Célula em fuso",
        body: "Vísceras, vasos, eretor do pelo. Célula alongada com pontas afiladas; um núcleo no centro. Sem estriações.",
        keys: ["Formato fusiforme", "Núcleo central único", "Sem bandas A/I"],
        observe: "Contorno afilado + núcleo no meio.",
        contrast: "Esquelético: cilindro, muitos núcleos na borda.",
        source: "Ross & Pawlina (2016), músculo liso.",
        targetShorten: 0,
        highlight: "form",
      },
      {
        phase: "Filamentos",
        title: "Âncoras: corpos e placas densas",
        body: "Actina prende-se a corpos densos (citoplasma) e placas densas (membrana). Contêm α-actinina — análogos dispersos da linha Z.",
        keys: ["Corpos densos no interior", "Placas densas no sarcolema", "α-actinina"],
        observe: "Pontos marrons: interior = corpo; borda = placa.",
        contrast: "Esquelético: α-actinina na linha Z, em registro.",
        source: "Ross & Pawlina; Bond & Somlyo (1982).",
        targetShorten: 0,
        highlight: "dense",
        showNet: true,
      },
      {
        phase: "Filamentos",
        title: "Malha oblíqua + miosina dobrada",
        body: "Actina sai dos densos; desmina liga a rede. Miosina inativa está DOBRADA (forma 10S) — curva, não filamento longo.",
        keys: ["Sem sarcômero", "Miosina 10S dobrada", "Rede oblíqua"],
        observe: "Laços azuis = miosina dobrada. Tracejado = desmina.",
        contrast: "Esquelético: miosina bipolar já em filamento com zona desnuda.",
        source: "Ross & Pawlina — miosina inativa dobrada.",
        targetShorten: 0,
        highlight: "myosinFold",
        showNet: true,
        showFolded: true,
      },
      {
        phase: "Estímulo",
        title: "Nervo en passant",
        body: "Não há placa motora. O nervo libera transmissor a distância (botão en passant). O alvo é elevar o Ca²⁺.",
        keys: ["Autônomo", "Difusão 10–20 μm+", "Sem placa motora"],
        observe: "Nervo à esquerda liberando sinal.",
        contrast: "Esquelético: placa motora colada à fibra.",
        source: "Ross & Pawlina — inervação do liso.",
        targetShorten: 0,
        highlight: "nerve",
        showNet: true,
        showFolded: true,
      },
      {
        phase: "Cálcio",
        title: "De onde vem o Ca²⁺",
        body: "Sem túbulo T. ① Ca²⁺ entra pela membrana nas cavéolas. ② Isso é pouco: o REL perto das cavéolas libera mais Ca²⁺ (IP₃ / canais do REL).",
        keys: ["Entrada nas cavéolas", "Liberação do REL", "Microdomínio membrana–REL"],
        observe: "Setas: fora→cavéola e REL→citosol. Não é Ca²⁺ ‘solto’ ao acaso.",
        contrast: "Esquelético: Ca²⁺ sai das cisternas da tríade (RS).",
        source: "Ross & Pawlina — cavéolas + REL; sem sistema T.",
        targetShorten: 0.03,
        highlight: "calcium",
        showNet: true,
        showFolded: true,
        caMode: "sources",
      },
      {
        phase: "Cálcio",
        title: "Ca²⁺ ativa a calmodulina",
        body: "Sem troponina. O Ca²⁺ liga-se à calmodulina (CaM). Só o complexo Ca²⁺–CaM ativa a MLCK.",
        keys: ["Sensor = CaM", "Sem troponina", "Próximo passo: MLCK"],
        observe: "Ca²⁺ converge para o círculo CaM (verde).",
        contrast: "Esquelético: Ca²⁺ liga-se à troponina C no filamento fino.",
        source: "Ross & Pawlina — Ca²⁺–calmodulina.",
        targetShorten: 0.05,
        highlight: "calm",
        showNet: true,
        showFolded: true,
        caMode: "toCaM",
      },
      {
        phase: "Contração",
        title: "MLCK monta miosina lateral-polar",
        body: "MLCK fosforila a miosina: 10S dobrada → 6S estendida → filamento lateral-polar (cabeças opostas nos dois lados; sem zona desnuda central).",
        keys: ["Fosforilação da cadeia leve", "Filamento lateral-polar", "Sem zona H central"],
        observe: "Laços viram hastes com cabeças dos dois lados.",
        contrast: "Esquelético: filamento bipolar com zona desnuda no meio.",
        source: "Ross & Pawlina — SMM lateral-polar.",
        targetShorten: 0.2,
        highlight: "mlck",
        showNet: true,
        myosinActive: true,
      },
      {
        phase: "Contração",
        title: "Célula encurta (± latch)",
        body: "A malha puxa placas densas: a célula encurta e engrossa. No latch, miosina pode ficar ligada com pouco ATP. Núcleo vira saca-rolhas.",
        keys: ["Força → sarcolema", "Latch = tom econômico", "Núcleo pregueado"],
        observe: "Fuso curto/grosso e núcleo tortuoso.",
        contrast: "Esquelético: sarcômeros encurtam; banda A não muda de comprimento.",
        source: "Ross & Pawlina — latch e núcleo em saca-rolhas.",
        targetShorten: 0.88,
        highlight: "contract",
        showNet: true,
        myosinActive: true,
        latch: true,
      },
    ],
  };

  const STRIATED = {
    eyebrow: "Estriado esquelético",
    title: "Fibra com sarcômeros",
    steps: [
      {
        phase: "Forma",
        title: "Fibra cilíndrica",
        body: "Move o esqueleto. Sincício multinucleado: núcleos sob o sarcolema (periferia). Estriações transversais.",
        keys: ["Cilindro longo", "Núcleos periféricos", "Estriações"],
        observe: "Núcleos roxos só nas bordas da fibra.",
        contrast: "Liso: fuso com 1 núcleo central.",
        source: "Ross & Pawlina — fibra esquelética.",
        targetShorten: 0,
        highlight: "form",
      },
      {
        phase: "Filamentos",
        title: "Sarcômero: Z · I · A · H · M",
        body: "Unidade Z→Z. I = só actina; A = miosina (± actina); H = só miosina no centro; M no meio.",
        keys: ["Z ancora actina", "A = filamento espesso", "Registro → estrias"],
        observe: "Leia os rótulos Z, I, A, H, M no sarcômero central.",
        contrast: "Liso: sem Z–I–A; só corpos/placas densos.",
        source: "Ross & Pawlina — organização do sarcômero.",
        targetShorten: 0,
        highlight: "sarcomere",
        showLabels: true,
      },
      {
        phase: "Filamentos",
        title: "Miosina bipolar",
        body: "Filamento espesso bipolar: cabeças apontam para as duas Z; zona desnuda no centro (= parte da H).",
        keys: ["Bipolar", "Zona desnuda central", "≠ lateral-polar do liso"],
        observe: "Hastes azuis com centro sem cabeças.",
        contrast: "Liso: lateral-polar, sem zona desnuda central.",
        source: "Ross & Pawlina — filamento espesso esquelético.",
        targetShorten: 0,
        highlight: "bipolar",
        showLabels: true,
      },
      {
        phase: "Estímulo",
        title: "Placa motora",
        body: "Axônio forma junção neuromuscular sobre a fibra. ACh na fenda despolariza o sarcolema.",
        keys: ["Placa motora", "ACh", "Potencial no sarcolema"],
        observe: "Estrutura roxa no topo = placa motora.",
        contrast: "Liso: botão en passant a distância.",
        source: "Ross & Pawlina — junção neuromuscular.",
        targetShorten: 0,
        highlight: "nmj",
      },
      {
        phase: "Cálcio",
        title: "Tríade na junção A–I",
        body: "Túbulo T (invaginação do sarcolema) + 2 cisternas do RS = tríade. Em mamíferos fica na junção A–I.",
        keys: ["Túbulo T no meio", "2 cisternas laterais", "Local: junção A–I"],
        observe: "Tríade ampliada: cisterna | T | cisterna.",
        contrast: "Liso: cavéolas na superfície, sem tríade.",
        source: "Ross & Pawlina — tríades do esquelético.",
        targetShorten: 0,
        highlight: "triad",
        showTriad: true,
      },
      {
        phase: "Cálcio",
        title: "Ca²⁺ sai do RS",
        body: "Potencial no túbulo T abre canais do RS (DHPR↔RyR). O Ca²⁺ sai das cisternas para o espaço entre os miofilamentos — não ‘aparece’ solto na fibra.",
        keys: ["Fonte = RS", "Saída pelas cisternas", "Depois SERCA recaptura"],
        observe: "Setas azuis saindo só das cisternas da tríade.",
        contrast: "Liso: entrada na cavéola + liberação do REL/IP₃.",
        source: "Ross & Pawlina — acoplamento excitação–contração.",
        targetShorten: 0.05,
        highlight: "calcium",
        showTriad: true,
        caMode: "triad",
      },
      {
        phase: "Contração",
        title: "Troponina no filamento fino",
        body: "Ca²⁺ liga-se à troponina C. Tropomiosina libera o sítio da miosina na actina. Controle no filamento FINO.",
        keys: ["Troponina C", "Tropomiosina", "Sem MLCK como gatilho"],
        observe: "Marcas amarelas na actina = troponina.",
        contrast: "Liso: CaM → MLCK no filamento espesso.",
        source: "Ross & Pawlina — troponina–tropomiosina.",
        targetShorten: 0.12,
        highlight: "troponin",
        troponinOn: true,
      },
      {
        phase: "Contração",
        title: "Deslizamento do sarcômero",
        body: "Actina desliza sobre miosina. Z se aproximam. Banda I e zona H diminuem; banda A mantém o comprimento.",
        keys: ["A constante", "I e H ↓", "Filamentos não encolhem"],
        observe: "Z–Z menor; H quase some; A igual.",
        contrast: "Liso: malha puxa a célula inteira (sem bandas A/I).",
        source: "Ross & Pawlina — modelo de deslizamento.",
        targetShorten: 0.7,
        highlight: "slide",
        showLabels: true,
        troponinOn: true,
        bridges: true,
      },
    ],
  };

  const DENSE_CYTO = [
    { x: -0.5, y: -0.28 }, { x: -0.22, y: 0.38 }, { x: 0.05, y: -0.42 },
    { x: 0.28, y: 0.32 }, { x: 0.5, y: -0.22 }, { x: 0.08, y: 0.05 }, { x: -0.32, y: 0.02 },
  ];
  const DENSE_PLAQUES = [
    { a: -2.6 }, { a: -1.9 }, { a: -1.1 }, { a: -0.35 },
    { a: 0.45 }, { a: 1.2 }, { a: 2.0 }, { a: 2.7 },
  ];
  const UNITS = [
    [0, 1], [1, 3], [0, 2], [2, 5], [5, 3], [3, 4], [6, 5], [6, 1],
  ];
  const DESMIN = [[0, 2], [2, 5], [5, 4], [0, 6], [6, 3], [1, 3]];

  function mod() {
    return state.mode === "striated" ? STRIATED : SMOOTH;
  }
  function step() {
    return mod().steps[state.index];
  }

  function resize() {
    const vp = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.W = Math.max(480, Math.floor(vp.width));
    state.H = Math.max(320, Math.floor(vp.height));
    canvas.width = Math.floor(state.W * dpr);
    canvas.height = Math.floor(state.H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function geom() {
    const s = state.shorten;
    return {
      cx: state.W * 0.5,
      cy: state.H * 0.48,
      rx: state.W * 0.38 - s * state.W * 0.1,
      ry: state.H * 0.28 + s * state.H * 0.1,
      s,
    };
  }

  function cyto(i, g) {
    const d = DENSE_CYTO[i];
    const pull = g.s * 0.2;
    return {
      x: g.cx + (d.x * (1 - pull) + g.s * 0.1 * d.y) * g.rx * 0.82,
      y: g.cy + d.y * (1 - pull * 0.3) * g.ry * 0.75,
    };
  }
  function plaque(i, g) {
    const a = DENSE_PLAQUES[i].a;
    return { x: g.cx + Math.cos(a) * g.rx * 0.98, y: g.cy + Math.sin(a) * g.ry * 0.98 };
  }

  function ease(a, b, r) {
    return a + (b - a) * r;
  }

  function ellipseFill(cx, cy, rx, ry, c0, c1) {
    const grd = ctx.createRadialGradient(cx - rx * 0.2, cy - ry * 0.2, 4, cx, cy, rx);
    grd.addColorStop(0, c0);
    grd.addColorStop(1, c1);
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
  }

  function arrow(x1, y1, x2, y2, color) {
    const ang = Math.atan2(y2 - y1, x2 - x1);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 9 * Math.cos(ang - 0.4), y2 - 9 * Math.sin(ang - 0.4));
    ctx.lineTo(x2 - 9 * Math.cos(ang + 0.4), y2 - 9 * Math.sin(ang + 0.4));
    ctx.closePath();
    ctx.fill();
  }

  function label(text, x, y, color = "#1c2a33") {
    ctx.fillStyle = color;
    ctx.font = "600 13px 'Source Sans 3', sans-serif";
    ctx.fillText(text, x, y);
  }

  function drawFolded(x, y, ang, lit) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    ctx.strokeStyle = lit ? "#2f4f8f" : "rgba(47,79,143,0.7)";
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-2, 0);
    ctx.bezierCurveTo(-12, -14, 10, -16, 8, -2);
    ctx.bezierCurveTo(7, 8, -10, 10, -2, 1);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-1, -1, 3.4, 0, Math.PI * 2);
    ctx.arc(3.5, 2.5, 3.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawSidePolar(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const px = -uy;
    const py = ux;
    ctx.strokeStyle = "#2f4f8f";
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    const n = Math.max(3, Math.floor(len / 12));
    for (let i = 1; i < n; i++) {
      const t = i / n;
      const hx = x1 + dx * t;
      const hy = y1 + dy * t;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(hx + px * 2, hy + py * 2);
      ctx.lineTo(hx + px * 7 + ux * 4, hy + py * 7 + uy * 4);
      ctx.moveTo(hx - px * 2, hy - py * 2);
      ctx.lineTo(hx - px * 7 - ux * 4, hy - py * 7 - uy * 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(hx + px * 7 + ux * 4, hy + py * 7 + uy * 4, 2, 0, Math.PI * 2);
      ctx.arc(hx - px * 7 - ux * 4, hy - py * 7 - uy * 4, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#3d5a9a";
      ctx.fill();
    }
  }

  // ── Ca²⁺ didático (liso) ───────────────────────────────────
  function drawSmoothCalcium(g, st) {
    // Cavéola + REL em microdomínio (conforme livro: cavéolas junto a perfis de REL)
    const cave = {
      x: g.cx - g.rx * 0.72,
      y: g.cy - g.ry * 0.55,
    };
    const rel = {
      x: cave.x + 48,
      y: cave.y + 28,
    };

    // extracelular
    ctx.fillStyle = "rgba(42,155,181,0.2)";
    ctx.beginPath();
    ctx.arc(cave.x - 28, cave.y - 8, 16, 0, Math.PI * 2);
    ctx.fill();
    label("Ca²⁺ extracelular", cave.x - 70, cave.y - 28, "#1a6a7a");

    // cavéola (invaginação)
    ctx.fillStyle = "#2a9bb5";
    ctx.beginPath();
    ctx.arc(cave.x, cave.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
    label("cavéola", cave.x - 18, cave.y - 16);

    // REL próximo
    ctx.fillStyle = "#d4895a";
    ctx.beginPath();
    ctx.ellipse(rel.x, rel.y, 22, 12, 0.3, 0, Math.PI * 2);
    ctx.fill();
    label("REL", rel.x - 10, rel.y - 18);

    if (st.caMode === "sources" || st.caMode === "toCaM") {
      // 1) entrada pela cavéola
      arrow(cave.x - 24, cave.y - 6, cave.x - 2, cave.y + 2, "#2a9bb5");
      label("① entra", cave.x - 55, cave.y + 22, "#2a9bb5");

      // 2) liberação do REL (principal para contração plena)
      arrow(rel.x - 8, rel.y + 4, rel.x + 30, rel.y + 26, "#c45c3a");
      label("② libera (IP₃)", rel.x + 20, rel.y + 42, "#a04828");

      // íons saindo localmente (não aleatórios pela célula)
      const t = state.anim * 0.08;
      for (let i = 0; i < 5; i++) {
        const p = (t + i * 0.18) % 1;
        ctx.beginPath();
        ctx.arc(cave.x - 20 + p * 22, cave.y - 4 + p * 8, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#2a9bb5";
        ctx.fill();
      }
      for (let i = 0; i < 6; i++) {
        const p = (t * 0.9 + i * 0.15) % 1;
        ctx.beginPath();
        ctx.arc(rel.x - 4 + p * 36, rel.y + 6 + p * 28, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = "#2a9bb5";
        ctx.fill();
      }
    }

    if (st.caMode === "toCaM") {
      const cam = { x: g.cx - g.rx * 0.15, y: g.cy + g.ry * 0.2 };
      ctx.beginPath();
      ctx.arc(cam.x, cam.y, 18, 0, Math.PI * 2);
      ctx.fillStyle = "#3d9b6a";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
      label("CaM", cam.x - 12, cam.y - 26);
      arrow(rel.x + 20, rel.y + 30, cam.x - 16, cam.y - 8, "#2a9bb5");
      label("③ liga à CaM", cam.x + 20, cam.y + 6, "#1a6a7a");
      // Ca ao redor de CaM
      for (let i = 0; i < 4; i++) {
        const a = state.anim * 0.05 + i * Math.PI / 2;
        ctx.beginPath();
        ctx.arc(cam.x + Math.cos(a) * 26, cam.y + Math.sin(a) * 26, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#2a9bb5";
        ctx.fill();
      }
    }

    // nota didática
    ctx.fillStyle = "rgba(28,42,51,0.85)";
    roundRect(16, state.H - 52, Math.min(420, state.W * 0.55), 36, 8);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "600 12px 'Source Sans 3', sans-serif";
    ctx.fillText("Ca²⁺ sobe no MICRODOMÍNIO cavéola↔REL — não ‘chove’ na célula toda.", 28, state.H - 28);
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

  // ── Draw SMOOTH ────────────────────────────────────────────
  function drawSmooth() {
    const g = geom();
    const st = step();
    ctx.clearRect(0, 0, state.W, state.H);
    ctx.fillStyle = "#e8eef2";
    ctx.fillRect(0, 0, state.W, state.H);

    // feixe vizinho
    ctx.globalAlpha = 0.2;
    ellipseFill(g.cx, g.cy - g.ry - 36, g.rx * 0.7, 22, "#e8a8b6", "#b86880");
    ellipseFill(g.cx, g.cy + g.ry + 36, g.rx * 0.7, 22, "#e8a8b6", "#b86880");
    ctx.globalAlpha = 1;

    ellipseFill(g.cx, g.cy, g.rx, g.ry, "#f2b4c2", "#a84868");
    ctx.strokeStyle = "rgba(100,35,55,0.5)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(g.cx, g.cy, g.rx, g.ry, 0, 0, Math.PI * 2);
    ctx.stroke();

    // pontas
    ctx.fillStyle = "#c05878";
    [[-1, -22], [1, 22]].forEach(([sg, tip]) => {
      ctx.beginPath();
      ctx.moveTo(g.cx + sg * (g.rx + tip), g.cy);
      ctx.quadraticCurveTo(g.cx + sg * g.rx, g.cy - 16, g.cx + sg * (g.rx - 10), g.cy);
      ctx.quadraticCurveTo(g.cx + sg * g.rx, g.cy + 16, g.cx + sg * (g.rx + tip), g.cy);
      ctx.fill();
    });

    if (st.showNet || st.highlight === "dense" || st.highlight === "myosinFold" || st.myosinActive) {
      // desmina
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = "rgba(90,100,55,0.65)";
      ctx.lineWidth = 1.6;
      DESMIN.forEach(([a, b]) => {
        const p1 = cyto(a, g);
        const p2 = cyto(b, g);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      UNITS.forEach(([a, b], idx) => {
        const p1 = cyto(a, g);
        const p2 = cyto(b, g);
        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2;
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        ctx.strokeStyle = "#c45a7a";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(mx - dx * 0.12, my - dy * 0.12);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(mx + dx * 0.12, my + dy * 0.12);
        ctx.stroke();
        if (st.myosinActive) {
          drawSidePolar(mx - dx * 0.18, my - dy * 0.18, mx + dx * 0.18, my + dy * 0.18);
        } else if (st.showFolded) {
          drawFolded(mx, my, Math.atan2(dy, dx) + 0.4, st.highlight === "myosinFold");
        }
      });

      // densos
      const lit = st.highlight === "dense";
      DENSE_CYTO.forEach((_, i) => {
        const p = cyto(i, g);
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, lit ? 7 : 5, lit ? 5.5 : 4, 0.4, 0, Math.PI * 2);
        ctx.fillStyle = "#6b3a18";
        ctx.fill();
        if (lit) {
          ctx.strokeStyle = "#ffd7a8";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
      DENSE_PLAQUES.forEach((_, i) => {
        const p = plaque(i, g);
        ctx.beginPath();
        ctx.arc(p.x, p.y, lit ? 6 : 4.2, 0, Math.PI * 2);
        ctx.fillStyle = "#8b4518";
        ctx.fill();
        if (lit) {
          ctx.strokeStyle = "#ffd7a8";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
      if (lit) {
        label("corpo denso", cyto(5, g).x + 10, cyto(5, g).y - 8);
        label("placa densa", plaque(2, g).x - 36, plaque(2, g).y - 14);
      }
    }

    // núcleo
    ctx.save();
    ctx.translate(g.cx, g.cy);
    if (g.s > 0.4) {
      ctx.rotate(g.s * 0.4);
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.ellipse(Math.sin(i * 1.1) * 8 * g.s, -20 + i * 10, 16, 5.5, 0.5, 0, Math.PI * 2);
        ctx.fillStyle = "#5c3d6e";
        ctx.fill();
      }
    } else {
      ctx.beginPath();
      ctx.ellipse(0, 0, Math.min(42, g.rx * 0.18), Math.min(20, g.ry * 0.35), 0, 0, Math.PI * 2);
      ctx.fillStyle = "#5c3d6e";
      ctx.fill();
    }
    ctx.restore();
    label("núcleo central", g.cx - 40, g.cy + (g.s > 0.4 ? 48 : 36));

    // nervo
    if (st.highlight === "nerve" || st.highlight === "form") {
      const nx = g.cx - g.rx - 36;
      const ny = g.cy;
      ctx.fillStyle = st.highlight === "nerve" ? "#6b4c9a" : "rgba(107,76,154,0.45)";
      ctx.beginPath();
      ctx.ellipse(nx, ny, 16, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      label("nervo en passant", nx - 40, ny - 20);
      if (st.highlight === "nerve") {
        const pulse = 0.4 + Math.sin(state.anim * 0.1) * 0.35;
        ctx.strokeStyle = `rgba(107,76,154,${pulse})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(nx + 20, ny, 14 + pulse * 10, -0.7, 0.7);
        ctx.stroke();
      }
    }

    // MLCK highlight
    if (st.highlight === "mlck" || st.highlight === "calm") {
      const mlck = { x: g.cx + g.rx * 0.25, y: g.cy + g.ry * 0.15 };
      if (st.highlight === "mlck") {
        ctx.beginPath();
        ctx.arc(mlck.x, mlck.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = "#c9a227";
        ctx.fill();
        label("MLCK", mlck.x - 16, mlck.y - 24);
      }
    }

    if (st.caMode) drawSmoothCalcium(g, st);

    // caption
    ctx.fillStyle = "#5a6d78";
    ctx.font = "600 14px 'Source Sans 3', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      g.s > 0.4 ? "Célula fusiforme contraída" : "Célula muscular lisa fusiforme",
      g.cx,
      state.H - 14
    );
    ctx.textAlign = "left";
  }

  // ── Ca²⁺ didático (estriado) ───────────────────────────────
  function drawTriadCa(fiberX, myoY, myoH, showCa) {
    const tx = fiberX + 150;
    const ty = myoY + myoH + 18;
    // cisternas
    ctx.fillStyle = "#d4895a";
    ctx.fillRect(tx, ty, 20, 26);
    ctx.fillRect(tx + 38, ty, 20, 26);
    // túbulo T
    ctx.fillStyle = "#2a9bb5";
    ctx.fillRect(tx + 22, ty - 4, 14, 34);
    label("cisterna RS", tx - 8, ty - 10);
    label("túbulo T", tx + 18, ty + 48);
    label("cisterna RS", tx + 40, ty - 10);
    label("TRÍADE (junção A–I)", tx - 4, ty + 64, "#1a6a7a");

    if (showCa) {
      // Ca sai DAS CISTERNAS para cima (em direção aos filamentos)
      arrow(tx + 10, ty, tx + 10, myoY + myoH - 4, "#2a9bb5");
      arrow(tx + 48, ty, tx + 48, myoY + myoH - 4, "#2a9bb5");
      label("Ca²⁺ do RS", tx + 70, ty + 10, "#1a6a7a");
      const t = state.anim * 0.1;
      for (let i = 0; i < 6; i++) {
        const p = (t + i * 0.16) % 1;
        ctx.beginPath();
        ctx.arc(tx + 10, ty - p * 36, 3.2, 0, Math.PI * 2);
        ctx.arc(tx + 48, ty - p * 36, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = "#2a9bb5";
        ctx.fill();
      }
      ctx.fillStyle = "rgba(28,42,51,0.85)";
      roundRect(tx + 100, ty, 260, 34, 8);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "600 12px 'Source Sans 3', sans-serif";
      ctx.fillText("Ca²⁺ sai das cisternas do RS — não do meio da fibra.", tx + 112, ty + 22);
    }
  }

  function sarcMetrics(s) {
    return {
      full: 200 - s * 65,
      halfI: 46 - s * 26,
      aBand: 108,
      hZone: Math.max(3, 34 - s * 30),
    };
  }

  function drawSarcomere(x, y, m, st) {
    const h = Math.min(90, state.H * 0.2);
    const { full, halfI, aBand, hZone } = m;
    const z1 = x;
    const aStart = x + halfI;
    const aEnd = aStart + aBand;
    const z2 = x + full;
    const mid = (aStart + aEnd) / 2;

    ctx.fillStyle = "rgba(255,242,246,0.9)";
    ctx.fillRect(z1, y, halfI, h);
    ctx.fillRect(aEnd, y, z2 - aEnd, h);
    ctx.fillStyle = "rgba(150,60,90,0.5)";
    ctx.fillRect(aStart, y, aBand, h);
    ctx.fillStyle = "rgba(245,210,220,0.75)";
    ctx.fillRect(mid - hZone / 2, y, hZone, h);
    ctx.fillStyle = "#503040";
    ctx.fillRect(mid - 1.5, y + 10, 3, h - 20);
    ctx.fillStyle = st.highlight === "sarcomere" || st.highlight === "slide" ? "#1c2a33" : "#402030";
    ctx.fillRect(z1 - 2, y - 3, 4, h + 6);
    ctx.fillRect(z2 - 2, y - 3, 4, h + 6);

    // actina
    ctx.strokeStyle = st.troponinOn || st.highlight === "troponin" ? "#c9a227" : "#c45a7a";
    ctx.lineWidth = st.highlight === "troponin" ? 2.6 : 1.8;
    for (let r = 0; r < 5; r++) {
      const yy = y + 14 + r * (h / 6);
      ctx.beginPath();
      ctx.moveTo(z1 + 3, yy);
      ctx.lineTo(mid - hZone / 2 - 2, yy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(z2 - 3, yy);
      ctx.lineTo(mid + hZone / 2 + 2, yy);
      ctx.stroke();
      if (st.troponinOn || st.highlight === "troponin") {
        for (let k = 0; k < 3; k++) {
          ctx.fillStyle = "#c9a227";
          ctx.beginPath();
          ctx.arc(z1 + 18 + k * 18, yy, 2.5, 0, Math.PI * 2);
          ctx.arc(z2 - 18 - k * 18, yy, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // miosina bipolar
    for (let r = 0; r < 4; r++) {
      const yy = y + 20 + r * (h / 5.5);
      ctx.strokeStyle = "#3d5a9a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(aStart + 6, yy);
      ctx.lineTo(mid - hZone / 2, yy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mid + hZone / 2, yy);
      ctx.lineTo(aEnd - 6, yy);
      ctx.stroke();
      ctx.strokeStyle = "rgba(61,90,154,0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(mid - hZone / 2, yy);
      ctx.lineTo(mid + hZone / 2, yy);
      ctx.stroke();
      if (st.bridges || st.highlight === "bipolar" || st.highlight === "slide") {
        ctx.strokeStyle = "#1e3a6e";
        ctx.lineWidth = 1.3;
        for (let k = 0; k < 4; k++) {
          const hx1 = aStart + 12 + k * 14;
          if (hx1 < mid - hZone / 2 - 4) {
            ctx.beginPath();
            ctx.moveTo(hx1, yy);
            ctx.lineTo(hx1 - 4, yy - 6);
            ctx.stroke();
          }
          const hx2 = mid + hZone / 2 + 12 + k * 14;
          if (hx2 < aEnd - 6) {
            ctx.beginPath();
            ctx.moveTo(hx2, yy);
            ctx.lineTo(hx2 + 4, yy - 6);
            ctx.stroke();
          }
        }
      }
    }

    if (st.showLabels || st.highlight === "sarcomere" || st.highlight === "slide") {
      ctx.fillStyle = "#1c2a33";
      ctx.font = "700 12px 'Source Sans 3', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Z", z1, y - 8);
      ctx.fillText("Z", z2, y - 8);
      ctx.fillText("I", z1 + halfI / 2, y + h + 14);
      ctx.fillText("A", mid, y + h + 14);
      ctx.fillText("H", mid, y + h + 28);
      ctx.fillText("M", mid, y - 8);
      ctx.textAlign = "left";
    }
  }

  function drawStriated() {
    const st = step();
    const s = state.shorten;
    ctx.clearRect(0, 0, state.W, state.H);
    ctx.fillStyle = "#e8eef2";
    ctx.fillRect(0, 0, state.W, state.H);

    const fiberX = state.W * 0.06;
    const fiberW = state.W * 0.88;
    const fiberY = state.H * 0.18;
    const fiberH = state.H * 0.42;

    const grd = ctx.createLinearGradient(0, fiberY, 0, fiberY + fiberH);
    grd.addColorStop(0, "#f0c8d0");
    grd.addColorStop(0.5, "#d87890");
    grd.addColorStop(1, "#b05070");
    roundRect(fiberX, fiberY, fiberW, fiberH, 20);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.strokeStyle = "rgba(90,30,50,0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // núcleos periféricos
    [[0.08, 0.1], [0.22, 0.88], [0.7, 0.12], [0.85, 0.86]].forEach(([fx, fy]) => {
      ctx.beginPath();
      ctx.ellipse(fiberX + fiberW * fx, fiberY + fiberH * fy, 18, 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = st.highlight === "form" ? "#7a4d8c" : "#5c3d6e";
      ctx.fill();
    });
    label("núcleos periféricos", fiberX + 8, fiberY - 12);

    const m = sarcMetrics(s);
    const myoY = fiberY + fiberH * 0.22;
    let x = fiberX + 24;
    const end = fiberX + fiberW - 24;
    let n = 0;
    while (x + m.full < end && n < 6) {
      drawSarcomere(x, myoY, m, st);
      x += m.full;
      n++;
    }

    // placa motora
    const px = fiberX + fiberW * 0.58;
    const py = fiberY - 4;
    ctx.fillStyle = st.highlight === "nmj" ? "#6b4c9a" : "rgba(107,76,154,0.5)";
    ctx.beginPath();
    ctx.ellipse(px, py, st.highlight === "nmj" ? 36 : 26, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#4a3070";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(px, py - 36);
    ctx.lineTo(px, py - 12);
    ctx.stroke();
    label("placa motora", px - 36, py - 44);
    if (st.highlight === "nmj") {
      const pulse = 0.4 + Math.sin(state.anim * 0.1) * 0.35;
      ctx.strokeStyle = `rgba(107,76,154,${pulse})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(px, py + 10, 16 + pulse * 8, 0.15, Math.PI - 0.15);
      ctx.stroke();
    }

    if (st.showTriad || st.caMode === "triad" || st.highlight === "triad" || st.highlight === "calcium") {
      drawTriadCa(fiberX, myoY, Math.min(90, state.H * 0.2), st.caMode === "triad" || st.highlight === "calcium");
    }

    if (st.highlight === "troponin") {
      label("● troponina C no filamento fino (amarelo)", fiberX + fiberW * 0.35, fiberY + fiberH + 24, "#8a6a10");
    }

    ctx.fillStyle = "#5a6d78";
    ctx.font = "600 14px 'Source Sans 3', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      s > 0.35 ? "Sarcômeros encurtados (banda A constante)" : "Fibra esquelética — sarcômeros em registro",
      state.W / 2,
      state.H - 12
    );
    ctx.textAlign = "left";
  }

  // ── UI ─────────────────────────────────────────────────────
  function renderLesson() {
    const m = mod();
    const st = step();
    const total = m.steps.length;
    $("phase-tag").textContent = st.phase;
    $("step-count").textContent = `${state.index + 1} / ${total}`;
    $("step-title").textContent = st.title;
    $("step-body").textContent = st.body;
    $("step-observe").textContent = st.observe;
    $("step-contrast").textContent = st.contrast;
    $("contrast-box").style.display = st.contrast ? "" : "none";
    $("step-keys").innerHTML = st.keys.map((k) => `<li>${k}</li>`).join("");
    $("step-source").textContent = st.source;
    $("progress-fill").style.width = `${(state.index / (total - 1)) * 100}%`;
    $("btn-prev").disabled = state.index === 0;
    $("btn-next").textContent = state.index === total - 1 ? "Recomeçar" : state.index === 0 ? "Começar" : "Próximo";
  }

  function updateHud() {
    const st = step();
    if (state.mode === "striated") {
      $("length-readout").textContent = `Sarcômero ~${(2.5 * (1 - state.shorten * 0.35)).toFixed(2)} μm`;
    } else {
      $("length-readout").textContent = `Célula ${Math.round(100 - state.shorten * 38)}%`;
    }
    if (state.shorten < 0.1) $("state-badge").textContent = "Relaxada";
    else if (state.shorten < 0.45) $("state-badge").textContent = "Contraindo";
    else if (st.latch) $("state-badge").textContent = "Latch";
    else $("state-badge").textContent = "Contraída";
  }

  function startMode(mode) {
    state.mode = mode;
    state.index = 0;
    state.shorten = 0;
    $("chooser").classList.add("hidden");
    $("sim").classList.remove("hidden");
    $("sim-eyebrow").textContent = mod().eyebrow;
    $("sim-title").textContent = mod().title;
    resize();
    renderLesson();
  }

  function go(d) {
    const total = mod().steps.length;
    if (d > 0 && state.index === total - 1) state.index = 0;
    else state.index = Math.max(0, Math.min(total - 1, state.index + d));
    renderLesson();
  }

  $("pick-smooth").onclick = () => startMode("smooth");
  $("pick-striated").onclick = () => startMode("striated");
  $("btn-home").onclick = () => {
    state.mode = null;
    $("sim").classList.add("hidden");
    $("chooser").classList.remove("hidden");
  };
  $("btn-next").onclick = () => go(1);
  $("btn-prev").onclick = () => go(-1);
  window.addEventListener("keydown", (e) => {
    if (!state.mode) return;
    if (e.key === "ArrowRight" || e.key === "Enter") {
      e.preventDefault();
      go(1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
    if (e.key === "Escape") $("btn-home").click();
  });
  window.addEventListener("resize", () => {
    if (state.mode) resize();
  });

  function loop() {
    state.anim++;
    if (state.mode) {
      state.shorten = ease(state.shorten, step().targetShorten || 0, 0.04);
      if (state.mode === "smooth") drawSmooth();
      else drawStriated();
      updateHud();
    }
    requestAnimationFrame(loop);
  }

  loop();
})();
