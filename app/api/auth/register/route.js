import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { makeToken, sha256 } from '@/lib/auth';
import { sendMail, button, h2, p, small } from '@/lib/mailer';
import { psgEmailSuffix, REGISTRATION_CLOSE_ISO } from '@/lib/data';

function jsonError(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req) {
  const now = Date.now();
  if (now > new Date(REGISTRATION_CLOSE_ISO).getTime()) {
    return jsonError('Registrations are closed (after 26 March 2026).', 403);
  }

  const body = await req.json();
  const { name, email, phone, college, department, year, password, general, workshop } = body;

  if (!name || !email || !phone || !college || !department || !year || !password) {
    return jsonError('Missing required fields');
  }

  if (!general && !workshop) {
    return jsonError('Select at least one: General registration and/or Workshop');
  }

  const emailLower = String(email).toLowerCase().trim();
  const isPSG = emailLower.endsWith(psgEmailSuffix);

  await dbConnect();

  const existing = await User.findOne({ email: emailLower });
  if (existing) {
    return jsonError('Email already registered. Please login or reset password.', 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const token = makeToken();
  const tokenHash = sha256(token);
  const tokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

  const user = await User.create({
    name,
    email: emailLower,
    phone,
    college,
    department,
    year,
    isPSG,
    passwordHash,
    general: { selected: !!general },
    workshop: { selected: !!workshop },
    verificationTokenHash: tokenHash,
    verificationTokenExpiresAt: tokenExpires,
    emailVerified: false
  });

  const baseUrl = process.env.APP_URL || 'https://yutira.psgtech.ac.in/';
  const verifyUrl = `${baseUrl}/api/auth/verify?token=${token}`;

  const contentHtml =
    h2('Verify your email to complete registration') +
    p(`Hi <b>${user.name}</b>,`) +
    p('Please verify your email to complete your Yutira 2026 registration. After verification, you will receive your YUTIRA ID and the payment link.') +
    button(verifyUrl, 'Verify Email') +
    small('This link expires in 24 hours.');

  try {
    await sendMail({
      to: user.email,
      subject: 'Yutira 2026 — Verify your email',
      title: 'Verify your email',
      preheader: 'Complete your Yutira 2026 registration',
      contentHtml
    });
  } catch (e) {
    // Keep registration but inform user.
    console.error(e);
    return NextResponse.json({ ok: true, message: 'Registered, but failed to send email. Ask admin to resend verification.' });
  }

  return NextResponse.json({ ok: true });
}
