import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sha256 } from '@/lib/auth';
import { generateNextYutiraId } from '@/lib/yutiraIdGenerator';
import { sendMail, h2, p, button, small } from '@/lib/mailer';
import { PAYMENT_LINK } from '@/lib/data';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login?verified=0', process.env.APP_URL));
  }

  await dbConnect();

  const tokenHash = sha256(token);
  const user = await User.findOne({
    verificationTokenHash: tokenHash,
    verificationTokenExpiresAt: { $gt: new Date() }
  });

  if (!user) {
    return NextResponse.redirect(new URL('/login?verified=0', process.env.APP_URL));
  }

  if (!user.emailVerified) {
    user.emailVerified = true;
    user.verificationTokenHash = undefined;
    user.verificationTokenExpiresAt = undefined;

    if (!user.yutiraId) {
      user.yutiraId = await generateNextYutiraId();
    }

    await user.save();

    const baseUrl = process.env.APP_URL || 'https://yutira.psgtech.ac.in/';

    const contentHtml =
      h2('Registration verified — your YUTIRA ID is ready') +
      p(`Hi <b>${user.name}</b>,`) +
      p(`Your YUTIRA ID: <b>${user.yutiraId}</b>`) +
      p('Payment link (as per instructions):') +
      button(PAYMENT_LINK, 'Open Payment Link') +
      p('<b>Important:</b> Fill the same <b>Name</b> and <b>Mobile number</b> that you used for registration while paying.') +
      small(`After payment, it will be verified manually by the faculty advisor. You can login anytime at ${baseUrl}/login.`);

    try {
      await sendMail({
        to: user.email,
        subject: 'Yutira 2026 — Registration verified (YUTIRA ID inside)',
        title: 'Registration Verified',
        preheader: 'Your YUTIRA ID and payment link',
        contentHtml
      });
    } catch (e) {
      console.error(e);
    }
  }

  return NextResponse.redirect(new URL('/login?verified=1', process.env.APP_URL));
}
