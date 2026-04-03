"use strict";

import { ANIM_FADE } from "./config.js";
import { state } from "./state.js";

// Constants
const ANIM_STEP_DELAY = 100; // ms between each animation step
const REPLAY_DELAY = 100; // ms to wait before replaying
const POST_ANIM_DELAY = 300; // ms after animation completes
const REPLAY_BTN_ID = "replay-btn";
const HIDING_CLASS = "hiding";

class Animation {
  constructor() {
    this.registry = [];
  }

  /**
   * Register an element for animation
   */
  register(el, order) {
    el.style.opacity = "0";
    el.style.pointerEvents = "none";
    this.registry.push({ el, order });
  }

  /**
   * Play animation for all registered elements
   */
  play() {
    this.registry.sort((a, b) => a.order - b.order);
    
    for (let i = 0; i < this.registry.length; i++) {
      const { el } = this.registry[i];
      const delay = i * ANIM_STEP_DELAY;
      el.style.animation = `g42FadeIn ${ANIM_FADE}ms ease forwards`;
      el.style.animationDelay = `${delay}ms`;
      setTimeout(() => {
        el.style.pointerEvents = "auto";
      }, delay);
    }

    const totalAnimTime = this.registry.length * ANIM_STEP_DELAY + ANIM_FADE + POST_ANIM_DELAY;
    setTimeout(() => {
      const replayBtn = document.getElementById(REPLAY_BTN_ID);
      replayBtn?.classList.remove(HIDING_CLASS);
    }, totalAnimTime);
  }

  /**
   * Replay animation (reset and play again)
   */
  replay() {
    const replayBtn = document.getElementById(REPLAY_BTN_ID);
    replayBtn?.classList.add(HIDING_CLASS);
    
    for (const { el } of this.registry) {
      el.style.animation = "none";
      el.style.pointerEvents = "none";
      el.style.opacity = "0";
    }
    
    setTimeout(() => this.play(), REPLAY_DELAY);
  }

  /**
   * Try to play animation on page load/visibility change
   */
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
