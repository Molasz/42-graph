"use strict";

import { N, svg } from "./config.js";
import {
  piscineNodes,
  commonCoreNodes,
  outerCoreNodes,
  workExperienceNodes,
  titleData,
  RINGS,
  satelliteCircles,
} from "./data.js";
import { registerAnim } from "./animation.js";
import { showTooltip, handleTooltipMove } from "./interaction.js";

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

export function renderBackgrounds() {
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

export function renderRings() {
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

export function renderTitles() {
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

export function renderNodes() {
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
    g.addEventListener("mouseleave", () => (tip.style.opacity = "0"));
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
