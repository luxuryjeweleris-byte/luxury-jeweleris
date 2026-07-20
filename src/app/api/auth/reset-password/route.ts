import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const { email, code, password } = await req.json();

    if (!email?.trim() || !code?.trim() || !password?.trim()) {
      return NextResponse.json({ error: 'Email, code, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { data: rows, error: fetchError } = await supabaseAdmin
      .from('password_resets')
      .select('id')
      .eq('email', normalizedEmail)
      .eq('code', code.trim())
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError || !rows || rows.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
    }

    const resetId = rows[0].id;

    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
    const user = users.find((u) => u.email === normalizedEmail);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password },
    );

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }

    await supabaseAdmin
      .from('password_resets')
      .update({ used: true })
      .eq('id', resetId);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
