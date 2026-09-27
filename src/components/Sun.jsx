import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { createSunTexture } from "../utils/textureGenerator.js";

export function Sun({ onSelect, isHovered, onHover }) {
  const sunMeshRef = useRef();
  const coronaRef = useRef();
  const outerCoronaRef = useRef();

  const sunTexture = useMemo(() => createSunTexture(), []);

  const coronaMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(0x14b8a6) },
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          uniform float time;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
            gl_FragColor = vec4(color, intensity * 0.85);
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      }),
    []
  );

  const outerCoronaMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(0x0284c7) },
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.55 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
            gl_FragColor = vec4(color, intensity * 0.45);
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      }),
    []
  );

  useFrame((_, delta) => {
    if (sunMeshRef.current) {
      sunMeshRef.current.rotation.y += delta * 0.15;
    }
    if (coronaRef.current) {
      coronaRef.current.material.uniforms.time.value += delta;
      const pulse = 1 + Math.sin(coronaRef.current.material.uniforms.time.value * 2) * 0.04;
      coronaRef.current.scale.set(pulse, pulse, pulse);
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
        <sphereGeometry args={[14, 64, 64]} />
        <meshBasicMaterial map={sunTexture} color={0x2dd4bf} />
      </mesh>

      <pointLight color={0x2dd4bf} intensity={3.5} distance={1200} decay={1.2} />
      <pointLight color={0xffffff} intensity={2.0} distance={800} decay={1.5} />

      <mesh ref={coronaRef} material={coronaMaterial}>
        <sphereGeometry args={[17, 32, 32]} />
      </mesh>

      <mesh ref={outerCoronaRef} material={outerCoronaMaterial}>
        <sphereGeometry args={[21, 32, 32]} />
      </mesh>

      <Html position={[0, 21, 0]} center distanceFactor={90} style={{ pointerEvents: "none" }}>
        <div
          style={{
            background: "rgba(6, 16, 34, 0.9)",
            border: "1px solid #14b8a6",
            borderRadius: "10px",
            padding: "5px 14px",
            color: "#ffffff",
            textAlign: "center",
            boxShadow: "0 0 20px rgba(20, 184, 166, 0.6)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div style={{ fontWeight: 900, fontSize: "18px", color: "#2dd4bf", letterSpacing: "1.5px" }}>42</div>
          <div style={{ fontWeight: 700, fontSize: "9.5px", color: "#ffffff", opacity: 0.9 }}>BARCELONA</div>
        </div>
      </Html>
    </group>
  );
}
