import React, { useRef, useEffect, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Tween, Easing, Group } from "@tweenjs/tween.js";
import * as THREE from "three";
import { getPlanetPosition } from "../utils/planetPositions.js";

const tweenGroup = new Group();

const DEFAULT_CAM_POS = { x: 0, y: 130, z: 240 };
const DEFAULT_TARGET = { x: 0, y: 0, z: 0 };

const VIEW_PRESETS = {
  reset: { position: DEFAULT_CAM_POS, target: DEFAULT_TARGET },
  top: { position: { x: 0, y: 340, z: 0.1 }, target: DEFAULT_TARGET },
  core: { position: { x: 0, y: 50, z: 90 }, target: DEFAULT_TARGET },
  outer: { position: { x: 140, y: 110, z: 230 }, target: DEFAULT_TARGET },
};

function cameraOffsetForRadius(radius) {
  const r = radius || 6;
  return new THREE.Vector3(0, Math.max(r * 1.8, 12), Math.max(r * 3.8, 22));
}

function resolveFocusPosition(targetFocus) {
  if (!targetFocus) return null;
  if (targetFocus.id === "sun_42") return [0, 0, 0];
  if (Array.isArray(targetFocus.position) && targetFocus.position.length === 3) {
    return targetFocus.position;
  }
  return getPlanetPosition(targetFocus.id);
}

export function CameraRig({ targetFocus, viewPreset, onResetViewPreset }) {
  const { camera } = useThree();
  const controlsRef = useRef();
  const animatingRef = useRef(false);
  const focusId = targetFocus?.id ?? null;
  const focusRadius = targetFocus?.radius;
  const focusToken = targetFocus?.token ?? focusId;

  const animateCamera = useCallback((position, target, duration = 1000, easing = Easing.Cubic.InOut) => {
    tweenGroup.getAll().forEach((t) => t.stop());
    tweenGroup.removeAll();
    animatingRef.current = true;

    const controls = controlsRef.current;
    if (controls) controls.enabled = false;

    new Tween(camera.position, tweenGroup)
      .to(position, duration)
      .easing(easing)
      .start();

    if (controls) {
      new Tween(controls.target, tweenGroup)
        .to(target, duration)
        .easing(easing)
        .onComplete(() => {
          animatingRef.current = false;
          if (controlsRef.current) controlsRef.current.enabled = true;
        })
        .start();
    } else {
      animatingRef.current = false;
    }
  }, [camera]);

  useEffect(() => {
    camera.position.set(0, 450, 750);
    animateCamera(DEFAULT_CAM_POS, DEFAULT_TARGET, 2000, Easing.Quadratic.Out);
  }, [camera, animateCamera]);

  useEffect(() => {
    if (!viewPreset || !VIEW_PRESETS[viewPreset]) return;
    const preset = VIEW_PRESETS[viewPreset];
    animateCamera(preset.position, preset.target);
    onResetViewPreset();
  }, [viewPreset, animateCamera, onResetViewPreset]);

  useEffect(() => {
    if (!focusId) return;

    const livePos = resolveFocusPosition(targetFocus);
    if (!livePos) return;

    const offset = cameraOffsetForRadius(focusRadius);
    const targetCamPos = new THREE.Vector3(livePos[0], livePos[1], livePos[2]).add(offset);

    animateCamera(
      { x: targetCamPos.x, y: targetCamPos.y, z: targetCamPos.z },
      { x: livePos[0], y: livePos[1], z: livePos[2] },
      1000,
      Easing.Cubic.Out
    );
  }, [focusId, focusRadius, focusToken, animateCamera, targetFocus]);

  useFrame(() => {
    tweenGroup.update();
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={15}
      maxDistance={900}
      maxPolarAngle={Math.PI * 0.88}
    />
  );
}
