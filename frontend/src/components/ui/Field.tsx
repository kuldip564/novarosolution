import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function Field({ id, label, error, hint, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`field ${error ? "field-error" : ""}`.trim()}>
      <label htmlFor={id}>{label}</label>
      <div className="field-control" data-describedby={describedBy}>
        {children}
      </div>
      {hint && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field-error-msg" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export function Input({ error, className = "", ...props }: InputProps) {
  return (
    <input
      className={`field-input ${className}`.trim()}
      aria-invalid={error || undefined}
      {...props}
    />
  );
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
};

export function TextArea({ error, className = "", ...props }: TextAreaProps) {
  return (
    <textarea
      className={`field-input ${className}`.trim()}
      aria-invalid={error || undefined}
      {...props}
    />
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: boolean;
};

export function Select({ error, className = "", children, ...props }: SelectProps) {
  return (
    <select
      className={`field-input ${className}`.trim()}
      aria-invalid={error || undefined}
      {...props}
    >
      {children}
    </select>
  );
}
