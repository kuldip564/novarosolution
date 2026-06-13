"use client";

import type { ProjectResultMetric } from "@/lib/project-form";

type ResultMetricsEditorProps = {
  label?: string;
  value: ProjectResultMetric[];
  onChange: (metrics: ProjectResultMetric[]) => void;
};

export function ResultMetricsEditor({
  label = "Results",
  value,
  onChange,
}: ResultMetricsEditorProps) {
  function update(index: number, patch: Partial<ProjectResultMetric>) {
    onChange(value.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...value, { value: "", label: "" }]);
  }

  return (
    <div className="admin-field">
      <div className="admin-field-head">
        <span>{label}</span>
        <button type="button" className="admin-btn ghost small" onClick={add}>
          + Add result
        </button>
      </div>
      <p className="admin-field-hint">
        Key metrics shown in the case study drawer (e.g. -72% / load time).
      </p>

      {value.length === 0 ? (
        <div className="admin-inline-empty">No results yet — add your first metric.</div>
      ) : (
        <div className="admin-metric-list">
          {value.map((row, index) => (
            <div key={index} className="admin-metric-row">
              <label>
                <span>Value</span>
                <input
                  value={row.value}
                  placeholder="-72%"
                  onChange={(e) => update(index, { value: e.target.value })}
                />
              </label>
              <label>
                <span>Label</span>
                <input
                  value={row.label}
                  placeholder="load time"
                  onChange={(e) => update(index, { label: e.target.value })}
                />
              </label>
              <button type="button" className="admin-btn danger small" onClick={() => remove(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
