import React, { useMemo } from "react";
import * as THREE from "three";
import { groupsInfo, projects } from "../data/projectsData.js";

export function Orbits({ visible = true }) {
  const orbitRings = useMemo(() => {
    const map = new Map();

    projects.forEach((p) => {
      const r = p.orbitRadius;
      if (!map.has(r)) {
        map.set(r, {
          radius: r,
          group: p.group,
          rank: p.rank,
          color: p.color,
        });
      }
    });

    const segments = 256;
    const rings = [];

    map.forEach(({ radius, group, rank, color }) => {
      const points = [];
      for (let i = 0; i < segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(
          new THREE.Vector3(
            Math.cos(theta) * radius,
            0,
            Math.sin(theta) * radius
          )
        );
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const groupMeta = groupsInfo[group] || groupsInfo.common;
      const ringColor = groupMeta.color || color;

      rings.push({
        radius,
        geometry,
        color: ringColor,
        opacity: group === "common" ? 0.38 : 0.25,
      });
    });

    return rings;
  }, []);

  if (!visible) return null;

  return (
    <group position={[0, 0, 0]}>
      {orbitRings.map((item, idx) => (
        <lineLoop key={idx} geometry={item.geometry}>
          <lineBasicMaterial
            color={new THREE.Color(item.color)}
            transparent
            opacity={item.opacity}
            depthWrite={false}
          />
        </lineLoop>
      ))}
    </group>
  );
}
