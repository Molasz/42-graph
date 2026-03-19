"use strict";

import {
  svg,
  tip,
  scale,
  isDragging,
  startX,
  startY,
  startVbX,
  startVbY,
  setScale,
  setDragging,
  setStartCoords,
  setStartViewbox,
} from "./config.js";

export function showTooltip(e, data) {
  tip.innerHTML = `<div class="tn">${data.lbl}</div><div class="tl">${data.lv}</div><div class="td">${data.desc}</div>`;
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
  const minScale = 0.5,
    maxScale = 3;
  const newScale = Math.min(Math.max(scale * delta, minScale), maxScale);
  setScale(newScale);
  const s = 640 * newScale;
  svg.setAttribute(
    "viewBox",
    `${centerX - s / 2} ${centerY - s / 2} ${s} ${s}`,
  );
}

export function handleMouseDown(e) {
  setDragging(true);
  setStartCoords(e.clientX, e.clientY);
  const vb = svg.getAttribute("viewBox").split(" ").map(Number);
  setStartViewbox(vb[0], vb[1]);
  svg.style.cursor = "grabbing";
  e.preventDefault();
}

export function handleMouseMove(e) {
  if (!isDragging) return;
  const vb = svg.getAttribute("viewBox").split(" ").map(Number);
  const vbSize = vb[2];
  const newVbX = startVbX - (e.clientX - startX) / (window.innerWidth / vbSize);
  const newVbY =
    startVbY - (e.clientY - startY) / (window.innerHeight / vbSize);
  svg.setAttribute("viewBox", `${newVbX} ${newVbY} ${vbSize} ${vbSize}`);
}

export function handleMouseUp() {
  setDragging(false);
  svg.style.cursor = "grab";
}
