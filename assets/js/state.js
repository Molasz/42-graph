"use strict";

class State {
  constructor() {
    this.scale = 3;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.startVbX = 0;
    this.startVbY = 0;
    this.introPlayed = false;
  }

  getScale() {
    return this.scale;
  }

  isDragging() {
    return this.isDragging;
  }

  getStartCoords() {
    return { x: this.startX, y: this.startY };
  }

  getStartViewbox() {
    return { x: this.startVbX, y: this.startVbY };
  }

  hasIntroPlayed() {
    return this.introPlayed;
  }

  setScale(newScale) {
    this.scale = newScale;
  }

  setDragging(dragging) {
    this.isDragging = dragging;
  }

  setStartCoords(x, y) {
    this.startX = x;
    this.startY = y;
  }

  setStartViewbox(x, y) {
    this.startVbX = x;
    this.startVbY = y;
  }

  setIntroPlayed(played) {
    this.introPlayed = played;
  }
}

export const state = new State();
