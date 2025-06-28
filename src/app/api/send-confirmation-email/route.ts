// src/app/api/send-confirmation-email/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { email, newsTitle, confirmationId } = await req.json();

  const APP_URL = process.env.APP_URL!;
  const confirmLink = `${APP_URL}/confirm-author?id=${confirmationId}`;
  const denyLink = `${APP_URL}/confirm-author?id=${confirmationId}&deny=true`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT!),
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  const mailOptions = {
    from: `"News Portal" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Please Confirm News Authorship',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
    
    <h2 style="color: #333333; font-size: 20px;">📢 News Authorship Confirmation</h2>

    <p style="font-size: 16px; color: #555555;">Hello,</p>

    <p style="font-size: 16px; color: #555555;">
      Someone submitted a news titled:
      <strong style="color: #000000;">${newsTitle}</strong> and listed your email as the potential author.
    </p>

    <p style="font-size: 16px; color: #555555;">
      Please confirm whether you are the author of this article:
    </p>

    <div style="margin: 24px 0;">
      <a href="${confirmLink}"
         style="display: inline-block; margin-bottom: 12px; padding: 12px 24px; background-color: #28a745; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 5px;">
         ✅ Yes, I am the author
      </a><br/>
      <a href="${denyLink}"
         style="display: inline-block; margin-top: 12px; padding: 12px 24px; background-color: #dc3545; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 5px;">
         ❌ No, I am not the author
      </a>
    </div>

    <p style="font-size: 14px; color: #999999;">
      If you believe this request was sent to you in error, you can safely ignore this message.
    </p>

    <hr style="margin-top: 30px; border: none; border-top: 1px solid #eeeeee;">

    <p style="font-size: 12px; color: #aaaaaa; text-align: center;">
      © ${new Date().getFullYear()} News Portal — All rights reserved.
    </p>
  </div>
</div>

    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Email send error:', err);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}
