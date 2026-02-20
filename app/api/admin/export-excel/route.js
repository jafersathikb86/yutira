import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PaperSubmission from '@/models/PaperSubmission';
import { requireAdmin } from '@/lib/requireAuth';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    requireAdmin();
    await dbConnect();

    const users = await User.find({}).lean();
    const papers = await PaperSubmission.find({}).lean();

    const paperMap = {};
    papers.forEach(p => {
      paperMap[p.userId?.toString()] = p;
    });

    const data = users.map(u => {
      const paper = paperMap[u._id.toString()];

      return {
        "Yutira ID": u.yutiraId,
        "Name": u.name,
        "Email": u.email,
        "Phone": u.phone,
        "College": u.college,
        "Department": u.department,
        "General Payment": u.generalPaymentStatus,
        "Workshop Payment": u.workshopPaymentStatus,
        "Paper Title": paper?.title || '',
        "Paper Status": paper?.status || '',
        "PDF URL": paper?.pdfUrl || '',
        "Registered At": u.createdAt,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

    const buffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          "attachment; filename=Yutira_Registrations.xlsx",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}