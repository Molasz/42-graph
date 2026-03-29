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

function initialize() {
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
}

initialize();
