'use client';

export function ToolbarBtn({ active, disabled, title, onClick, children }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`ep-toolbar__btn${active ? ' ep-toolbar__btn--on' : ''}`}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </button>
  );
}

export function Divider() {
  return <span className="ep-toolbar__sep" aria-hidden="true" />;
}
