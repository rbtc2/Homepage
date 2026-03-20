'use server';

import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const DATA_PATH = path.join(process.cwd(), 'src/data/disclosures-store.json');

async function read() {
  const raw = await readFile(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

async function write(data) {
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function createDisclosure({ title, content, createdAt }) {
  const disclosures = await read();
  const maxId = disclosures.reduce((m, d) => Math.max(m, d.id), 0);

  const newDisclosure = {
    id: maxId + 1,
    title: title.trim(),
    content: content.trim(),
    author: '관리자',
    createdAt: createdAt ?? today(),
    views: 0,
  };

  disclosures.push(newDisclosure);
  await write(disclosures);

  revalidatePath('/disclosures');
  revalidatePath(`/disclosures/${newDisclosure.id}`);
  revalidatePath('/');

  return newDisclosure;
}

export async function updateDisclosure(id, { title, content, createdAt }) {
  const disclosures = await read();
  const idx = disclosures.findIndex((d) => d.id === Number(id));
  if (idx === -1) throw new Error('Not found');

  disclosures[idx] = {
    ...disclosures[idx],
    title: title.trim(),
    content: content.trim(),
    createdAt: createdAt ?? disclosures[idx].createdAt,
  };

  await write(disclosures);

  revalidatePath('/disclosures');
  revalidatePath(`/disclosures/${id}`);
  revalidatePath('/');

  return disclosures[idx];
}

export async function deleteDisclosure(id) {
  const disclosures = await read();
  const idx = disclosures.findIndex((d) => d.id === Number(id));
  if (idx === -1) throw new Error('Not found');

  disclosures.splice(idx, 1);
  await write(disclosures);

  revalidatePath('/disclosures');
  revalidatePath('/');
}

