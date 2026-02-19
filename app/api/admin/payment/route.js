import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { requireAdmin } from '@/lib/requireAuth';

export async function POST(req) {
  requireAdmin();
  const { userId, kind, paid } = await req.json();
  if (!userId || !['general', 'workshop'].includes(kind)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  await dbConnect();

  const update = {};
  update[`${kind}.paymentStatus`] = paid ? 'paid' : 'pending';
  update[`${kind}.paidAt`] = paid ? new Date() : null;

  await User.findByIdAndUpdate(userId, { $set: update });

  return NextResponse.json({ ok: true });
}
