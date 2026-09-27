import React, { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";

export function CameraRig({ targetFocus, viewPreset, onResetViewPreset }) {
  const { camera } = useThree();
  const controlsRef = useRef();

  const defaultCamPos = { x: 0, y: 130, z: 240 };

  useEffect(() => {
    camera.position.set(0, 450, 750);
    new TWEEN.Tween(camera.position)
      .to(defaultCamPos, 2000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();
  }, [camera]);

  useEffect(() => {
    if (!controlsRef.current) return;

    if (viewPreset === "reset") {
      new TWEEN.Tween(camera.position)
        .to(defaultCamPos, 1000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();
      new TWEEN.Tween(controlsRef.current.target)
        .to({ x: 0, y: 0, z: 0 }, 1000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();
      onResetViewPreset();
    } else if (viewPreset === "top") {
      new TWEEN.Tween(camera.position)
        .to({ x: 0, y: 340, z: 0.1 }, 1000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();
      new TWEEN.Tween(controlsRef.current.target)
        .to({ x: 0, y: 0, z: 0 }, 1000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();
      onResetViewPreset();
    } else if (viewPreset === "core") {
      new TWEEN.Tween(camera.position)
        .to({ x: 0, y: 50, z: 90 }, 1000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();
      new TWEEN.Tween(controlsRef.current.target)
        .to({ x: 0, y: 0, z: 0 }, 1000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();
      onResetViewPreset();
    } else if (viewPreset === "outer") {
      new TWEEN.Tween(camera.position)
        .to({ x: 140, y: 110, z: 230 }, 1000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();
      new TWEEN.Tween(controlsRef.current.target)
        .to({ x: 0, y: 0, z: 0 }, 1000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();
      onResetViewPreset();
    }
  }, [viewPreset, camera, onResetViewPreset]);

  useEffect(() => {
    if (!targetFocus || !controlsRef.current) return;

    const { position, radius } = targetFocus;
    const r = radius || 6;
    const targetOffset = new THREE.Vector3(0, r * 1.8, r * 3.8);
    const targetCamPos = new THREE.Vector3(position[0], position[1], position[2]).add(targetOffset);

    new TWEEN.Tween(camera.position)
      .to({ x: targetCamPos.x, y: targetCamPos.y, z: targetCamPos.z }, 1000)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();

    new TWEEN.Tween(controlsRef.current.target)
      .to({ x: position[0], y: position[1], z: position[2] }, 1000)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();
  }, [targetFocus, camera]);

  useFrame(() => {
    TWEEN.update();
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
