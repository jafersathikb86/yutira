import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sha256 } from '@/lib/auth';

export async function POST(req) {
  const { token, password } = await req.json();
  if (!token || !password) return NextResponse.json({ error: 'Missing token or password' }, { status: 400 });

  await dbConnect();

  const user = await User.findOne({
    resetTokenHash: sha256(token),
    resetTokenExpiresAt: { $gt: new Date() }
  });

  if (!user) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });

  user.passwordHash = await bcrypt.hash(password, 10);
  user.resetTokenHash = undefined;
  user.resetTokenExpiresAt = undefined;
  await user.save();

  return NextResponse.json({ ok: true });
}
