"use strict";

import { ANIM_GROUPS, ANIM_FADE, ANIM_STEP, introPlayed, setIntroPlayed } from "./config.js";

const ANIM_REGISTRY = [];

export function registerAnim(el, group) {
  el.style.opacity = "0";
  el.style.pointerEvents = "none";
  ANIM_REGISTRY.push({ el, group });
}

export function playIntro() {
  for (const { el, group } of ANIM_REGISTRY) {
    const step = ANIM_GROUPS.indexOf(group);
    if (step === -1) continue;
    const delay = step * ANIM_STEP;
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
