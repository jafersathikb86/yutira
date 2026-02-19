import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { requireAdmin } from '@/lib/requireAuth';

export async function GET(req) {
  requireAdmin();
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();

  await dbConnect();

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

  const results = await User.find({
    $or: [
      { yutiraId: regex },
      { name: regex },
      { email: regex },
      { phone: regex }
    ]
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return NextResponse.json({ results });
}
