import { NextResponse } from 'next/server';
import { stringify } from 'csv-stringify/sync';

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PaperSubmission from '@/models/PaperSubmission';
import { requireAdmin } from '@/lib/requireAuth';

export async function GET() {
  requireAdmin();
  await dbConnect();

  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  const papers = await PaperSubmission.find({}).lean();
  const paperById = new Map(papers.map(p => [p.yutiraId, p]));

  const records = users.map(u => {
    const paper = paperById.get(u.yutiraId);
    return {
      yutiraId: u.yutiraId,
      name: u.name,
      email: u.email,
      phone: u.phone,
      college: u.college,
      department: u.department,
      year: u.year,
      isPSG: u.isPSG,
      generalSelected: u.general?.selected,
      generalPayment: u.general?.paymentStatus,
      workshopSelected: u.workshop?.selected,
      workshopPayment: u.workshop?.paymentStatus,
      attendanceDay1: u.attendance?.day1,
      attendanceDay2: u.attendance?.day2,
      paperTitle: paper?.title || '',
      paperStatus: paper?.status || '',
      paperPdfUrl: paper?.pdfUrl || '',
      createdAt: u.createdAt
    };
  });

  const csv = stringify(records, { header: true });

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="yutira-registrations.csv"'
    }
  });
}
