'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function updateSiteFooterSettings({
  officeAddress,
  representativeName,
  mainPhone,
  faxNumber,
}) {
  const row = {
    id: 1,
    office_address: String(officeAddress ?? '').trim(),
    representative_name: String(representativeName ?? '').trim(),
    main_phone: String(mainPhone ?? '').trim(),
    fax_number: String(faxNumber ?? '').trim(),
    updated_at: new Date().toISOString(),
  };

  const { error } = await getSupabaseAdmin()
    .from('site_settings')
    .upsert(row, { onConflict: 'id' });

  if (error) throw new Error(error.message);

  revalidateTag('site-footer');
  revalidatePath('/', 'layout');
}
