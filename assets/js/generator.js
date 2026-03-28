"use strict";

import { svg } from "./config.js";
import { getGroupColor, darkenColor, FONT_FAMILY } from "./config.js";
import { registerAnim } from "./animation.js";
import {
  showTooltip,
  handleTooltipMove,
  handleNodeMouseLeave,
} from "./interaction.js";
import { tx, mk } from "./utils.js";

export function createCustomCircles({
  x,
  y,
  nodes,
  tag,
  title,
  desc,
  showNumbers,
}) {
  const groupElement = mk("g", { class: tag });
  const groupColor = getGroupColor(tag);

  const ringLevels = Object.keys(nodes).map(Number);
  const num_circles = Math.max(...ringLevels);

  const totalNodes = Object.values(nodes).flat().length;
  let avgSeparation = 35;
  avgSeparation += num_circles * 1.5;
  avgSeparation += totalNodes * 0.2;

  const rings = [];
  const d = 4; // decrease factor
  const s1 = avgSeparation + (d * (num_circles - 1)) / 2;
  let current_radius = 0;
  for (let i = 0; i < num_circles; i++) {
    const separation = s1 - i * d;
    current_radius += separation;
    rings.push(current_radius);
  }

  // Render title
  const textStyle = {
    "text-anchor": "middle",
    "font-size": 18,
    "font-family": FONT_FAMILY,
    "font-weight": "600",
    "letter-spacing": "2px",
    "text-transform": "uppercase",
    opacity: 0.8,
  };

  const titleEl = tx(title, {
    ...textStyle,
    fill: groupColor,
    x: x,
    y: y - (rings[rings.length - 1] || 0) - 40,
  });

  titleEl.addEventListener("mouseenter", (e) =>
    showTooltip(e, { title, desc }, tag),
  );
  titleEl.addEventListener("mousemove", handleTooltipMove);
  titleEl.addEventListener("mouseleave", handleNodeMouseLeave);
  registerAnim(titleEl, tag);
  groupElement.append(titleEl);

  // Render rings
  rings.forEach((rg, i) => {
    const level = i + 1;
    if (nodes[level] && nodes[level].length > 0) {
      const ring = mk("circle", {
        cx: x,
        cy: y,
        r: rg,
        fill: "none",
        stroke: groupColor,
        "stroke-width": 0.7,
        opacity: 0.2,
      });
      registerAnim(ring, tag);
      groupElement.append(ring);

      if (showNumbers) {
        const lbl = tx(i + 1, {
          x: x,
          y: y - rg - 9,
          "text-anchor": "middle",
          "dominant-baseline": "auto",
          fill: groupColor,
          opacity: 0.35,
          "font-size": 9,
          "font-family": FONT_FAMILY,
          "font-weight": "700",
        });

        titleEl.addEventListener("mouseenter", (e) =>
          showTooltip(e, titleInfo),
        );
        titleEl.addEventListener("mousemove", handleTooltipMove);
        titleEl.addEventListener("mouseleave", handleNodeMouseLeave);
        registerAnim(lbl, tag);
        groupElement.append(lbl);
      }
    }
  });

  const createNodeElement = (n, nodeX, nodeY) => {
    const g = mk("g", { class: "nd" });
    g.append(
      mk("circle", {
        cx: nodeX,
        cy: nodeY,
        r: n.r ?? 24,
        fill: groupColor,
        stroke: darkenColor(groupColor, 20),
        "stroke-width": 1.8,
      }),
    );
    const nl = n.title.length,
      lh = (n.fs ?? 10) * 1.35,
      y0 = nodeY - ((nl - 1) * lh) / 2;
    for (let i = 0; i < nl; i++) {
      g.append(
        tx(n.title[i], {
          x: nodeX,
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
    g.addEventListener("mouseenter", (e) => showTooltip(e, n, tag));
    g.addEventListener("mousemove", handleTooltipMove);
    g.addEventListener("mouseleave", handleNodeMouseLeave);
    if (n.link) {
      const a = mk("a", { href: n.link, target: "_blank" });
      a.append(g);
      registerAnim(a, tag);
      return a;
    } else {
      registerAnim(g, tag);
      return g;
    }
  };

  // Render nodes
  const sortedRingLevels = ringLevels.sort((a, b) => a - b);
  for (const level of sortedRingLevels) {
    const ringNodes = nodes[level];

    if (level === 0) {
      const node = ringNodes[0];
      if (node) {
        const nodeElement = createNodeElement(node, x, y);
        groupElement.append(nodeElement);
      }
      continue;
    }

    const radius = rings[level - 1];
    const angleStep = (2 * Math.PI) / ringNodes.length;
    const rotation_offset = level > 1 ? (level - 1) * (Math.PI / 4) : 0;

    ringNodes.forEach((n, j) => {
      const angle = angleStep * j - Math.PI / 2 + rotation_offset;
      const nodeX = x + radius * Math.cos(angle);
      const nodeY = y + radius * Math.sin(angle);

      const nodeElement = createNodeElement(n, nodeX, nodeY);
      groupElement.append(nodeElement);
    });
  }

  svg.appendChild(groupElement);
}
