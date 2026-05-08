'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { DEFAULT_SIGNUP_APPLICATION_URL } from '@/lib/site-settings';

function normalizeSignupApplicationUrl(raw) {
  const s = String(raw ?? '').trim();
  if (!s) return DEFAULT_SIGNUP_APPLICATION_URL;
  try {
    const u = new URL(s);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') {
      throw new Error();
    }
    return u.href;
  } catch {
    throw new Error('회원가입 신청 링크는 https:// 또는 http:// 로 시작하는 올바른 주소여야 합니다.');
  }
}

export async function updateSiteFooterSettings({
  officeAddress,
  representativeName,
  mainPhone,
  faxNumber,
  signupApplicationUrl,
}) {
  const row = {
    id: 1,
    office_address: String(officeAddress ?? '').trim(),
    representative_name: String(representativeName ?? '').trim(),
    main_phone: String(mainPhone ?? '').trim(),
    fax_number: String(faxNumber ?? '').trim(),
    signup_application_url: normalizeSignupApplicationUrl(signupApplicationUrl),
    updated_at: new Date().toISOString(),
  };

  const { error } = await getSupabaseAdmin()
    .from('site_settings')
    .upsert(row, { onConflict: 'id' });

  if (error) throw new Error(error.message);

  revalidateTag('site-footer');
  revalidatePath('/', 'layout');
  revalidatePath('/member');
}
