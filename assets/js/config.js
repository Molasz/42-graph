"use strict";

import { groups } from "./data.js";

export const N = "http://www.w3.org/2000/svg";
export const svg = document.getElementById("graph");
export const tip = document.getElementById("tip");

export const ANIM_FADE = 300;
export const FONT_FAMILY = "ui-sans-serif, system-ui, sans-serif";

// Theme constants
const DARK_THEME = "dark";
const LIGHT_THEME = "light";

export const getGroupColor = (tag) => {
  const currentTheme = document.documentElement.getAttribute('data-theme') || DARK_THEME;
  const colorProp = currentTheme === DARK_THEME ? 'darkColor' : 'lightColor';
  
  const common = groups.find((g) => g.tag === "common");
  if (!tag) return common[colorProp] || common.color;
  const group = groups.find((g) => g.tag === tag);
  return group ? (group[colorProp] || group.color) : (common[colorProp] || common.color);
};

export function darkenColor(hex, percent) {
  if (!hex || hex.length < 7) return hex;
  
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);

  const darkR = Math.min(255, parseInt((r * (100 - percent)) / 100));
  const darkG = Math.min(255, parseInt((g * (100 - percent)) / 100));
  const darkB = Math.min(255, parseInt((b * (100 - percent)) / 100));

  const toHex = (val) => {
    const hexStr = val.toString(16);
    return hexStr.length === 1 ? `0${hexStr}` : hexStr;
  };

  return `#${toHex(darkR)}${toHex(darkG)}${toHex(darkB)}`;
}
