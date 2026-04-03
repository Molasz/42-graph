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

function updateCircleColors() {
  // Update all circles with new theme colors
  const circles = svg.querySelectorAll('circle');
  circles.forEach(circle => {
    const groupTag = circle.getAttribute('data-group-tag');
    if (groupTag) {
      const newColor = getGroupColor(groupTag);
      const currentFill = circle.getAttribute('fill');
      
      // Only update if it's not an in-progress node (gray color)
      if (currentFill !== '#808080') {
        circle.setAttribute('fill', newColor);
        circle.setAttribute('stroke', darkenColor(newColor, 20));
      }
    }
  });
  
  // Update group titles
  groups.forEach(group => {
    const titleElements = svg.querySelectorAll(`.titles-${group.tag}`);
    const newColor = getGroupColor(group.tag);
    titleElements.forEach(titleEl => {
      titleEl.setAttribute('fill', newColor);
    });
  });
  
  // Update level numbers
  groups.forEach(group => {
    const levelElements = svg.querySelectorAll(`.level-numbers-${group.tag}`);
    const newColor = getGroupColor(group.tag);
    levelElements.forEach(levelEl => {
      levelEl.setAttribute('fill', newColor);
    });
  });
  
  // Node titles remain black (already set in CSS variable)
}

function initialize() {
  // Initialize theme
  const theme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  
  // Set initial theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    const color = theme === 'dark' ? metaThemeColor.getAttribute('data-theme-color-dark') : metaThemeColor.getAttribute('data-theme-color-light');
    metaThemeColor.setAttribute('content', color);
  }

  let animationOrder = 0;
  groups.forEach((group) => {
    animationOrder = createCustomCircles(group, animationOrder);
  });

  const initialVbSize = 640 * state.getScale();
  const initialVbX = 320 - initialVbSize / 2;
  const initialVbY = 730 - initialVbSize / 2;
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
    setTimeout(() => animation.tryPlay(), 100),
  );

  const replayBtn = document.getElementById("replay-btn");
  replayBtn.addEventListener("click", () => animation.replay());

  const themeBtn = document.getElementById("theme-btn");
  themeBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update theme-color meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const color = newTheme === 'dark' ? metaThemeColor.getAttribute('data-theme-color-dark') : metaThemeColor.getAttribute('data-theme-color-light');
      metaThemeColor.setAttribute('content', color);
    }
    
    // Update circle colors
    updateCircleColors();
  });
}

initialize();
