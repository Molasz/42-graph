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

export function createCustomCircles(
  { x, y, nodes, tag, title, desc, showNumbers },
  animationOrder,
) {
  let order = animationOrder;
  const nodesTag = `nodes-${tag}`;
  const groupElement = mk("g", { class: nodesTag });
  const groupColor = getGroupColor(tag);

  const createNodeElement = (n, nodeX, nodeY) => {
    const g = mk("g", { class: "nd" });
    let nodeColor = n.color || groupColor;
    if (n.inProgress) {
      nodeColor = "#808080";
    }
    g.append(
      mk("circle", {
        cx: nodeX,
        cy: nodeY,
        r: n.r ?? 24,
        fill: nodeColor,
        stroke: darkenColor(nodeColor, 20),
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
      registerAnim(a, order++);
      return a;
    } else {
      registerAnim(g, order++);
      return g;
    }
  };

  const ringLevels = Object.keys(nodes).map(Number);
  const num_circles = Math.max(...ringLevels);

  const totalNodes = Object.values(nodes)
    .map((levelData) => {
      if (Array.isArray(levelData)) {
        return levelData; // old format for a level
      }
      if (levelData.nodes && Array.isArray(levelData.nodes)) {
        return levelData.nodes; // new { nodes: [] } format
      }
      // It might be the node object itself for level 0
      if (levelData.title) {
        return [levelData];
      }
      return [];
    })
    .flat().length;
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
    class: `titles-${tag}`,
  });

  titleEl.addEventListener("mouseenter", (e) =>
    showTooltip(e, { title, desc }, tag),
  );
  titleEl.addEventListener("mousemove", handleTooltipMove);
  titleEl.addEventListener("mouseleave", handleNodeMouseLeave);
  registerAnim(titleEl, order++);
  groupElement.append(titleEl);

  // Render nodes level 0
  if (nodes[0]) {
    let node = null;
    const levelData = nodes[0];
    if (Array.isArray(levelData) && levelData.length > 0) {
      node = levelData[0];
    } else if (levelData.nodes && Array.isArray(levelData.nodes)) {
      node = levelData.nodes[0];
    } else if (
      typeof levelData === "object" &&
      levelData !== null &&
      levelData.title
    ) {
      node = levelData;
    }

    if (node) {
      const nodeElement = createNodeElement(node, x, y);
      groupElement.append(nodeElement);
    }
  }

  // Render rings and nodes
  const sortedRingLevels = ringLevels.sort((a, b) => a - b);
  for (const level of sortedRingLevels) {
    if (level === 0) continue;

    const levelData = nodes[level];
    const ringNodes = Array.isArray(levelData) ? levelData : levelData.nodes;
    if (!ringNodes || ringNodes.length === 0) continue;

    const level_offset = Array.isArray(levelData) ? 0 : levelData.offset || 0;
    const level_offset_rad = level_offset * (Math.PI / 180);

    // Render ring
    const radius = rings[level - 1];
    const ring = mk("circle", {
      cx: x,
      cy: y,
      r: radius,
      fill: "none",
      stroke: groupColor,
      "stroke-width": 0.7,
      opacity: 0.2,
      class: `rings-${tag}`,
    });
    registerAnim(ring, order++);
    groupElement.append(ring);

    if (showNumbers) {
      const lbl = tx(level, {
        x: x,
        y: y - radius - 9,
        "text-anchor": "middle",
        "dominant-baseline": "auto",
        fill: groupColor,
        opacity: 0.35,
        "font-size": 9,
        "font-family": FONT_FAMILY,
        "font-weight": "700",
      });
      registerAnim(lbl, order++);
      groupElement.append(lbl);
    }

    // Render nodes
    const angleStep = (2 * Math.PI) / ringNodes.length;
    const rotation_offset = level > 1 ? (level - 1) * (Math.PI / 4) : 0;

    ringNodes.forEach((n, j) => {
      const node_offset_rad = (n.offset || 0) * (Math.PI / 180);
      const angle =
        angleStep * j -
        Math.PI / 2 +
        rotation_offset +
        level_offset_rad +
        node_offset_rad;
      const nodeX = x + radius * Math.cos(angle);
      const nodeY = y + radius * Math.sin(angle);

      const nodeElement = createNodeElement(n, nodeX, nodeY);
      groupElement.append(nodeElement);
    });
  }

  svg.appendChild(groupElement);
  return order;
}
