"use strict";

import { groups } from "./data.js";

export const N = "http://www.w3.org/2000/svg";
export const svg = document.getElementById("graph");
export const tip = document.getElementById("tip");

export const ANIM_FADE = 300;

export const FONT_FAMILY = "ui-sans-serif, system-ui, sans-serif";

export const bg_dark = "#0a1628";

export const getGroupColor = (tag) => {
  const common = groups.find((g) => g.tag === "common").color;
  if (!tag) return common;
  const group = groups.find((g) => g.tag === tag);
  return group ? group.color : common;
};

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
