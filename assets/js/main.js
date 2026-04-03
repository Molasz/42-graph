"use strict";

import { svg } from "./config.js";
import { animation } from "./animation.js";
import {
  handleWheel,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
} from "./interaction.js";
import { groups } from "./data.js";
import { createCustomCircles } from "./generator.js";
import { state } from "./state.js";
import { getGroupColor, darkenColor } from "./config.js";

const DARK_THEME = "dark";
const LIGHT_THEME = "light";
const DEFAULT_THEME = DARK_THEME;
const IN_PROGRESS_COLOR = "#808080";
const NODE_STROKE_DARKEN = 20;
const BASE_VIEWBOX_SIZE = 640;
const CENTER_X = 320;
const CENTER_Y = 730;
const LOAD_DELAY = 100;
const THEME_STORAGE_KEY = "theme";
const THEME_META_SELECTOR = 'meta[name="theme-color"]';
const DARK_THEME_ATTR = "data-theme-color-dark";
const LIGHT_THEME_ATTR = "data-theme-color-light";

function updateNodeCircles() {
  const circles = svg.querySelectorAll('circle');
  circles.forEach(circle => {
    const groupTag = circle.getAttribute('data-group-tag');
    if (!groupTag) return;
    
    const currentFill = circle.getAttribute('fill');
    // Skip updating in-progress nodes
    if (currentFill === IN_PROGRESS_COLOR) return;
    
    const newColor = getGroupColor(groupTag);
    circle.setAttribute('fill', newColor);
    circle.setAttribute('stroke', darkenColor(newColor, NODE_STROKE_DARKEN));
  });
}

function updateTextElements() {
  groups.forEach(group => {
    const newColor = getGroupColor(group.tag);
    
    const titleElements = svg.querySelectorAll(`.titles-${group.tag}`);
    titleElements.forEach(el => el.setAttribute('fill', newColor));
    
    const levelElements = svg.querySelectorAll(`.level-numbers-${group.tag}`);
    levelElements.forEach(el => el.setAttribute('fill', newColor));
  });
}

function updateThemeColors() {
  updateNodeCircles();
  updateTextElements();
}

function getThemeColorMeta(theme) {
  const metaThemeColor = document.querySelector(THEME_META_SELECTOR);
  if (!metaThemeColor) return null;
  
  const attr = theme === DARK_THEME ? DARK_THEME_ATTR : LIGHT_THEME_ATTR;
  return metaThemeColor.getAttribute(attr);
}

function updateThemeColorMeta(theme) {
  const metaThemeColor = document.querySelector(THEME_META_SELECTOR);
  if (!metaThemeColor) return;
  
  const color = getThemeColorMeta(theme);
  if (color) {
    metaThemeColor.setAttribute('content', color);
  }
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  updateThemeColorMeta(theme);
  updateThemeColors();
}

function initialize() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME;
  setTheme(savedTheme);

  let animationOrder = 0;
  groups.forEach((group) => {
    animationOrder = createCustomCircles(group, animationOrder);
  });

  const initialVbSize = BASE_VIEWBOX_SIZE * state.getScale();
  const initialVbX = CENTER_X - initialVbSize / 2;
  const initialVbY = CENTER_Y - initialVbSize / 2;
  svg.setAttribute(
    "viewBox",
    `${initialVbX} ${initialVbY} ${initialVbSize} ${initialVbSize}`,
  );

  svg.addEventListener("wheel", handleWheel);
  svg.addEventListener("mousedown", handleMouseDown);
  svg.addEventListener("mousemove", handleMouseMove);
  svg.addEventListener("mouseup", handleMouseUp);
  svg.addEventListener("mouseleave", handleMouseUp);

  document.addEventListener("visibilitychange", () => animation.tryPlay());
  window.addEventListener("load", () =>
    setTimeout(() => animation.tryPlay(), LOAD_DELAY),
  );

  const replayBtn = document.getElementById("replay-btn");
  replayBtn.addEventListener("click", () => animation.replay());

  const themeBtn = document.getElementById("theme-btn");
  themeBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    setTheme(newTheme);
  });
}

initialize();
