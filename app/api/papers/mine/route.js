import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongodb';
import PaperSubmission from '@/models/PaperSubmission';
import User from '@/models/User';
import { requireAuth } from '@/lib/requireAuth';

export async function GET() {
  const payload = requireAuth();

  await dbConnect();

  const user = await User.findById(payload.sub).lean();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const paper = await PaperSubmission.findOne({ yutiraId: user.yutiraId }).lean();
  if (!paper) return NextResponse.json({ error: 'No submission' }, { status: 404 });

  return NextResponse.json({
    title: paper.title,
    status: paper.status,
    remarks: paper.remarks,
    pdfUrl: paper.pdfUrl
  });
}
