import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const MIN_SCALE = 0.82;
const MAX_SCALE = 1.12;
const REFERENCE_DISTANCE = 240;
const FAR_DISTANCE = 720;

export function PlanetLabel({
  position,
  color,
  title,
  subtitle,
  emphasized = false,
}) {
  const groupRef = useRef();
  const elRef = useRef();
  const { camera, size } = useThree();
  const worldPos = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!groupRef.current || !elRef.current) return;

    groupRef.current.getWorldPosition(worldPos);
    const dist = Math.max(camera.position.distanceTo(worldPos), 1);

    const shortest = Math.min(size.width, size.height);
    const responsive = THREE.MathUtils.clamp(shortest / 820, 0.88, 1.1);
    const zoom = THREE.MathUtils.clamp(
      THREE.MathUtils.mapLinear(dist, REFERENCE_DISTANCE, FAR_DISTANCE, 1, MIN_SCALE),
      MIN_SCALE,
      MAX_SCALE
    );
    const scale = Math.round(THREE.MathUtils.clamp(responsive * zoom, MIN_SCALE, MAX_SCALE) * 100) / 100;

    if (elRef.current.dataset.scale !== String(scale)) {
      elRef.current.dataset.scale = String(scale);
      elRef.current.style.setProperty("--label-scale", String(scale));
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Html center style={{ pointerEvents: "none", userSelect: "none" }}>
        <div
          ref={elRef}
          className={`planet-label${emphasized ? " planet-label--sun" : ""}`}
          style={{ borderColor: color }}
        >
          <div
            className="planet-label-title"
            style={emphasized ? { color } : undefined}
          >
            {title}
          </div>
          {subtitle ? (
            <div className="planet-label-sub" style={{ color }}>
              {subtitle}
            </div>
          ) : null}
        </div>
      </Html>
    </group>
  );
}
