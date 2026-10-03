import React, { useState, useEffect, useRef, useCallback } from "react";
import { SolarSystemCanvas } from "./components/SolarSystemCanvas.jsx";
import { WebGLGuard } from "./components/WebGLGuard.jsx";
import { HUD } from "./components/HUD.jsx";
import { ProjectDrawer } from "./components/ProjectDrawer.jsx";
import { Tooltip } from "./components/Tooltip.jsx";
import { projects } from "./data/projectsData.js";

export function App() {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [hoveredData, setHoveredData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState("all");
  const [isOrbitPaused, setIsOrbitPaused] = useState(false);
  const [timeSpeed, setTimeSpeed] = useState(1.0);
  const [showLabels, setShowLabels] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);
  const [viewPreset, setViewPreset] = useState(null);

  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedPlanet(null);
        setViewPreset("reset");
      } else if (e.key === " " && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        setIsOrbitPaused((prev) => !prev);
      } else if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectPlanet = useCallback((data, position) => {
    setSelectedPlanet({
      ...data,
      currentPosition: position || data.currentPosition || null,
    });
  }, []);

  const handleHoverPlanet = useCallback((data, event) => {
    if (!data || !event) {
      setHoveredData(null);
      return;
    }
    setHoveredData({
      data,
      mousePos: { x: event.clientX, y: event.clientY },
    });
  }, []);

  const handleResetViewPreset = useCallback(() => setViewPreset(null), []);

  const handleSelectProjectById = useCallback((id) => {
    if (id === "sun_42") {
      setSelectedPlanet({
        isSun: true,
        id: "sun_42",
        name: "42 Core (Holy Graph)",
        title: ["42", "Core"],
        group: "common",
        tags: ["Root", "42 Network", "Foundation", "Peer-to-Peer"],
        desc: "The heart of the 42 Network — where peer-to-peer pedagogy, practical problem solving, and software craftsmanship ignite.",
        link: "https://42barcelona.com",
      });
      return;
    }
    const target = projects.find((p) => p.id === id);
    if (target) {
      setSelectedPlanet({
        ...target,
        currentPosition: null,
      });
    }
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      <WebGLGuard>
      <SolarSystemCanvas
        selectedPlanet={selectedPlanet}
        onSelectPlanet={handleSelectPlanet}
        onHoverPlanet={handleHoverPlanet}
        onUserInteract={() => setSelectedPlanet(null)}
        searchQuery={searchQuery}
        activeGroup={activeGroup}
        isOrbitPaused={isOrbitPaused}
        timeSpeed={timeSpeed}
        showLabels={showLabels}
        showOrbits={showOrbits}
        viewPreset={viewPreset}
        onResetViewPreset={handleResetViewPreset}
      />
      </WebGLGuard>

      <HUD
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeGroup={activeGroup}
        onSelectGroup={setActiveGroup}
        isOrbitPaused={isOrbitPaused}
        onToggleOrbit={() => setIsOrbitPaused((prev) => !prev)}
        timeSpeed={timeSpeed}
        onChangeSpeed={setTimeSpeed}
        showOrbits={showOrbits}
        onToggleOrbits={() => setShowOrbits((prev) => !prev)}
        showLabels={showLabels}
        onToggleLabels={() => setShowLabels((prev) => !prev)}
        onSetViewPreset={setViewPreset}
        searchInputRef={searchInputRef}
      />

      <Tooltip hoveredData={hoveredData} />

      <ProjectDrawer
        selectedPlanet={selectedPlanet}
        onClose={() => {
          setSelectedPlanet(null);
          setViewPreset("reset");
        }}
        onSelectProjectById={handleSelectProjectById}
      />
    </div>
  );
}
