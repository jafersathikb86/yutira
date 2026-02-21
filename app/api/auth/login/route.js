import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { signJwt, getAuthCookieOptions } from '@/lib/auth';

function jsonError(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req) {
  const { email, password } = await req.json();
  if (!email || !password) return jsonError('Email and password are required');

  const emailLower = String(email).toLowerCase().trim();

  // Admin shortcut (single admin login)
  const adminEmail = (process.env.ADMIN_EMAIL || 'cea.civil@psgtech.ac.in').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || 'tryagain';

  if (adminEmail && adminPassword && emailLower === adminEmail && password === adminPassword) {
    const token = signJwt({ sub: adminEmail, role: 'admin' }, '12h');
    cookies().set('yutira_token', token, getAuthCookieOptions());
    return NextResponse.json({ ok: true, role: 'admin' });
  }

  await dbConnect();

  const user = await User.findOne({ email: emailLower });
  if (!user) return jsonError('Invalid credentials', 401);
  if (!user.emailVerified) return jsonError('Please verify your email before logging in.', 403);

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return jsonError('Invalid credentials', 401);

  const token = signJwt({ sub: user._id.toString(), role: 'user' }, '7d');
  cookies().set('yutira_token', token, getAuthCookieOptions());

  return NextResponse.json({ ok: true, role: 'user' });
}
