import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Starfield() {
  const starsRef = useRef();
  const dustRef = useRef();

  const { starPositions, starColors } = useMemo(() => {
    const count = 8000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#99f6e4"),
      new THREE.Color("#38bdf8"),
      new THREE.Color("#2dd4bf"),
      new THREE.Color("#a7f3d0"),
      new THREE.Color("#e0f2fe"),
    ];

    for (let i = 0; i < count; i++) {
      const radius = 600 + Math.random() * 1200;
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

    return { starPositions: positions, starColors: colors };
  }, []);

  const { dustPositions, dustColors } = useMemo(() => {
    const count = 600;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const dustColor = new THREE.Color("#14b8a6");

    for (let i = 0; i < count; i++) {
      const radius = 30 + Math.random() * 450;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 60;

      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * radius;

      colors[i * 3] = dustColor.r;
      colors[i * 3 + 1] = dustColor.g;
      colors[i * 3 + 2] = dustColor.b;
    }

    return { dustPositions: positions, dustColors: colors };
  }, []);

  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.005;
    }
    if (dustRef.current) {
      dustRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group>
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starPositions.length / 3}
            array={starPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={starColors.length / 3}
            array={starColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={2.0}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points ref={dustRef}>
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
          size={3.5}
          vertexColors
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
