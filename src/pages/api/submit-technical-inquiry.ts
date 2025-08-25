import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  console.log('--- [submit-technical-inquiry] Received new request ---');
  try {
    const body = await request.text();
    const params = new URLSearchParams(body);
    console.log('[submit-technical-inquiry] Request body parsed.');

    const formDataObject: { [key: string]: string } = {};
    for (const [key, value] of params.entries()) {
      formDataObject[key] = value;
    }
    console.log('[submit-technical-inquiry] Form data processed:', JSON.stringify(formDataObject, null, 2));

    const { companyName, address, name, phoneNumber, email, inquiryContent, lang = 'ko' } = formDataObject;
    console.log(`[submit-technical-inquiry] Determined language: ${lang}`);

    const t = {
        ko: {
            emailSubject: '새로운 기술 문의가 접수되었습니다.',
            emailTitle: '기술 문의 접수',
            customerInfo: '고객 정보',
            companyName: '업체명',
            address: '주소',
            name: '이름',
            phoneNumber: '전화번호',
            email: '이메일',
            inquiryDetails: '문의 내용',
            requestError: '기술 문의 처리에 실패했습니다.',
        },
        en: {
            emailSubject: 'A new technical inquiry has been submitted.',
            emailTitle: 'Technical Inquiry Received',
            customerInfo: 'Customer Information',
            companyName: 'Company Name',
            address: 'Address',
            name: 'Name',
            phoneNumber: 'Phone Number',
            email: 'Email',
            inquiryDetails: 'Inquiry Details',
            requestError: 'Failed to process technical inquiry.',
        },
    };

    const T = t[lang === 'en' ? 'en' : 'ko'];

    // --- Email Sending Logic ---
    console.log('[submit-technical-inquiry] Preparing to send email...');
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
      <h1>${T.emailTitle}</h1>
      <h2>${T.customerInfo}</h2>
      <p><strong>${T.companyName}:</strong> ${companyName || '-'}</p>
      <p><strong>${T.address}:</strong> ${address || '-'}</p>
      <p><strong>${T.name}:</strong> ${name || '-'}</p>
      <p><strong>${T.phoneNumber}:</strong> ${phoneNumber || '-'}</p>
      <p><strong>${T.email}:</strong> ${email || '-'}</p>
      <h2>${T.inquiryDetails}</h2>
      <p>${inquiryContent || '-'}</p>
    `;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: 'sue@coxcamera.com',
      subject: T.emailSubject,
      html: emailContent,
    };
    console.log('[submit-technical-inquiry] Mail options prepared:', JSON.stringify(mailOptions, null, 2));

    await transporter.sendMail(mailOptions);
    console.log('[submit-technical-inquiry] Email sent successfully!');

    const redirectUrl = `/${lang}/support/technical-complete`;
    console.log(`[submit-technical-inquiry] Success! Redirecting to: ${redirectUrl}`);

    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl,
      },
    });
  } catch (error) {
    console.error('[submit-technical-inquiry] CRITICAL: Unhandled error processing submission:', error);
    // Try to get lang from the request to send a localized error message
    const lang = new URLSearchParams(await request.clone().text()).get('lang') || 'ko';
    const errorMsg = lang === 'en' ? 'Failed to process technical inquiry.' : '기술 문의 처리에 실패했습니다.';
    return new Response(JSON.stringify({ message: errorMsg, error: (error as Error).message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};