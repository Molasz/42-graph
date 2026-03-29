"use strict";

import { ANIM_FADE } from "./config.js";
import { state } from "./state.js";

const ANIM_STEP_DELAY = 100; // ms between each animation step

class Animation {
  constructor() {
    this.registry = [];
  }

  register(el, order) {
    el.style.opacity = "0";
    el.style.pointerEvents = "none";
    this.registry.push({ el, order });
  }

  play() {
    this.registry.sort((a, b) => a.order - b.order);
    for (let i = 0; i < this.registry.length; i++) {
      const { el } = this.registry[i];
      const delay = i * ANIM_STEP_DELAY;
      el.style.animation = `g42FadeIn ${ANIM_FADE}ms ease forwards`;
      el.style.animationDelay = delay + "ms";
      setTimeout(() => {
        el.style.pointerEvents = "auto";
      }, delay);
    }
    const totalAnimTime =
      this.registry.length * ANIM_STEP_DELAY + ANIM_FADE + 300;
    setTimeout(() => {
      const replayBtn = document.getElementById("replay-btn");
      replayBtn.classList.remove("hiding");
    }, totalAnimTime);
  }

  replay() {
    const replayBtn = document.getElementById("replay-btn");
    replayBtn.classList.add("hiding");
    for (const { el } of this.registry) {
      el.style.animation = "none";
      el.style.pointerEvents = "none";
      el.style.opacity = "0";
    }
    setTimeout(() => this.play(), 100);
  }

  tryPlay() {
    if (
      document.visibilityState === "visible" &&
      this.registry.length > 0 &&
      !state.hasIntroPlayed()
    ) {
      this.replay();
      state.setIntroPlayed(true);
      document.removeEventListener("visibilitychange", () => this.tryPlay());
    }
  }
}

export const animation = new Animation();
