import React from "react";
import { groupsInfo } from "../data/projectsData.js";

export function Tooltip({ hoveredData }) {
  if (!hoveredData || !hoveredData.data || !hoveredData.mousePos) return null;

  const { data, mousePos } = hoveredData;
  const title = Array.isArray(data.title) ? data.title.join(" ") : data.title || data.name;
  const groupMeta = groupsInfo[data.group] || { title: data.group, color: "#10ecd3" };
  const rankText =
    data.rank !== undefined && data.rank >= 0 ? `Rank ${data.rank}` : groupMeta.title;

  return (
    <div
      id="tooltip"
      style={{
        opacity: 1,
        left: `${mousePos.x}px`,
        top: `${mousePos.y}px`,
        borderColor: data.color || groupMeta.color,
      }}
    >
      <div className="tip-title" style={{ color: data.color || groupMeta.color }}>
        {title}
      </div>
      <div className="tip-tags">
        <span
          className="tip-pill"
          style={{
            background: data.color || groupMeta.color,
            color: "#060c18",
          }}
        >
          {rankText}
        </span>
        {data.tags &&
          data.tags.slice(0, 3).map((t, idx) => (
            <span
              key={idx}
              className="tip-pill"
              style={{
                border: `1px solid ${data.color || groupMeta.color}`,
                color: data.color || groupMeta.color,
              }}
            >
              {t}
            </span>
          ))}
      </div>
      <div className="tip-desc">
        {data.desc ? `${data.desc.slice(0, 110)}...` : ""}
      </div>
    </div>
  );
}
