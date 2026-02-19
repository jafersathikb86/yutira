import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongodb';
import PaperSubmission from '@/models/PaperSubmission';
import { requireAdmin } from '@/lib/requireAuth';

export async function POST(req) {
  requireAdmin();
  const { yutiraId, status, remarks } = await req.json();

  if (!yutiraId || !['submitted', 'accepted', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  await dbConnect();

  const paper = await PaperSubmission.findOneAndUpdate(
    { yutiraId },
    { $set: { status, remarks: remarks || '' } },
    { new: true }
  );

  if (!paper) return NextResponse.json({ error: 'No submission found for this YUTIRA ID' }, { status: 404 });

  return NextResponse.json({ ok: true });
}
