"use client";

type StringListEditorProps = {
  label: string;
  hint?: string;
  value: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
};

export function StringListEditor({
  label,
  hint,
  value,
  onChange,
  placeholder = "Add item…",
  addLabel = "+ Add item",
}: StringListEditorProps) {
  function update(index: number, text: string) {
    onChange(value.map((item, i) => (i === index ? text : item)));
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...value, ""]);
  }

  return (
    <div className="admin-field">
      <div className="admin-field-head">
        <span>{label}</span>
        <button type="button" className="admin-btn ghost small" onClick={add}>
          {addLabel}
        </button>
      </div>
      {hint && <p className="admin-field-hint">{hint}</p>}
      {value.length === 0 ? (
        <div className="admin-inline-empty">No items yet.</div>
      ) : (
        <div className="admin-string-list">
          {value.map((item, index) => (
            <div key={index} className="admin-string-row">
              <input
                value={item}
                placeholder={placeholder}
                onChange={(e) => update(index, e.target.value)}
              />
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
