export default function CategoryMark({ label }) {
  if (!label) return null;
  return <span className="board-cat">[{label}]</span>;
}
