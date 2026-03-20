'use server';

import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const DATA_PATH = path.join(process.cwd(), 'src/data/archive-store.json');

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

export async function createArchive({ title, content, createdAt }) {
  const archives = await read();
  const maxId = archives.reduce((m, a) => Math.max(m, a.id), 0);

  const newArchive = {
    id: maxId + 1,
    title: title.trim(),
    content: content.trim(),
    author: '관리자',
    createdAt: createdAt ?? today(),
    views: 0,
  };

  archives.push(newArchive);
  await write(archives);

  revalidatePath('/archive');
  revalidatePath(`/archive/${newArchive.id}`);
  revalidatePath('/');

  return newArchive;
}

export async function updateArchive(id, { title, content, createdAt }) {
  const archives = await read();
  const idx = archives.findIndex((a) => a.id === Number(id));
  if (idx === -1) throw new Error('Not found');

  archives[idx] = {
    ...archives[idx],
    title: title.trim(),
    content: content.trim(),
    createdAt: createdAt ?? archives[idx].createdAt,
  };

  await write(archives);

  revalidatePath('/archive');
  revalidatePath(`/archive/${id}`);
  revalidatePath('/');

  return archives[idx];
}

export async function deleteArchive(id) {
  const archives = await read();
  const idx = archives.findIndex((a) => a.id === Number(id));
  if (idx === -1) throw new Error('Not found');

  archives.splice(idx, 1);
  await write(archives);

  revalidatePath('/archive');
  revalidatePath('/');
}

