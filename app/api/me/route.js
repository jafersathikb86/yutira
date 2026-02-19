import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getAuthPayload } from '@/lib/requireAuth';

export async function GET() {
  const payload = getAuthPayload();
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (payload.role === 'admin') {
    return NextResponse.json({ role: 'admin', email: payload.sub });
  }

  await dbConnect();

  const user = await User.findById(payload.sub).lean();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({
    role: 'user',
    _id: user._id,
    yutiraId: user.yutiraId,
    name: user.name,
    email: user.email,
    phone: user.phone,
    college: user.college,
    department: user.department,
    year: user.year,
    isPSG: user.isPSG,
    general: user.general,
    workshop: user.workshop,
    attendance: user.attendance
  });
}
