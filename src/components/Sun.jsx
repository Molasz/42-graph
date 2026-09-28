import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createProceduralPlanetTexture } from "../utils/textureGenerator.js";
import { PlanetLabel } from "./PlanetLabel.jsx";
import { setPlanetPosition } from "../utils/planetPositions.js";

export function Sun({ onSelect, onHover, showLabels = true }) {
  const sunMeshRef = useRef();

  const texture = useMemo(
    () => createProceduralPlanetTexture("terrestrial", "#14b8a6", "#ffffff"),
    []
  );

  useFrame((_, delta) => {
    setPlanetPosition("sun_42", 0, 0, 0);
    if (sunMeshRef.current) {
      sunMeshRef.current.rotation.y += delta * 0.2;
    }
  });

  const sunData = useMemo(
    () => ({
      isSun: true,
      id: "sun_42",
      name: "42 Core (Holy Graph)",
      title: ["42", "Core"],
      group: "common",
      tags: ["Root", "42 Network", "Foundation", "Peer-to-Peer"],
      desc: "The heart of the 42 Network — where peer-to-peer pedagogy, practical problem solving, and software craftsmanship ignite.",
      link: "https://42barcelona.com",
    }),
    []
  );

  return (
    <group position={[0, 0, 0]}>
      <mesh
        ref={sunMeshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(sunData, [0, 0, 0]);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          onHover(sunData, e);
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
          onHover(null);
        }}
      >
        <sphereGeometry args={[14, 32, 32]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.55}
          metalness={0.25}
          emissive={new THREE.Color(0x0a8074)}
          emissiveIntensity={0.35}
        />
      </mesh>

      {showLabels && (
        <PlanetLabel
          position={[0, 19, 0]}
          color="#14b8a6"
          title="42"
          subtitle="BARCELONA"
          emphasized
        />
      )}
    </group>
  );
}
