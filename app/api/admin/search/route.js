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

  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limitRaw = parseInt(searchParams.get('limit') || '50', 10);
  const limit = Math.min(200, Math.max(10, limitRaw)); // safety cap
  const skip = (page - 1) * limit;

  await dbConnect();

  // Filter conditions (used for quick buttons)
  let extraFilter = {};

  if (filter === 'general_pending') {
    extraFilter['general.paymentStatus'] = { $ne: 'paid' };
  } else if (filter === 'workshop_pending') {
    extraFilter['workshop.paymentStatus'] = { $ne: 'paid' };
  } else if (filter === 'day1_not_marked') {
    extraFilter['attendance.day1'] = false;
  } else if (filter === 'day2_not_marked') {
    extraFilter['attendance.day2'] = false;
  } else if (filter === 'all_users') {
    // no extraFilter, list all users with pagination
    extraFilter = {};
  }

  // If no query and no filter => original behavior
  if (!q && !filter) {
    return NextResponse.json({ results: [], page: 1, limit, total: 0 });
  }

  let mongoQuery = { ...extraFilter };

  // Normal search query applies on top (if q provided)
  if (q) {
    const regex = new RegExp(escapeRegex(q), 'i');
    mongoQuery = {
      ...mongoQuery,
      $or: [{ yutiraId: regex }, { name: regex }, { email: regex }, { phone: regex }]
    };
  }

  const total = await User.countDocuments(mongoQuery);

  const results = await User.find(mongoQuery)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return NextResponse.json({
    results,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit))
  });
}