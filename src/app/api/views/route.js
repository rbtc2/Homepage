import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const ALLOWED_TABLES = ['notices', 'archive', 'disclosures', 'gallery'];

export async function POST(request) {
  try {
    const { table, id } = await request.json();

    if (!ALLOWED_TABLES.includes(table)) {
      return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
    }

    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const { data, error: fetchError } = await supabase
      .from(table)
      .select('views')
      .eq('id', numId)
      .single();

    if (fetchError || !data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const { error: updateError } = await supabase
      .from(table)
      .update({ views: (data.views ?? 0) + 1 })
      .eq('id', numId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
