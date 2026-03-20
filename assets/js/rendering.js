"use strict";

import { N, svg, getGroupColor, darkenColor } from "./config.js";
import {
  piscineNodes,
  commonNodes,
  toolsNodes,
  workNodes,
  outerNodes,
  titleData,
  RINGS,
  satelliteCircles,
} from "./data.js";
import { registerAnim } from "./animation.js";
import {
  showTooltip,
  handleTooltipMove,
  handleNodeMouseLeave,
} from "./interaction.js";

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

export function renderRings() {
  const commonColor = getGroupColor("common");
  RINGS.forEach((rg, i) => {
    const ring = mk("circle", {
      cx: 320,
      cy: 340,
      r: rg,
      fill: "none",
      stroke: commonColor,
      "stroke-width": 0.7,
      opacity: 0.2,
    });
    const lbl = tx(i + 1, {
      x: 320,
      y: 340 - rg - 9,
      "text-anchor": "middle",
      "dominant-baseline": "auto",
      fill: commonColor,
      opacity: 0.35,
      "font-size": 9,
      "font-family": "ui-sans-serif,system-ui,sans-serif",
      "font-weight": "700",
    });
    registerAnim(ring, "bg-rings");
    registerAnim(lbl, "bg-rings");
    svg.append(ring, lbl);
  });

  for (const sc of satelliteCircles) {
    const color = getGroupColor(sc.group);
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
      stroke: color,
      "stroke-width": 0.4,
      opacity: 0.2,
    });
    registerAnim(bgFill, sc.group);
    registerAnim(bgBorder, sc.group);
    svg.append(bgFill, bgBorder);
  }
}

export function renderTitles() {
  const textStyle = {
    "text-anchor": "middle",
    "font-size": 18,
    "font-family": "ui-sans-serif,system-ui,sans-serif",
    "font-weight": "600",
    "letter-spacing": "2px",
    "text-transform": "uppercase",
    opacity: 0.8,
  };

  for (const titleInfo of titleData) {
    const color = getGroupColor(titleInfo.group);
    const titleEl = tx(titleInfo.text, {
      ...textStyle,
      fill: color,
      x: titleInfo.x,
      y: titleInfo.y,
    });

    titleEl.addEventListener("mouseenter", (e) => showTooltip(e, titleInfo));
    titleEl.addEventListener("mousemove", handleTooltipMove);
    titleEl.addEventListener("mouseleave", handleNodeMouseLeave);
    registerAnim(titleEl, titleInfo.group);
    svg.append(titleEl);
  }
}

export function renderNodes() {
  const allNodes = [
    ...piscineNodes,
    ...commonNodes,
    ...outerNodes,
    ...workNodes,
    ...toolsNodes,
  ];
  for (const p of allNodes) {
    const groupColor = getGroupColor(p.group);
    const g = mk("g", { class: "nd" });
    g.append(
      mk("circle", {
        cx: p.x,
        cy: p.y,
        r: p.r,
        fill: groupColor,
        stroke: darkenColor(groupColor, 20),
        "stroke-width": 1.8,
      }),
    );
    const nl = p.title.length,
      lh = p.fs * 1.35,
      y0 = p.y - ((nl - 1) * lh) / 2;
    for (let i = 0; i < nl; i++) {
      g.append(
        tx(p.title[i], {
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
    if (p.link) {
      const a = mk("a", { href: p.link, target: "_blank" });
      a.append(g);
      registerAnim(a, p.group);
      svg.append(a);
    } else {
      registerAnim(g, p.group);
      svg.append(g);
    }
  }
}
