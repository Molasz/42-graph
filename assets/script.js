"use strict";

const N = "http://www.w3.org/2000/svg";
const svg = document.getElementById("graph");
const tip = document.getElementById("tip");

const ANIM_GROUPS = [
  "title-piscine",
  "nodes-piscine",
  "title-cc",
  "bg-rings",
  "rank-0",
  "rank-1",
  "rank-2",
  "rank-3",
  "rank-4",
  "rank-5",
  "rank-6",
  "title-we",
  "nodes-work",
  "title-oc",
  "nodes-oc",
];

const ANIM_FADE = 300;
const ANIM_STEP = (5 * 1000) / ANIM_GROUPS.length;

const ANIM_REGISTRY = [];
let scale = 2.7;
let isDragging = false;
let startX, startY, startVbX, startVbY;
let introPlayed = false;

const piscineNodes = [
  {
    x: -165,
    y: 0,
    r: 26,
    lines: ["Piscine"],
    fs: 11,
    c: 1,
    lv: "Piscine",
    lbl: "Piscine",
    animGroup: "nodes-piscine",
    desc: "Intensive 4-week bootcamp covering C, algorithms, memory management and Unix fundamentals — the foundation of the 42 curriculum.",
    repo: "https://github.com/Molasz/42Piscine",
  },
  {
    x: -130,
    y: 60,
    r: 26,
    lines: ["Piscine", "Reloaded"],
    fs: 10,
    c: 1,
    lv: "Piscine",
    lbl: "Piscine Reloaded",
    animGroup: "nodes-piscine",
    desc: "Review of the Piscine with additional exercises, focusing on optimization and best practices — essential reinforcement before the projects.",
    repo: "https://github.com/Molasz/42PiscineReloaded",
  },
  {
    x: -95,
    y: 0,
    r: 26,
    lines: ["BSQ"],
    fs: 10,
    c: 1,
    lv: "Piscine",
    lbl: "BSQ",
    animGroup: "nodes-piscine",
    desc: "The classic 'Biggest Square' problem — find the largest square in a grid with obstacles, using dynamic programming and efficient file parsing.",
    repo: "https://github.com/photocatalysta/42-Piscine-BSQ-Project",
  },
];

const commonCoreNodes = [
  {
    x: 320,
    y: 320,
    r: 26,
    lines: ["libft"],
    fs: 11,
    c: 1,
    lv: "Level 0",
    lbl: "libft",
    animGroup: "rank-0",
    desc: "Re-implement the C standard library from scratch — the backbone of every project that follows.",
    repo: "https://github.com/Molasz/42cursus-libft",
  },
  {
    x: 389,
    y: 280,
    r: 26,
    lines: ["ft_printf"],
    fs: 8,
    lv: "Level 1",
    lbl: "ft_printf",
    animGroup: "rank-1",
    desc: "Re-implementation of printf using variadic functions — flags, width, precision and justification.",
    repo: "https://github.com/Molasz/42cursus-ft_printf",
  },
  {
    x: 251,
    y: 360,
    r: 26,
    lines: ["GNL"],
    fs: 9,
    lv: "Level 1",
    lbl: "get_next_line",
    animGroup: "rank-1",
    desc: "Read any file descriptor one line at a time with a configurable BUFFER_SIZE.",
    repo: "https://github.com/Molasz/42cursus-get_next_line",
  },
  {
    x: 455,
    y: 320,
    r: 26,
    lines: ["push_swap"],
    fs: 8,
    lv: "Level 2",
    lbl: "push_swap",
    animGroup: "rank-2",
    desc: "Sort a stack of integers using only two stacks and a minimum number of operations.",
    repo: "https://github.com/Molasz/42cursus-push_swap",
  },
  {
    x: 253,
    y: 437,
    r: 26,
    lines: ["pipex"],
    fs: 11,
    lv: "Level 2",
    lbl: "pipex",
    animGroup: "rank-2",
    desc: "Recreate shell pipes using fork, execve and file descriptor redirection.",
    repo: "https://github.com/Molasz/42cursus-pipex",
  },
  {
    x: 253,
    y: 203,
    r: 26,
    lines: ["FDF"],
    fs: 14,
    lv: "Level 2",
    lbl: "FDF",
    animGroup: "rank-2",
    desc: "3D wireframe terrain renderer — read elevation maps and project them in isometric 3D using MiniLibX.",
    repo: "https://github.com/Molasz/42cursus-fdf",
  },
  {
    x: 501,
    y: 379,
    r: 26,
    lines: ["philosophers"],
    fs: 8,
    lv: "Level 3",
    lbl: "philosophers",
    animGroup: "rank-3",
    desc: "The Dining Philosophers problem — threads, mutexes and deadlock prevention in C.",
    repo: "https://github.com/Molasz/42cursus-philosophers",
  },
  {
    x: 139,
    y: 261,
    r: 26,
    lines: ["minishell"],
    fs: 9,
    lv: "Level 3",
    lbl: "minishell",
    animGroup: "rank-3",
    desc: "A fully functional Unix shell with pipes, redirections, heredocs, variable expansion and all builtins.",
    repo: "https://github.com/Molasz/42cursus-minishell",
  },
  {
    x: 518,
    y: 176,
    r: 26,
    lines: ["cub3D"],
    fs: 11,
    lv: "Level 4",
    lbl: "cub3D",
    animGroup: "rank-4",
    desc: "Raycasting engine inspired by Wolfenstein 3D — DDA algorithm, textures, minimap, built with MLX42.",
    repo: "https://github.com/Molasz/42cursus-cub3d",
  },
  {
    x: 320,
    y: 20,
    r: 26,
    lines: ["C++", "Modules"],
    fs: 10,
    lv: "Level 5",
    lbl: "C++ Modules",
    animGroup: "rank-5",
    desc: "10 modules covering C++98 OOP: Orthodox Canonical Form, polymorphism, templates, STL and exceptions.",
    repo: "https://github.com/Molasz/42cursus-cpp_modules",
  },
  {
    x: 580,
    y: 470,
    r: 26,
    lines: ["Inception"],
    fs: 8,
    lv: "Level 5",
    lbl: "Inception",
    animGroup: "rank-5",
    desc: "Docker infrastructure from scratch: NGINX + WordPress + MariaDB, persistent volumes, no pre-built images.",
    repo: "https://github.com/Molasz/42cursus-inception",
  },
  {
    x: 60,
    y: 470,
    r: 26,
    lines: ["webserv"],
    fs: 9,
    lv: "Level 5",
    lbl: "webserv",
    animGroup: "rank-5",
    desc: "HTTP/1.1 web server in C++ with config files, virtual hosts, CGI and non-blocking I/O.",
    repo: "https://github.com/Molasz/42cursus-webserv",
  },
  {
    x: 320,
    y: 665,
    r: 34,
    lines: ["ft_transcendence"],
    fs: 8,
    lv: "Level 6",
    lbl: "ft_transcendence",
    animGroup: "rank-6",
    desc: "Full-stack Pong platform: Django + PostgreSQL + Vanilla JS + Docker. WebSockets, JWT, 2FA, OAuth and 3D rendering.",
    repo: "https://github.com/Molasz/42cursus-ft_transcendence",
  },
];

const outerCoreNodes = [
  {
    x: 735,
    y: 0,
    r: 26,
    lines: ["libasm"],
    fs: 10,
    c: 1,
    lv: "Outer Core",
    lbl: "libasm",
    animGroup: "nodes-oc",
    desc: "Re-implement core C functions in x86-64 assembly — ft_strlen, ft_strcpy, ft_strcmp, ft_write, ft_read, ft_strdup. Learn low-level programming and calling conventions.",
    repo: "https://github.com/Molasz/42outer-libasm",
  },
  {
    x: 805,
    y: 0,
    r: 26,
    lines: ["dr-quine"],
    fs: 10,
    c: 1,
    lv: "Outer Core",
    lbl: "dr-quine",
    animGroup: "nodes-oc",
    desc: "Create self-replicating programs (quines) in C, asm and JS — programs that output their own source code. Explore code generation and self-reference.",
    repo: "https://github.com/Molasz/42outer-dr-quine",
  },
  {
    x: 770,
    y: 60,
    r: 26,
    lines: ["nm"],
    fs: 16,
    c: 1,
    lv: "Outer Core",
    lbl: "nm",
    animGroup: "nodes-oc",
    desc: "Re-implement the nm command — display symbol table of object files. Parse ELF format, handle symbols, types and values.",
    repo: "https://github.com/Molasz/42outer-nm",
  },
];

const workExperienceNodes = [
  {
    x: -130,
    y: 590,
    r: 26,
    lines: ["CV"],
    fs: 10,
    c: 1,
    lv: "Experience",
    lbl: "CV",
    animGroup: "nodes-work",
    desc: "Download my CV — experience & technical skills overview",
    repo: "assets/CV.pdf",
  },
  {
    x: -165,
    y: 650,
    r: 26,
    lines: ["Work", "Experience I"],
    fs: 8,
    c: 1,
    lv: "Experience",
    lbl: "Work experience I",
    animGroup: "nodes-work",
    desc: "Fullstack Tech Lead · 6 months Led a team of 7 developers on an Angular + .NET application, owning architecture design, feature implementation, and code quality standards.",
  },
  {
    x: -95,
    y: 650,
    r: 26,
    lines: ["Part", "Time I"],
    fs: 10,
    c: 1,
    lv: "Experience",
    lbl: "Part time",
    animGroup: "nodes-work",
    desc: "6 months part-time experience as a fullstack techlead",
  },
];

const titleData = [
  {
    text: "Common core",
    x: 320,
    y: -40,
    animGroup: "title-cc",
    lbl: "Common Core",
    lv: "Ranks 0 to 6",
    desc: "The main curriculum at 42, covering a wide range of topics from basic algorithms to web development and computer graphics.",
  },
  {
    text: "Piscine",
    x: -130,
    y: -40,
    animGroup: "title-piscine",
    lbl: "Piscine",
    lv: "The beginning",
    desc: "A 4-week intensive bootcamp that serves as the entry point to the 42 program. It's a test of determination and a crash course in C programming.",
  },
  {
    text: "Outer Core",
    x: 770,
    y: -40,
    animGroup: "title-oc",
    lbl: "Outer Core",
    lv: "More to come",
    desc: "Optional projects that allow students to delve deeper into specific areas of interest, such as assembly language or system programming.",
  },
  {
    text: "Work Experience",
    x: -130,
    y: 550,
    animGroup: "title-we",
    lbl: "Work Experience",
    lv: "Experience",
    desc: "Projects and experiences from my professional career, showcasing real-world applications of the skills learned at 42 and beyond.",
  },
];

const RINGS = [
  { r: 80, lbl: "1" },
  { r: 135, lbl: "2" },
  { r: 190, lbl: "3" },
  { r: 245, lbl: "4" },
  { r: 300, lbl: "5" },
  { r: 345, lbl: "6" },
];

const satelliteCircles = [
  { cx: -130, cy: 30, r: 40, animGroup: "nodes-piscine" },
  { cx: 770, cy: 30, r: 40, animGroup: "nodes-oc" },
  { cx: -130, cy: 620, r: 40, animGroup: "nodes-work" },
];

function mk(tag, a = {}) {
  const e = document.createElementNS(N, tag);
  for (const [k, v] of Object.entries(a)) e.setAttribute(k, v);
  return e;
}

function tx(t, a = {}) {
  const e = mk("text", a);
  e.textContent = t;
  return e;
}

function registerAnim(el, group) {
  el.style.opacity = "0";
  el.style.pointerEvents = "none";
  ANIM_REGISTRY.push({ el, group });
}

function playIntro() {
  for (const { el, group } of ANIM_REGISTRY) {
    const step = ANIM_GROUPS.indexOf(group);
    if (step === -1) continue;
    const delay = step * ANIM_STEP;
    el.style.animation = `g42FadeIn ${ANIM_FADE}ms ease forwards`;
    el.style.animationDelay = delay + "ms";
    setTimeout(() => {
      el.style.pointerEvents = "auto";
    }, delay);
  }
}

function replayIntro() {
  for (const { el } of ANIM_REGISTRY) {
    el.style.animation = "none";
    el.style.pointerEvents = "none";
    el.style.opacity = "0";
  }
  setTimeout(() => playIntro(), 100);
}

function tryPlayIntro() {
  if (
    document.visibilityState === "visible" &&
    ANIM_REGISTRY.length > 0 &&
    !introPlayed
  ) {
    replayIntro();
    introPlayed = true;
    document.removeEventListener("visibilitychange", tryPlayIntro);
  }
}

function renderBackgrounds() {
  const mainBgFill = mk("circle", {
    cx: 320,
    cy: 320,
    r: 345,
    fill: "#0a1628",
  });
  const mainBgBorder = mk("circle", {
    cx: 320,
    cy: 320,
    r: 345,
    fill: "none",
    stroke: "#1ae0c8",
    "stroke-width": 0.4,
    opacity: 0.1,
  });
  registerAnim(mainBgFill, "bg-rings");
  registerAnim(mainBgBorder, "bg-rings");
  svg.append(mainBgFill, mainBgBorder);

  for (const sc of satelliteCircles) {
    const bgFill = mk("circle", {
      cx: sc.cx,
      cy: sc.cy,
      r: sc.r,
      fill: "#0a1628",
    });
    const bgBorder = mk("circle", {
      cx: sc.cx,
      cy: sc.cy,
      r: sc.r,
      fill: "none",
      stroke: "#1ae0c8",
      "stroke-width": 0.4,
      opacity: 0.1,
    });
    registerAnim(bgFill, sc.animGroup);
    registerAnim(bgBorder, sc.animGroup);
    svg.append(bgFill, bgBorder);
  }
}

function renderRings() {
  for (const rg of RINGS) {
    const ring = mk("circle", {
      cx: 320,
      cy: 320,
      r: rg.r,
      fill: "none",
      stroke: "#1ae0c8",
      "stroke-width": 0.7,
      opacity: 0.2,
    });
    const lbl = tx(rg.lbl, {
      x: 320,
      y: 320 + rg.r + 7,
      "text-anchor": "middle",
      "dominant-baseline": "auto",
      fill: "#1ae0c8",
      opacity: 0.35,
      "font-size": 9,
      "font-family": "ui-sans-serif,system-ui,sans-serif",
      "font-weight": "700",
    });
    registerAnim(ring, "bg-rings");
    registerAnim(lbl, "bg-rings");
    svg.append(ring, lbl);
  }
}

function renderTitles() {
  const textStyle = {
    "text-anchor": "middle",
    fill: "#1ae0c8",
    "font-size": 18,
    "font-family": "ui-sans-serif,system-ui,sans-serif",
    "font-weight": "600",
    "letter-spacing": "2px",
    "text-transform": "uppercase",
    opacity: 0.8,
  };

  for (const titleInfo of titleData) {
    const titleEl = tx(titleInfo.text, {
      ...textStyle,
      x: titleInfo.x,
      y: titleInfo.y,
    });

    titleEl.addEventListener("mouseenter", (e) => showTooltip(e, titleInfo));
    titleEl.addEventListener("mousemove", handleTooltipMove);

    registerAnim(titleEl, titleInfo.animGroup);
    svg.append(titleEl);
  }
}

function renderNodes() {
  const allNodes = [
    ...piscineNodes,
    ...commonCoreNodes,
    ...outerCoreNodes,
    ...workExperienceNodes,
  ];
  for (const p of allNodes) {
    const g = mk("g", { class: "nd" });
    g.append(
      mk("circle", {
        cx: p.x,
        cy: p.y,
        r: p.r,
        fill: "#1ae0c8",
        stroke: p.c ? "#054a3c" : "#077a62",
        "stroke-width": p.c ? 2.5 : 1.8,
      }),
    );
    const nl = p.lines.length,
      lh = p.fs * 1.35,
      y0 = p.y - ((nl - 1) * lh) / 2;
    for (let i = 0; i < nl; i++) {
      g.append(
        tx(p.lines[i], {
          x: p.x,
          y: y0 + i * lh,
          "text-anchor": "middle",
          "dominant-baseline": "central",
          fill: "#051a14",
          "font-size": p.fs,
          "font-family": "ui-sans-serif,system-ui,sans-serif",
          "font-weight": "700",
        }),
      );
    }
    g.addEventListener("mouseenter", (e) => showTooltip(e, p));
    g.addEventListener("mousemove", handleTooltipMove);
    g.addEventListener("mouseleave", handleNodeMouseLeave);
    if (p.repo) {
      const a = mk("a", { href: p.repo, target: "_blank" });
      a.append(g);
      registerAnim(a, p.animGroup);
      svg.append(a);
    } else {
      registerAnim(g, p.animGroup);
      svg.append(g);
    }
  }
}

function showTooltip(e, data) {
  tip.innerHTML = `<div class="tn">${data.lbl}</div><div class="tl">${data.lv}</div><div class="td">${data.desc}</div>`;
  tip.style.opacity = "1";
  handleTooltipMove(e);
}

function handleNodeMouseLeave() {
  tip.style.opacity = "0";
}

function handleTooltipMove(e) {
  tip.style.left = e.clientX + 16 + "px";
  tip.style.top = e.clientY - 8 + "px";
}

function handleWheel(e) {
  e.preventDefault();
  const vb = svg.getAttribute("viewBox").split(" ").map(Number);
  const centerX = vb[0] + vb[2] / 2;
  const centerY = vb[1] + vb[3] / 2;
  const delta = e.deltaY > 0 ? 1.05 : 0.95;
  const minScale = 0.5,
    maxScale = 3;
  scale = Math.min(Math.max(scale * delta, minScale), maxScale);
  const s = 640 * scale;
  svg.setAttribute(
    "viewBox",
    `${centerX - s / 2} ${centerY - s / 2} ${s} ${s}`,
  );
}

function handleMouseDown(e) {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  const vb = svg.getAttribute("viewBox").split(" ").map(Number);
  startVbX = vb[0];
  startVbY = vb[1];
  svg.style.cursor = "grabbing";
  e.preventDefault();
}

function handleMouseMove(e) {
  if (!isDragging) return;
  const vb = svg.getAttribute("viewBox").split(" ").map(Number);
  const vbSize = vb[2];
  const newVbX = startVbX - (e.clientX - startX) / (window.innerWidth / vbSize);
  const newVbY =
    startVbY - (e.clientY - startY) / (window.innerHeight / vbSize);
  svg.setAttribute("viewBox", `${newVbX} ${newVbY} ${vbSize} ${vbSize}`);
}

function handleMouseUp() {
  isDragging = false;
  svg.style.cursor = "grab";
}

function initialize() {
  renderBackgrounds();
  renderRings();
  renderTitles();
  renderNodes();

  const initialVbSize = 640 * scale;
  const initialVbX = 320 - initialVbSize / 2;
  const initialVbY = 700 - initialVbSize / 2;
  svg.setAttribute(
    "viewBox",
    `${initialVbX} ${initialVbY} ${initialVbSize} ${initialVbSize}`,
  );

  svg.addEventListener("wheel", handleWheel);
  svg.addEventListener("mousedown", handleMouseDown);
  svg.addEventListener("mousemove", handleMouseMove);
  svg.addEventListener("mouseup", handleMouseUp);
  svg.addEventListener("mouseleave", handleMouseUp);

  document.addEventListener("visibilitychange", tryPlayIntro);
  window.addEventListener("load", () => setTimeout(tryPlayIntro, 100));

  window.replayIntro = replayIntro;
}

initialize();
