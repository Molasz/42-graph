"use strict";

import { svg, tip, getGroupColor } from "./config.js";
import { state } from "./state.js";

export function showTooltip(e, data, group) {
  let color = data.color || getGroupColor(group ?? data.group);
  if (data.inProgress) {
    color = "#808080";
  }

  let finalTags = data.tags;
  if (data.inProgress) {
    finalTags = ["In Progress", ...(data.tags || [])];
  }

  const tagsHTML =
    finalTags && Array.isArray(finalTags) && finalTags.length > 0
      ? `<div class="tl" style="margin-top: 7px; margin-bottom: 7px">${finalTags
          .map(
            (tag) =>
              `<span class="pill" style="background-color: ${color}; color: black">${tag}</span>`,
          )
          .join(" ")}</div>`
      : "";

  const title = Array.isArray(data.title) ? data.title.join(" ") : data.title;

  tip.innerHTML = `<div class="tn" style="color: ${color}">${title}</div>${tagsHTML}<div class="td">${data.desc}</div>`;
  tip.style.borderColor = color;
  tip.style.opacity = "1";
  handleTooltipMove(e);
}

export function handleNodeMouseLeave() {
  tip.style.opacity = "0";
}

export function handleTooltipMove(e) {
  tip.style.left = e.clientX + 16 + "px";
  tip.style.top = e.clientY - 8 + "px";
}

export function handleWheel(e) {
  e.preventDefault();
  const vb = svg.getAttribute("viewBox").split(" ").map(Number);
  const centerX = vb[0] + vb[2] / 2;
  const centerY = vb[1] + vb[3] / 2;
  const delta = e.deltaY > 0 ? 1.05 : 0.95;
  const minScale = 0.5;
  const maxScale = 3;
  const newScale = Math.min(
    Math.max(state.getScale() * delta, minScale),
    maxScale,
  );
  state.setScale(newScale);
  const s = 640 * newScale;
  svg.setAttribute(
    "viewBox",
    `${centerX - s / 2} ${centerY - s / 2} ${s} ${s}`,
  );
}

export function handleMouseDown(e) {
  state.setDragging(true);
  state.setStartCoords(e.clientX, e.clientY);
  const vb = svg.getAttribute("viewBox").split(" ").map(Number);
  state.setStartViewbox(vb[0], vb[1]);
  svg.style.cursor = "grabbing";
  e.preventDefault();
}

export function handleMouseMove(e) {
  if (!state.isDragging) return;
  const vb = svg.getAttribute("viewBox").split(" ").map(Number);
  const vbSize = vb[2];
  const { x: startX, y: startY } = state.getStartCoords();
  const { x: startVbX, y: startVbY } = state.getStartViewbox();
  const newVbX = startVbX - (e.clientX - startX) / (window.innerWidth / vbSize);
  const newVbY =
    startVbY - (e.clientY - startY) / (window.innerHeight / vbSize);
  svg.setAttribute("viewBox", `${newVbX} ${newVbY} ${vbSize} ${vbSize}`);
}

export function handleMouseUp() {
  state.setDragging(false);
  svg.style.cursor = "grab";
}
