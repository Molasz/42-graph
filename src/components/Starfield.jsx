import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Starfield() {
  const deepStarsRef = useRef();
  const midCloudRef = useRef();
  const floatingDustRef = useRef();

  const { deepPositions, deepColors } = useMemo(() => {
    const count = 1800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#dbeafe"),
      new THREE.Color("#93c5fd"),
      new THREE.Color("#99f6e4"),
    ];

    for (let i = 0; i < count; i++) {
      const radius = 600 + Math.random() * 1000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { deepPositions: positions, deepColors: colors };
  }, []);

  const { midPositions, midColors } = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color("#14b8a6"),
      new THREE.Color("#0284c7"),
      new THREE.Color("#5eead4"),
    ];

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 100 + Math.cbrt(Math.random()) * 480;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { midPositions: positions, midColors: colors };
  }, []);

  const { dustPositions, dustColors } = useMemo(() => {
    const count = 180;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const dustColor = new THREE.Color("#5eead4");

    for (let i = 0; i < count; i++) {
      const radius = 60 + Math.random() * 320;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      colors[i * 3] = dustColor.r;
      colors[i * 3 + 1] = dustColor.g;
      colors[i * 3 + 2] = dustColor.b;
    }

    return { dustPositions: positions, dustColors: colors };
  }, []);

  useFrame((_, delta) => {
    if (deepStarsRef.current) {
      deepStarsRef.current.rotation.y += delta * 0.002;
    }
    if (midCloudRef.current) {
      midCloudRef.current.rotation.y -= delta * 0.005;
    }
    if (floatingDustRef.current) {
      floatingDustRef.current.rotation.y += delta * 0.008;
    }
  });

  return (
    <group>
      <points ref={deepStarsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={deepPositions.length / 3}
            array={deepPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={deepColors.length / 3}
            array={deepColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.6}
          vertexColors
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <points ref={midCloudRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={midPositions.length / 3}
            array={midPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={midColors.length / 3}
            array={midColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={2.0}
          vertexColors
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <points ref={floatingDustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={dustPositions.length / 3}
            array={dustPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={dustColors.length / 3}
            array={dustColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={2.4}
          vertexColors
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
