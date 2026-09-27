import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { createProceduralPlanetTexture } from "../utils/textureGenerator.js";

export function Sun({ onSelect, onHover }) {
  const sunMeshRef = useRef();

  const texture = useMemo(
    () => createProceduralPlanetTexture("terrestrial", "#14b8a6", "#ffffff"),
    []
  );

  useFrame((_, delta) => {
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
          onHover(sunData, e);
        }}
        onPointerOut={() => onHover(null)}
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

      <Html position={[0, 19, 0]} center distanceFactor={85} style={{ pointerEvents: "none" }}>
        <div
          style={{
            background: "rgba(6, 16, 34, 0.88)",
            border: "1px solid #14b8a6",
            borderRadius: "8px",
            padding: "4px 12px",
            color: "#ffffff",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(6px)",
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ fontWeight: 800, fontSize: "14px", color: "#2dd4bf" }}>42</div>
          <div style={{ fontWeight: 700, fontSize: "8.5px", color: "#ffffff", opacity: 0.85 }}>BARCELONA</div>
        </div>
      </Html>
    </group>
  );
}
