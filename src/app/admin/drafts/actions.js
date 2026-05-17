'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { isAdminDraftContentType } from '@/lib/admin-drafts';

function normalizeDraft(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    contentType: row.content_type,
    title: row.title ?? '',
    payload: row.payload ?? {},
    sourcePostId: row.source_post_id ?? null,
    updatedAt: row.updated_at,
  };
}

function assertContentType(contentType) {
  if (!isAdminDraftContentType(contentType)) {
    throw new Error('잘못된 게시판 유형입니다.');
  }
}

export async function saveAdminDraft({ id, contentType, sourcePostId, payload }) {
  assertContentType(contentType);

  const title = String(payload?.title ?? '').trim();
  const row = {
    content_type: contentType,
    title,
    payload: payload ?? {},
    source_post_id: sourcePostId != null && sourcePostId !== '' ? String(sourcePostId) : null,
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabaseAdmin();

  if (id) {
    const { data, error } = await supabase
      .from('admin_drafts')
      .update(row)
      .eq('id', Number(id))
      .eq('content_type', contentType)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return normalizeDraft(data);
  }

  const { data, error } = await supabase.from('admin_drafts').insert(row).select().single();

  if (error) throw new Error(error.message);
  return normalizeDraft(data);
}

export async function listAdminDrafts(contentType) {
  assertContentType(contentType);

  const { data, error } = await getSupabaseAdmin()
    .from('admin_drafts')
    .select('id, content_type, title, source_post_id, updated_at')
    .eq('content_type', contentType)
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: String(row.id),
    contentType: row.content_type,
    title: row.title ?? '',
    sourcePostId: row.source_post_id ?? null,
    updatedAt: row.updated_at,
  }));
}

export async function getAdminDraft(id) {
  const { data, error } = await getSupabaseAdmin()
    .from('admin_drafts')
    .select('*')
    .eq('id', Number(id))
    .single();

  if (error) throw new Error(error.message);
  return normalizeDraft(data);
}

export async function deleteAdminDraft(id) {
  const { error } = await getSupabaseAdmin().from('admin_drafts').delete().eq('id', Number(id));

  if (error) throw new Error(error.message);
}
