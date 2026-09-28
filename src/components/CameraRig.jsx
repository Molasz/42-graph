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
  return new THREE.Vector3(0, r * 3.2 + 18, r * 5.5 + 38);
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
  const lastPlanetPosRef = useRef(null);

  const focusId = targetFocus?.id ?? null;
  const focusRadius = targetFocus?.radius;
  const focusToken = targetFocus?.token ?? focusId;

  const animateCamera = useCallback(
    (position, target, duration = 1000, easing = Easing.Cubic.InOut) => {
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
    },
    [camera]
  );

  // Animació intro inicial
  useEffect(() => {
    camera.position.set(0, 450, 750);
    animateCamera(DEFAULT_CAM_POS, DEFAULT_TARGET, 2000, Easing.Quadratic.Out);
  }, [camera, animateCamera]);

  // Presets de càmera seleccionats des del HUD (Core, Outer, Top Map, Reset)
  useEffect(() => {
    if (!viewPreset || !VIEW_PRESETS[viewPreset]) return;
    const preset = VIEW_PRESETS[viewPreset];
    lastPlanetPosRef.current = null;
    animateCamera(preset.position, preset.target);
    onResetViewPreset();
  }, [viewPreset, animateCamera, onResetViewPreset]);

  // Zoom suau cap al planeta seleccionat en fer click o canviar de selecció
  useEffect(() => {
    if (!focusId) {
      lastPlanetPosRef.current = null;
      return;
    }

    const livePos = resolveFocusPosition(targetFocus);
    if (!livePos) return;

    lastPlanetPosRef.current = new THREE.Vector3(livePos[0], livePos[1], livePos[2]);

    const offset = cameraOffsetForRadius(focusRadius);
    const targetCamPos = new THREE.Vector3(livePos[0], livePos[1], livePos[2]).add(offset);

    animateCamera(
      { x: targetCamPos.x, y: targetCamPos.y, z: targetCamPos.z },
      { x: livePos[0], y: livePos[1], z: livePos[2] },
      900,
      Easing.Cubic.Out
    );
  }, [focusId, focusRadius, focusToken, animateCamera, targetFocus]);

  useFrame(() => {
    tweenGroup.update();

    // Seguir el planeta en la seva òrbita en temps real un cop acabat el tween
    if (focusId && focusId !== "sun_42") {
      const currentPosArray = getPlanetPosition(focusId);
      if (currentPosArray) {
        if (!animatingRef.current && lastPlanetPosRef.current) {
          const deltaX = currentPosArray[0] - lastPlanetPosRef.current.x;
          const deltaY = currentPosArray[1] - lastPlanetPosRef.current.y;
          const deltaZ = currentPosArray[2] - lastPlanetPosRef.current.z;

          camera.position.x += deltaX;
          camera.position.y += deltaY;
          camera.position.z += deltaZ;

          if (controlsRef.current) {
            controlsRef.current.target.x += deltaX;
            controlsRef.current.target.y += deltaY;
            controlsRef.current.target.z += deltaZ;
          }
        }

        if (!lastPlanetPosRef.current) {
          lastPlanetPosRef.current = new THREE.Vector3();
        }
        lastPlanetPosRef.current.set(currentPosArray[0], currentPosArray[1], currentPosArray[2]);
      }
    }

    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={15}
      maxDistance={950}
      maxPolarAngle={Math.PI * 0.88}
    />
  );
}
