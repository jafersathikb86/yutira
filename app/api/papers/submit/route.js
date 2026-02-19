import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongodb';
import PaperSubmission from '@/models/PaperSubmission';
import User from '@/models/User';
import { requireAuth } from '@/lib/requireAuth';
import { paperPresentation } from '@/lib/data';

export async function POST(req) {
  const payload = requireAuth();
  const body = await req.json();
  const { title, degree, yearOfStudy, otherAuthors, pdfUrl } = body;

  if (!title || !degree || !yearOfStudy || !otherAuthors || !pdfUrl) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Deadline check
  if (Date.now() > new Date(paperPresentation.deadlineISO).getTime()) {
    return NextResponse.json({ error: 'Abstract submission deadline has passed.' }, { status: 403 });
  }

  await dbConnect();

  const user = await User.findById(payload.sub).lean();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  if (!user.yutiraId) return NextResponse.json({ error: 'Your YUTIRA ID is not generated yet.' }, { status: 400 });

  const created = await PaperSubmission.findOneAndUpdate(
    { yutiraId: user.yutiraId },
    {
      yutiraId: user.yutiraId,
      userEmail: user.email,
      userName: user.name,
      title,
      degree,
      yearOfStudy,
      otherAuthors,
      pdfUrl,
      status: 'submitted'
    },
    { upsert: true, new: true }
  ).lean();

  return NextResponse.json({
    title: created.title,
    status: created.status,
    remarks: created.remarks,
    pdfUrl: created.pdfUrl
  });
}
