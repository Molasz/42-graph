"use strict";

import { ANIM_FADE, introPlayed, setIntroPlayed } from "./config.js";

const ANIM_REGISTRY = [];
const ANIM_STEP_DELAY = 100; // ms between each animation step

export function registerAnim(el, order) {
  el.style.opacity = "0";
  el.style.pointerEvents = "none";
  ANIM_REGISTRY.push({ el, order });
}

export function playIntro() {
  ANIM_REGISTRY.sort((a, b) => a.order - b.order);
  for (let i = 0; i < ANIM_REGISTRY.length; i++) {
    const { el } = ANIM_REGISTRY[i];
    const delay = i * ANIM_STEP_DELAY;
    el.style.animation = `g42FadeIn ${ANIM_FADE}ms ease forwards`;
    el.style.animationDelay = delay + "ms";
    setTimeout(() => {
      el.style.pointerEvents = "auto";
    }, delay);
  }
}

export function replayIntro() {
  for (const { el } of ANIM_REGISTRY) {
    el.style.animation = "none";
    el.style.pointerEvents = "none";
    el.style.opacity = "0";
  }
  setTimeout(() => playIntro(), 100);
}

export function tryPlayIntro() {
  if (
    document.visibilityState === "visible" &&
    ANIM_REGISTRY.length > 0 &&
    !introPlayed
  ) {
    replayIntro();
    setIntroPlayed(true);
    document.removeEventListener("visibilitychange", tryPlayIntro);
  }
}
