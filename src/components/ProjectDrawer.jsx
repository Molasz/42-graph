import React from "react";
import { X, ExternalLink, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { groupsInfo, projects } from "../data/projectsData.js";

export function ProjectDrawer({
  selectedPlanet,
  onClose,
  onSelectProjectById,
}) {
  if (!selectedPlanet) return null;

  const data = selectedPlanet;
  const title = Array.isArray(data.title) ? data.title.join(" ") : data.title || data.name;
  const groupMeta = groupsInfo[data.group] || { title: data.group || "42 System", color: "#10ecd3" };
  const rankLabel =
    data.rank !== undefined && data.rank >= 0
      ? `Rank ${data.rank} • ${groupMeta.title}`
      : groupMeta.title;

  const currentIndex = projects.findIndex((p) => p.id === data.id);

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + projects.length) % projects.length;
    onSelectProjectById(projects[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % projects.length;
    onSelectProjectById(projects[nextIdx].id);
  };

  return (
    <aside id="detail-drawer" className="open" aria-label="Project Details">
      <div className="drawer-header">
        <div>
          <span
            className="drawer-badge"
            style={{
              color: data.color || groupMeta.color,
              borderColor: data.color || groupMeta.color,
            }}
          >
            {rankLabel}
          </span>
          <h2 className="drawer-title">{title}</h2>
        </div>
        <button
          className="drawer-close"
          onClick={onClose}
          title="Close Drawer (Esc)"
        >
          <X size={20} />
        </button>
      </div>

      {data.tags && data.tags.length > 0 && (
        <div className="drawer-tags">
          {data.tags.map((t, idx) => (
            <span key={idx} className="drawer-tag-pill">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="drawer-section-title">Overview</div>
      <p className="drawer-desc">{data.desc || ""}</p>

      <div className="drawer-actions">
        {data.link && (
          <a
            href={data.link}
            target="_blank"
            rel="noopener noreferrer"
            download={data.isDownload ? "CV_molasz.pdf" : undefined}
            className="drawer-link-btn"
          >
            {data.isDownload ? (
              <>
                <Download size={16} />
                <span>Download Curriculum Vitae (PDF)</span>
              </>
            ) : (
              <>
                <ExternalLink size={16} />
                <span>View Project on GitHub</span>
              </>
            )}
          </a>
        )}

        <div className="drawer-nav-btns">
          <button className="drawer-nav-btn" onClick={handlePrev}>
            <ChevronLeft size={14} style={{ display: "inline", verticalAlign: "middle" }} /> Previous
          </button>
          <button className="drawer-nav-btn" onClick={handleNext}>
            Next <ChevronRight size={14} style={{ display: "inline", verticalAlign: "middle" }} />
          </button>
        </div>
      </div>
    </aside>
  );
}
