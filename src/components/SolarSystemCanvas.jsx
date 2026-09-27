import React from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Sun } from "./Sun.jsx";
import { Planet } from "./Planet.jsx";
import { Orbits } from "./Orbits.jsx";
import { Starfield } from "./Starfield.jsx";
import { CameraRig } from "./CameraRig.jsx";
import { projects, groupsInfo } from "../data/projectsData.js";

export function SolarSystemCanvas({
  selectedPlanet,
  onSelectPlanet,
  onHoverPlanet,
  searchQuery,
  activeGroup,
  isOrbitPaused,
  timeSpeed,
  showLabels,
  showOrbits = true,
  viewPreset,
  onResetViewPreset,
}) {
  const searchLower = searchQuery.trim().toLowerCase();

  const isPlanetDimmed = (p) => {
    const titleMatches = Array.isArray(p.title)
      ? p.title.join(" ").toLowerCase().includes(searchLower)
      : p.title.toLowerCase().includes(searchLower);
    const nameMatches = p.name ? p.name.toLowerCase().includes(searchLower) : false;
    const descMatches = p.desc ? p.desc.toLowerCase().includes(searchLower) : false;
    const tagsMatch = p.tags
      ? p.tags.some((t) => t.toLowerCase().includes(searchLower))
      : false;

    const matchesSearch = !searchLower || titleMatches || nameMatches || descMatches || tagsMatch;
    const matchesGroup =
      activeGroup === "all" ||
      p.group === activeGroup ||
      (groupsInfo[p.group] && groupsInfo[p.group].category === activeGroup);

    return !(matchesSearch && matchesGroup);
  };

  const targetFocus = selectedPlanet
    ? {
        position:
          selectedPlanet.isSun
            ? [0, 0, 0]
            : [
                Math.cos(selectedPlanet.initialAngle || 0) * (selectedPlanet.orbitRadius || 50),
                0,
                Math.sin(selectedPlanet.initialAngle || 0) * (selectedPlanet.orbitRadius || 50),
              ],
        radius: selectedPlanet.radius || (selectedPlanet.isSun ? 14 : 6),
      }
    : null;

  return (
    <Canvas
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1,
      }}
      dpr={[1, 2]}
      camera={{ position: [0, 130, 240], fov: 45, near: 1, far: 3000 }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.25,
      }}
      onPointerMissed={() => {
        onHoverPlanet(null);
      }}
    >
      <color attach="background" args={["#060c18"]} />
      <fogExp2 attach="fog" args={["#060c18", 0.0006]} />

      <ambientLight color={0x0c2538} intensity={1.8} />
      <directionalLight color={0x14b8a6} intensity={0.8} position={[0, 200, 100]} />
      <directionalLight color={0x0284c7} intensity={0.5} position={[0, -100, -100]} />

      <Starfield />

      <Sun
        onSelect={(data, pos) => onSelectPlanet(data, pos)}
        onHover={(data, e) => onHoverPlanet(data, e)}
      />

      {projects.map((p) => (
        <Planet
          key={p.id}
          data={p}
          isOrbitPaused={isOrbitPaused}
          timeSpeed={timeSpeed}
          isSelected={selectedPlanet?.id === p.id}
          isDimmed={isPlanetDimmed(p)}
          showLabels={showLabels}
          onSelect={(data, pos) => onSelectPlanet(data, pos)}
          onHover={(data, e) => onHoverPlanet(data, e)}
        />
      ))}

      <Orbits visible={showOrbits} />

      <CameraRig
        targetFocus={targetFocus}
        viewPreset={viewPreset}
        onResetViewPreset={onResetViewPreset}
      />
    </Canvas>
  );
}
