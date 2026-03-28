"use strict";

import { svg, scale } from "./config.js";
import { tryPlayIntro, replayIntro } from "./animation.js";
import {
  handleWheel,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
} from "./interaction.js";
import { groups } from "./data.js";
import { createCustomCircles } from "./generator.js";

function initialize() {
  groups.forEach((group) => createCustomCircles(group));

  const initialVbSize = 640 * scale;
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

  document.addEventListener("visibilitychange", tryPlayIntro);
  window.addEventListener("load", () => setTimeout(tryPlayIntro, 100));

  window.replayIntro = replayIntro;
}

initialize();
