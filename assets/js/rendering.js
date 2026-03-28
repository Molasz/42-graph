"use strict";

import {
  svg,
  getGroupColor,
  darkenColor,
  FONT_FAMILY,
  COLORS,
} from "./config.js";
import {
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
import { mk, tx } from "./utils.js";

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
      "font-family": FONT_FAMILY,
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
      fill: COLORS.bg_dark,
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
    "font-family": FONT_FAMILY,
    "font-weight": "600",
    "letter-spacing": "2px",
    "text-transform": "uppercase",
    opacity: 0.8,
  };

  for (const titleInfo of titleData) {
    const color = getGroupColor(titleInfo.group);
    const titleEl = tx(titleInfo.title, {
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

export function renderNodes(nodes, group) {
  nodes.forEach((n) => {
    const groupColor = getGroupColor(group ?? n.group);
    const g = mk("g", { class: "nd" });
    g.append(
      mk("circle", {
        cx: n.x,
        cy: n.y,
        r: n.r ?? 26,
        fill: groupColor,
        stroke: darkenColor(groupColor, 20),
        "stroke-width": 1.8,
      }),
    );
    const nl = n.title.length,
      lh = (n.fs ?? 10) * 1.35,
      y0 = n.y - ((nl - 1) * lh) / 2;
    for (let i = 0; i < nl; i++) {
      g.append(
        tx(n.title[i], {
          x: n.x,
          y: y0 + i * lh,
          "text-anchor": "middle",
          "dominant-baseline": "central",
          fill: "#051a14",
          "font-size": n.fs ?? 10,
          "font-family": FONT_FAMILY,
          "font-weight": "700",
        }),
      );
    }
    g.addEventListener("mouseenter", (e) => showTooltip(e, n, group));
    g.addEventListener("mousemove", handleTooltipMove);
    g.addEventListener("mouseleave", handleNodeMouseLeave);
    if (n.link) {
      const a = mk("a", { href: n.link, target: "_blank" });
      a.append(g);
      registerAnim(a, group ?? n.group);
      svg.append(a);
    } else {
      registerAnim(g, group ?? n.group);
      svg.append(g);
    }
  });
}
