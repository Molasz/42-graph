"use strict";

export const N = "http://www.w3.org/2000/svg";
export const svg = document.getElementById("graph");
export const tip = document.getElementById("tip");

export const ANIM_GROUPS = [
  "title-piscine",
  "nodes-piscine",
  "title-common",
  "nodes-common",
  "bg-rings",
  "rank-0",
  "rank-1",
  "rank-2",
  "rank-3",
  "rank-4",
  "rank-5",
  "rank-6",
  "title-tools",
  "nodes-tools",
  "title-work",
  "nodes-work",
  "title-outer",
  "nodes-outer",
];

export const ANIM_FADE = 300;
export const ANIM_STEP = (5 * 1000) / ANIM_GROUPS.length;

const COLORS = {
  piscine: "#0ab8fd",
  common: "#10ecd3",
  tools: "#05d362",
  work: "#569661",
  outer: "#8ceb10",
};

export const getGroupColor = (group) =>
  (group && COLORS[group.split("-")[1]]) || COLORS.common;

export function darkenColor(hex, percent) {
  if (!hex || hex.length < 7) return hex;
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  r = parseInt((r * (100 - percent)) / 100);
  g = parseInt((g * (100 - percent)) / 100);
  b = parseInt((b * (100 - percent)) / 100);

  r = r < 255 ? r : 255;
  g = g < 255 ? g : 255;
  b = b < 255 ? b : 255;

  const rStr =
    r.toString(16).length == 1 ? "0" + r.toString(16) : r.toString(16);
  const gStr =
    g.toString(16).length == 1 ? "0" + g.toString(16) : g.toString(16);
  const bStr =
    b.toString(16).length == 1 ? "0" + b.toString(16) : b.toString(16);

  return `#${rStr}${gStr}${bStr}`;
}

export let scale = 2.7;
export let isDragging = false;
export let startX, startY, startVbX, startVbY;
export let introPlayed = false;

export function setScale(newScale) {
  scale = newScale;
}

export function setDragging(dragging) {
  isDragging = dragging;
}

export function setStartCoords(x, y) {
  startX = x;
  startY = y;
}

export function setStartViewbox(x, y) {
  startVbX = x;
  startVbY = y;
}

export function setIntroPlayed(played) {
  introPlayed = played;
}
