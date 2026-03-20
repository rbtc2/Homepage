'use server';

import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const DATA_PATH = path.join(process.cwd(), 'src/data/notices-store.json');

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

export async function createNotice({ title, content, isPinned, createdAt }) {
  const notices = await read();
  const maxId = notices.reduce((m, n) => Math.max(m, n.id), 0);
  const newNotice = {
    id: maxId + 1,
    title: title.trim(),
    content: content.trim(),
    author: '관리자',
    createdAt: createdAt ?? today(),
    isPinned: Boolean(isPinned),
    views: 0,
  };
  notices.push(newNotice);
  await write(notices);
  revalidatePath('/notices');
  revalidatePath('/');
  return newNotice;
}

export async function updateNotice(id, { title, content, isPinned, createdAt }) {
  const notices = await read();
  const idx = notices.findIndex((n) => n.id === Number(id));
  if (idx === -1) throw new Error('Not found');
  notices[idx] = {
    ...notices[idx],
    title: title.trim(),
    content: content.trim(),
    isPinned: Boolean(isPinned),
    createdAt: createdAt ?? notices[idx].createdAt,
  };
  await write(notices);
  revalidatePath('/notices');
  revalidatePath(`/notices/${id}`);
  revalidatePath('/');
  return notices[idx];
}

export async function deleteNotice(id) {
  const notices = await read();
  const idx = notices.findIndex((n) => n.id === Number(id));
  if (idx === -1) throw new Error('Not found');
  notices.splice(idx, 1);
  await write(notices);
  revalidatePath('/notices');
  revalidatePath(`/notices/${id}`);
  revalidatePath('/');
}

export async function togglePin(id) {
  const notices = await read();
  const idx = notices.findIndex((n) => n.id === Number(id));
  if (idx === -1) throw new Error('Not found');
  notices[idx].isPinned = !notices[idx].isPinned;
  await write(notices);
  revalidatePath('/notices');
  revalidatePath(`/notices/${id}`);
  revalidatePath('/');
  return notices[idx].isPinned;
}
