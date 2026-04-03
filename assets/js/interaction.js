"use strict";

import { svg, tip, getGroupColor } from "./config.js";
import { state } from "./state.js";

// Constants
const TOOLTIP_OFFSET_X = 16;
const TOOLTIP_OFFSET_Y = -8;
const IN_PROGRESS_COLOR = "#808080";
const PILL_TEXT_COLOR = "black";
const ZOOM_SPEED = 0.05; // 5% per scroll
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const BASE_VIEWBOX_SIZE = 640;

/**
 * Build HTML for tooltip tags
 */
function buildTagsHTML(tags, color) {
  if (!Array.isArray(tags) || tags.length === 0) return "";
  const tagElements = tags
    .map((tag) => `<span class="pill" style="background-color: ${color}; color: ${PILL_TEXT_COLOR}">${tag}</span>`)
    .join(" ");
  return `<div class="tl" style="margin-top: 7px; margin-bottom: 7px">${tagElements}</div>`;
}

/**
 * Parse viewBox string to array of numbers
 */
function parseViewbox() {
  return svg.getAttribute("viewBox").split(" ").map(Number);
}

export function showTooltip(e, data, group) {
  let color = data.color || getGroupColor(group ?? data.group);
  if (data.inProgress) {
    color = IN_PROGRESS_COLOR;
  }

  let finalTags = data.tags;
  if (data.inProgress) {
    finalTags = ["In Progress", ...(data.tags || [])];
  }

  const tagsHTML = buildTagsHTML(finalTags, color);
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
  tip.style.left = e.clientX + TOOLTIP_OFFSET_X + "px";
  tip.style.top = e.clientY + TOOLTIP_OFFSET_Y + "px";
}

export function handleWheel(e) {
  e.preventDefault();
  const vb = parseViewbox();
  const centerX = vb[0] + vb[2] / 2;
  const centerY = vb[1] + vb[3] / 2;
  const delta = e.deltaY > 0 ? 1 + ZOOM_SPEED : 1 - ZOOM_SPEED;
  
  const newScale = Math.min(
    Math.max(state.getScale() * delta, MIN_SCALE),
    MAX_SCALE,
  );
  state.setScale(newScale);
  
  const viewboxSize = BASE_VIEWBOX_SIZE * newScale;
  svg.setAttribute(
    "viewBox",
    `${centerX - viewboxSize / 2} ${centerY - viewboxSize / 2} ${viewboxSize} ${viewboxSize}`,
  );
}

export function handleMouseDown(e) {
  state.setDragging(true);
  state.setStartCoords(e.clientX, e.clientY);
  const vb = parseViewbox();
  state.setStartViewbox(vb[0], vb[1]);
  svg.style.cursor = "grabbing";
  e.preventDefault();
}

export function handleMouseMove(e) {
  if (!state.isDragging) return;
  const vb = parseViewbox();
  const vbSize = vb[2];
  const { x: startX, y: startY } = state.getStartCoords();
  const { x: startVbX, y: startVbY } = state.getStartViewbox();
  
  const pixelToVbScaleX = vbSize / window.innerWidth;
  const pixelToVbScaleY = vbSize / window.innerHeight;
  
  const newVbX = startVbX - (e.clientX - startX) * pixelToVbScaleX;
  const newVbY = startVbY - (e.clientY - startY) * pixelToVbScaleY;
  
  svg.setAttribute("viewBox", `${newVbX} ${newVbY} ${vbSize} ${vbSize}`);
}

export function handleMouseUp() {
  state.setDragging(false);
  svg.style.cursor = "grab";
}
