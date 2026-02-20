import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PaperSubmission from '@/models/PaperSubmission';
import { requireAdmin } from '@/lib/requireAuth';

export async function GET() {
  try {
    requireAdmin();
    await dbConnect();

    // Works with either createdAt or submittedAt (whichever exists)
    const papers = await PaperSubmission.find({})
      .sort({ createdAt: -1, submittedAt: -1 })
      .lean();

    return NextResponse.json({ papers });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}