import React, { useState } from "react";
import {
  Search,
  RotateCcw,
  Mail,
  Play,
  Pause,
  Layers,
  Sparkles,
  Sliders,
  X,
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
  showLabels,
  onToggleLabels,
  onSetViewPreset,
  searchInputRef,
}) {
  const [isControlsOpen, setIsControlsOpen] = useState(false);

  const filterPills = [
    { id: "all", label: "All Systems" },
    { id: "piscine", label: "Piscine" },
    { id: "common", label: "Common Core" },
    { id: "outer", label: "Outer Projects" },
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
              <span className="logo-text">molasz-a | Solar System</span>
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
                onChange={(e) => {
                  onSearchChange(e.target.value);
                }}
              />
              {searchQuery && (
                <button
                  className="search-clear-btn"
                  onClick={() => {
                    onSearchChange("");
                  }}
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="header-right">
            <button
              className="btn btn-desktop-only"
              onClick={() => onSetViewPreset("reset")}
              title="Reset Camera"
            >
              <RotateCcw size={16} />
              <span>Reset View</span>
            </button>

            <a
              href="mailto:molasz.dev@gmail.com"
              className="btn btn-contact"
              title="Contact Email"
            >
              <Mail size={16} />
              <span className="email-text">molasz.dev@gmail.com</span>
            </a>

            <button
              className={`btn btn-toggle-controls ${isControlsOpen ? "active" : ""}`}
              onClick={() => setIsControlsOpen((prev) => !prev)}
              title="Toggle Controls"
            >
              <Sliders size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className={`floating-controls ${isControlsOpen ? "mobile-open" : ""}`}>
        <div className="controls-card">
          <div className="controls-card-header">
            <span className="controls-card-title">System Controls</span>
            <button
              className="controls-card-close"
              onClick={() => setIsControlsOpen(false)}
            >
              <X size={14} />
            </button>
          </div>

          <div className="control-row">
            <span>Camera View</span>
            <div className="speed-btns">
              <button
                className="btn-sm"
                onClick={() => {
                  onSetViewPreset("core");
                  setIsControlsOpen(false);
                }}
              >
                Core
              </button>
              <button
                className="btn-sm"
                onClick={() => {
                  onSetViewPreset("outer");
                  setIsControlsOpen(false);
                }}
              >
                Outer
              </button>
              <button
                className="btn-sm"
                onClick={() => {
                  onSetViewPreset("top");
                  setIsControlsOpen(false);
                }}
              >
                Top Map
              </button>
            </div>
          </div>

          <div className="control-row">
            <span>Orbit Motion</span>
            <button
              className={`btn-sm ${isOrbitPaused ? "active" : ""}`}
              onClick={onToggleOrbit}
            >
              {isOrbitPaused ? <Play size={12} /> : <Pause size={12} />}
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
            <span>Display Toggles</span>
            <div className="speed-btns">
              <button
                className={`btn-sm ${showOrbits ? "active" : ""}`}
                onClick={onToggleOrbits}
                title="Toggle orbit rings"
              >
                <Layers size={12} />
                <span>Orbits</span>
              </button>
              <button
                className={`btn-sm ${showLabels ? "active" : ""}`}
                onClick={onToggleLabels}
                title="Toggle planet labels"
              >
                <Sparkles size={12} />
                <span>Tags</span>
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
