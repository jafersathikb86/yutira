import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { requireAdmin } from '@/lib/requireAuth';

export async function POST(req) {
  requireAdmin();
  const { userId, day, value } = await req.json();
  if (!userId || !['day1', 'day2'].includes(day)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  await dbConnect();

  await User.findByIdAndUpdate(userId, { $set: { [`attendance.${day}`]: !!value } });

  return NextResponse.json({ ok: true });
}
