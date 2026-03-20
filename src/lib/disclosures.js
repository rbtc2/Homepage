import { readFile } from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src/data/disclosures-store.json');

export async function getDisclosures() {
  const raw = await readFile(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

export async function searchDisclosures(query) {
  const disclosures = await getDisclosures();
  if (!query || !query.trim()) return disclosures;
  const q = query.trim().toLowerCase();
  return disclosures.filter(
    (d) => d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q),
  );
}

export async function getDisclosureById(id) {
  const disclosures = await getDisclosures();
  return disclosures.find((d) => d.id === Number(id)) ?? null;
}

export async function getPrevNext(id) {
  const disclosures = await getDisclosures();
  const numId = Number(id);
  const sorted = [...disclosures].sort((a, b) => a.id - b.id);
  const idx = sorted.findIndex((d) => d.id === numId);

  return {
    prev: idx > 0 ? sorted[idx - 1] : null,
    next: idx < sorted.length - 1 ? sorted[idx + 1] : null,
  };
}

