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
