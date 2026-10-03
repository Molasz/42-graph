import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  createProceduralPlanetTexture,
  createRingTexture,
} from "../utils/textureGenerator.js";
import { groupsInfo } from "../data/projectsData.js";
import { PlanetLabel } from "./PlanetLabel.jsx";
import { setPlanetPosition } from "../utils/planetPositions.js";

const noRaycast = () => {};

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
            float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
            gl_FragColor = vec4(color, intensity * 0.75);
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

    setPlanetPosition(data.id, x, 0, z);

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

  const handleClick = (e) => {
    e.stopPropagation();
    const pos = groupRef.current
      ? [groupRef.current.position.x, groupRef.current.position.y, groupRef.current.position.z]
      : (() => {
          const angle = angleRef.current;
          const r = data.orbitRadius || 50;
          return [Math.cos(angle) * r, 0, Math.sin(angle) * r];
        })();
    onSelect(data, pos);
  };

  const titleText = Array.isArray(data.title) ? data.title.join(" ") : data.title;
  const rankTag =
    data.rank !== undefined && data.rank >= 0
      ? `Rank ${data.rank}`
      : (data.tags && data.tags[0]) || "";

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          onHover(data, e);
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
          onHover(null);
        }}
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
        <mesh raycast={noRaycast} material={atmosphereMaterial}>
          <sphereGeometry args={[(data.radius || 6) * 1.15, 24, 24]} />
        </mesh>
      )}

      {data.ring && (
        <mesh
          ref={ringRef}
          rotation={[Math.PI * 0.45, Math.PI * 0.1, 0]}
          onClick={handleClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
            onHover(data, e);
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
            onHover(null);
          }}
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
        <group>
          <mesh raycast={noRaycast} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry
              args={[(data.radius || 6) * 1.35, (data.radius || 6) * 1.5, 64]}
            />
            <meshBasicMaterial
              color={colorHex || 0x10ecd3}
              side={THREE.DoubleSide}
              transparent
              opacity={0.95}
              depthTest={false}
            />
          </mesh>
          <mesh raycast={noRaycast} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry
              args={[(data.radius || 6) * 1.6, (data.radius || 6) * 1.7, 64]}
            />
            <meshBasicMaterial
              color="#ffffff"
              side={THREE.DoubleSide}
              transparent
              opacity={0.45}
              depthTest={false}
            />
          </mesh>
        </group>
      )}

      {showLabels && !isDimmed && (
        <PlanetLabel
          position={[0, (data.radius || 6) + 5, 0]}
          color={colorHex}
          title={titleText}
          subtitle={rankTag ? rankTag.toUpperCase() : ""}
        />
      )}
    </group>
  );
}
