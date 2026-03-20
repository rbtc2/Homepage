import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src/data/notices-store.json');

export async function getNotices() {
  const raw = await readFile(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

export async function writeNotices(notices) {
  await writeFile(DATA_PATH, JSON.stringify(notices, null, 2), 'utf8');
}

export async function searchNotices(query) {
  const notices = await getNotices();
  if (!query || !query.trim()) return notices;
  const q = query.trim().toLowerCase();
  return notices.filter(
    (n) =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q)
  );
}

export async function getNoticeById(id) {
  const notices = await getNotices();
  return notices.find((n) => n.id === Number(id)) ?? null;
}

export async function getPrevNext(id) {
  const notices = await getNotices();
  const numId = Number(id);
  const sorted = [...notices].sort((a, b) => a.id - b.id);
  const idx = sorted.findIndex((n) => n.id === numId);
  return {
    prev: idx > 0 ? sorted[idx - 1] : null,
    next: idx < sorted.length - 1 ? sorted[idx + 1] : null,
  };
}
