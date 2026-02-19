import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { makeToken, sha256 } from '@/lib/auth';
import { sendMail, h2, p, button, small } from '@/lib/mailer';

export async function POST(req) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  const emailLower = String(email).toLowerCase().trim();

  await dbConnect();
  const user = await User.findOne({ email: emailLower });

  // Always return OK to prevent user enumeration.
  if (!user) return NextResponse.json({ ok: true });

  const token = makeToken();
  user.resetTokenHash = sha256(token);
  user.resetTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
  await user.save();

  const baseUrl = process.env.APP_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/reset-password/${token}`;

  const contentHtml =
    h2('Reset your password') +
    p(`Hi <b>${user.name}</b>,`) +
    p('Click the button below to reset your password. This link expires in 30 minutes.') +
    button(resetUrl, 'Reset password') +
    small('If you did not request this, you can ignore this email.');

  try {
    await sendMail({
      to: user.email,
      subject: 'Yutira 2026 — Password reset',
      title: 'Reset password',
      preheader: 'Reset your Yutira 2026 account password',
      contentHtml
    });
  } catch (e) {
    console.error(e);
  }

  return NextResponse.json({ ok: true });
}
