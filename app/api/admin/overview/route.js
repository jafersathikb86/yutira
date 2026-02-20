import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PaperSubmission from '@/models/PaperSubmission';
import { requireAdmin } from '@/lib/requireAuth';

export async function GET() {
  try {
    requireAdmin();
    await dbConnect();

    const totalUsers = await User.countDocuments();
    const generalPaid = await User.countDocuments({ 'general.paymentStatus': 'paid' });
    const workshopPaid = await User.countDocuments({ 'workshop.paymentStatus': 'paid' });
    const totalPapers = await PaperSubmission.countDocuments();

    return NextResponse.json({ totalUsers, generalPaid, workshopPaid, totalPapers });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}