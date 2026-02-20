import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { requireAdmin } from '@/lib/requireAuth';

function escapeRegex(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function GET(req) {
  requireAdmin();

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const filter = (searchParams.get('filter') || '').trim();

  await dbConnect();

  // Optional filter conditions (used for quick buttons)
  let extraFilter = {};
  if (filter === 'general_pending') {
    extraFilter['general.paymentStatus'] = { $ne: 'paid' };
  } else if (filter === 'workshop_pending') {
    extraFilter['workshop.paymentStatus'] = { $ne: 'paid' };
  } else if (filter === 'day1_not_marked') {
    extraFilter['attendance.day1'] = false;
  } else if (filter === 'day2_not_marked') {
    extraFilter['attendance.day2'] = false;
  }

  // If user typed nothing and no filter selected, keep original behavior
  if (!q && !filter) {
    return NextResponse.json({ results: [] });
  }

  // If user typed nothing but selected a filter, return filtered list (latest 50)
  if (!q && filter) {
    const results = await User.find({
      ...extraFilter
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ results });
  }

  // Normal search behavior (original), with optional filter applied
  const regex = new RegExp(escapeRegex(q), 'i');

  const results = await User.find({
    $or: [
      { yutiraId: regex },
      { name: regex },
      { email: regex },
      { phone: regex }
    ],
    ...extraFilter
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return NextResponse.json({ results });
}