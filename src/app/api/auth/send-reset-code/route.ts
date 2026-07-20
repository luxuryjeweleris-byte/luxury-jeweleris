import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: dbError } = await supabaseAdmin
      .from('password_resets')
      .insert({ email: email.trim().toLowerCase(), code, expires_at: expiresAt });

    if (dbError) {
      console.error('send-reset-code db error:', dbError);
      return NextResponse.json({ error: `Database error: ${dbError.message}` }, { status: 500 });
    }

    console.log(`\n  Password reset code for ${email}: ${code}\n`);

    try {
      await sendEmail({
        to: email,
        subject: 'Your password reset code - Luxury Jeweleris',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #1e293b;">Reset your password</h2>
            <p style="color: #475569;">Use the code below to reset your password. It expires in 10 minutes.</p>
            <div style="font-size: 32px; font-weight: 800; letter-spacing: 8px; text-align: center;
                        padding: 20px; background: #f8fafc; border-radius: 8px; margin: 24px 0;
                        color: #2563eb;">${code}</div>
            <p style="color: #94a3b8; font-size: 13px;">If you didn't request this, ignore this email.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('send-reset-code email error:', emailError);
    }

    return NextResponse.json({ ok: true, code: process.env.NODE_ENV === 'development' ? code : undefined });
  } catch (err) {
    console.error('send-reset-code error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
