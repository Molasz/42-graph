import React from "react";
import {
  Search,
  RotateCcw,
  Mail,
  Play,
  Pause,
} from "lucide-react";

export function HUD({
  searchQuery,
  onSearchChange,
  activeGroup,
  onSelectGroup,
  isOrbitPaused,
  onToggleOrbit,
  timeSpeed,
  onChangeSpeed,
  showOrbits,
  onToggleOrbits,
  showConstellations,
  onToggleConstellations,
  showLabels,
  onToggleLabels,
  onSetViewPreset,
  searchInputRef,
}) {
  const filterPills = [
    { id: "all", label: "All Systems" },
    { id: "piscine", label: "Piscine Bootcamp" },
    { id: "common", label: "Common Core" },
    { id: "outer_asm", label: "Low-Level & ASM" },
    { id: "outer_sys", label: "UNIX & Systems" },
    { id: "outer_hardware", label: "Hardware & Embedded" },
    { id: "tools", label: "Tools & Config" },
    { id: "work", label: "Work Experience" },
  ];

  return (
    <>
      <header>
        <div className="header-container">
          <div className="header-left">
            <a
              href="https://github.com/Molasz/42"
              target="_blank"
              rel="noopener noreferrer"
              className="logo-badge"
            >
              <div className="logo-icon">42</div>
              <span>molasz-a | Solar System</span>
            </a>
          </div>

          <div className="header-center">
            <div className="search-wrapper">
              <Search className="search-icon" size={16} />
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder="Search projects, skills, tech (e.g. C++, Docker, Minishell)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          <div className="header-right">
            <button
              className="btn"
              onClick={() => onSetViewPreset("reset")}
              title="Reset Camera"
            >
              <RotateCcw size={16} />
              <span>Reset View</span>
            </button>

            <a
              href="mailto:molasz.dev@gmail.com"
              className="btn"
              title="Contact Email"
            >
              <Mail size={16} />
              <span className="email-text">molasz.dev@gmail.com</span>
            </a>
          </div>
        </div>
      </header>

      <div className="floating-controls">
        <div className="controls-card">
          <div className="control-row">
            <span>Camera Angle</span>
            <div className="speed-btns">
              <button
                className="btn"
                style={{ height: "24px", padding: "0 6px", fontSize: "10px" }}
                onClick={() => onSetViewPreset("core")}
              >
                Core
              </button>
              <button
                className="btn"
                style={{ height: "24px", padding: "0 6px", fontSize: "10px" }}
                onClick={() => onSetViewPreset("outer")}
              >
                Outer
              </button>
              <button
                className="btn"
                style={{ height: "24px", padding: "0 6px", fontSize: "10px" }}
                onClick={() => onSetViewPreset("top")}
              >
                Top Map
              </button>
            </div>
          </div>

          <div className="control-row">
            <span>Orbit Motion</span>
            <button
              className={`btn ${isOrbitPaused ? "active" : ""}`}
              style={{ height: "24px", padding: "0 8px", fontSize: "10px" }}
              onClick={onToggleOrbit}
            >
              {isOrbitPaused ? <Play size={10} /> : <Pause size={10} />}
              <span>{isOrbitPaused ? "Resume" : "Pause"}</span>
            </button>
          </div>

          <div className="control-row">
            <span>Orbit Speed</span>
            <div className="speed-btns">
              {[0.5, 1.0, 2.0, 4.0].map((spd) => (
                <button
                  key={spd}
                  className={`speed-btn ${timeSpeed === spd ? "active" : ""}`}
                  onClick={() => onChangeSpeed(spd)}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          <div className="control-row">
            <span>Visual Overlays</span>
            <div className="speed-btns">
              <button
                className={`btn ${showOrbits ? "active" : ""}`}
                style={{ height: "24px", padding: "0 6px", fontSize: "10px" }}
                onClick={onToggleOrbits}
              >
                Orbits
              </button>
              <button
                className={`btn ${showConstellations ? "active" : ""}`}
                style={{ height: "24px", padding: "0 6px", fontSize: "10px" }}
                onClick={onToggleConstellations}
              >
                Links
              </button>
              <button
                className={`btn ${showLabels ? "active" : ""}`}
                style={{ height: "24px", padding: "0 6px", fontSize: "10px" }}
                onClick={onToggleLabels}
              >
                Tags
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav className="filter-bar">
        {filterPills.map((p) => (
          <button
            key={p.id}
            className={`filter-pill ${activeGroup === p.id ? "active" : ""}`}
            onClick={() => onSelectGroup(p.id)}
          >
            {p.label}
          </button>
        ))}
      </nav>
    </>
  );
}
