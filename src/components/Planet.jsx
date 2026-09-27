import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import {
  createProceduralPlanetTexture,
  createRingTexture,
} from "../utils/textureGenerator.js";
import { groupsInfo } from "../data/projectsData.js";

export function Planet({
  data,
  isOrbitPaused,
  timeSpeed,
  isSelected,
  isDimmed,
  showLabels,
  onSelect,
  onHover,
}) {
  const groupRef = useRef();
  const meshRef = useRef();
  const ringRef = useRef();
  const angleRef = useRef(data.initialAngle || 0);

  const groupMeta = groupsInfo[data.group] || groupsInfo.common;
  const colorHex = data.color || groupMeta.color;
  const emissiveHex = groupMeta.emissive || colorHex;

  const texture = useMemo(
    () => createProceduralPlanetTexture(data.textureType, colorHex, "#ffffff"),
    [data.textureType, colorHex]
  );

  const ringTexture = useMemo(
    () => (data.ring ? createRingTexture(data.ringColor || colorHex) : null),
    [data.ring, data.ringColor, colorHex]
  );

  const atmosphereMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(data.glowColor || colorHex) },
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
            float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
            gl_FragColor = vec4(color, intensity * 0.7);
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      }),
    [data.glowColor, colorHex]
  );

  useFrame((_, delta) => {
    if (!isOrbitPaused) {
      angleRef.current += (data.orbitSpeed || 0.1) * 0.25 * delta * timeSpeed;
    }

    const angle = angleRef.current;
    const r = data.orbitRadius || 50;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;

    if (groupRef.current) {
      groupRef.current.position.set(x, 0, z);
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.08;
    }
  });

  const titleText = Array.isArray(data.title) ? data.title.join(" ") : data.title;
  const rankTag =
    data.rank !== undefined && data.rank >= 0
      ? `Rank ${data.rank}`
      : (data.tags && data.tags[0]) || "";

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          const angle = angleRef.current;
          const r = data.orbitRadius || 50;
          const pos = [Math.cos(angle) * r, 0, Math.sin(angle) * r];
          onSelect(data, pos);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(data, e);
        }}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[data.radius || 6, 32, 32]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.55}
          metalness={0.25}
          emissive={new THREE.Color(emissiveHex)}
          emissiveIntensity={isSelected ? 1.0 : isDimmed ? 0.08 : 0.35}
          transparent={isDimmed}
          opacity={isDimmed ? 0.25 : 1.0}
        />
      </mesh>

      {!isDimmed && (
        <mesh material={atmosphereMaterial}>
          <sphereGeometry args={[(data.radius || 6) * 1.15, 24, 24]} />
        </mesh>
      )}

      {data.ring && (
        <mesh
          ref={ringRef}
          rotation={[Math.PI * 0.45, Math.PI * 0.1, 0]}
        >
          <ringGeometry
            args={[
              data.ringInnerRadius || (data.radius || 6) * 1.4,
              data.ringOuterRadius || (data.radius || 6) * 2.2,
              48,
            ]}
          />
          <meshBasicMaterial
            map={ringTexture}
            side={THREE.DoubleSide}
            transparent
            opacity={isDimmed ? 0.15 : 0.85}
            depthWrite={false}
          />
        </mesh>
      )}

      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry
            args={[(data.radius || 6) * 1.35, (data.radius || 6) * 1.45, 36]}
          />
          <meshBasicMaterial
            color={0xffffff}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
            depthTest={false}
          />
        </mesh>
      )}

      {showLabels && !isDimmed && (
        <Html
          position={[0, (data.radius || 6) + 5, 0]}
          center
          distanceFactor={85}
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          <div
            style={{
              background: "rgba(6, 16, 34, 0.88)",
              border: `1px solid ${colorHex}`,
              borderRadius: "8px",
              padding: "4px 12px",
              color: "#ffffff",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.6)",
              backdropFilter: "blur(6px)",
              whiteSpace: "nowrap",
            }}
          >
            <div style={{ fontWeight: 800, fontSize: "13px", color: "#ffffff" }}>
              {titleText}
            </div>
            {rankTag && (
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "9px",
                  color: colorHex,
                  letterSpacing: "0.5px",
                }}
              >
                {rankTag.toUpperCase()}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
