import { readFile } from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src/data/archive-store.json');

export async function getArchives() {
  const raw = await readFile(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

export async function searchArchives(query) {
  const archives = await getArchives();
  if (!query || !query.trim()) return archives;
  const q = query.trim().toLowerCase();
  return archives.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q),
  );
}

export async function getArchiveById(id) {
  const archives = await getArchives();
  return archives.find((a) => a.id === Number(id)) ?? null;
}

export async function getPrevNext(id) {
  const archives = await getArchives();
  const numId = Number(id);
  const sorted = [...archives].sort((a, b) => a.id - b.id);
  const idx = sorted.findIndex((a) => a.id === numId);

  return {
    prev: idx > 0 ? sorted[idx - 1] : null,
    next: idx < sorted.length - 1 ? sorted[idx + 1] : null,
  };
}

