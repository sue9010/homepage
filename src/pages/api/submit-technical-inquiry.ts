import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.text();
    const params = new URLSearchParams(body);

    const formDataObject: { [key: string]: string } = {};
    for (const [key, value] of params.entries()) {
      formDataObject[key] = value;
    }

    const { companyName, address, name, phoneNumber, email, inquiryContent } = formDataObject;

    // --- Email Sending Logic ---
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const emailContent = `
      <h1>기술 문의 접수</h1>
      <h2>고객 정보</h2>
      <p><strong>업체명:</strong> ${companyName || '-'}</p>
      <p><strong>주소:</strong> ${address || '-'}</p>
      <p><strong>이름:</strong> ${name || '-'}</p>
      <p><strong>전화번호:</strong> ${phoneNumber || '-'}</p>
      <p><strong>이메일:</strong> ${email || '-'}</p>
      <h2>문의 내용</h2>
      <p>${inquiryContent || '-'}</p>
    `;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: 'sue@coxcamera.com', // Replace with actual recipient
      subject: '새로운 기술 문의가 접수되었습니다.',
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);
    console.log('Technical inquiry email sent successfully!');

    // --- Redirection to Completion Page ---
    const queryParams = new URLSearchParams();
    for (const key in formDataObject) {
      queryParams.append(key, formDataObject[key]);
    }
    const redirectUrl = `/ko/support/technical-complete?${queryParams.toString()}`;

    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl,
      },
    });
  } catch (error) {
    console.error('Error processing technical inquiry:', error);
    return new Response(JSON.stringify({ message: 'Failed to process technical inquiry.', error: (error as Error).message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};