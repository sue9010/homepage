import type { APIRoute } from 'astro';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  console.log('--- [submit-repair] Received new request ---');
  let hasError = false;
  let errorMessage = '';

  try {
    const body = await request.text();
    const params = new URLSearchParams(body);
    console.log('[submit-repair] Request body parsed.');

    const formDataObject: { [key: string]: any } = {};
    for (const [key, value] of params.entries()) {
      if (key.startsWith('modelName-') || key.startsWith('lensSize-') || key.startsWith('tempOption-') || key.startsWith('geWindowToggle-') || key.startsWith('geWindowSize-') || key.startsWith('serialNumber-') || key.startsWith('purchaseDate-') || key.startsWith('symptoms-')) {
        const parts = key.split('-');
        const fieldName = parts[0];
        const index = parseInt(parts[1]);
        if (!formDataObject.products) {
          formDataObject.products = [];
        }
        if (!formDataObject.products[index - 1]) {
          formDataObject.products[index - 1] = {};
        }
        formDataObject.products[index - 1][fieldName] = value;
      } else {
        formDataObject[key] = value;
      }
    }

    if (formDataObject.products) {
      formDataObject.products = formDataObject.products.filter(Boolean);
    }
    console.log('[submit-repair] Form data processed:', JSON.stringify(formDataObject, null, 2));

    const lang = formDataObject.lang === 'en' ? 'en' : 'ko';
    console.log(`[submit-repair] Determined language: ${lang}`);

    const t = {
      ko: {
        emailSubject: '새로운 수리 요청이 접수되었습니다.',
        emailTitle: '수리 요청 접수',
        customerInfo: '고객 정보',
        companyName: '업체명',
        address: '주소',
        name: '이름',
        phoneNumber: '전화번호',
        email: '이메일',
        productInfo: '제품 정보',
        product: '제품',
        modelName: '모델명',
        lensSize: '렌즈 크기',
        tempOption: '온도 옵션',
        useGeWindow: 'Ge Window 사용 여부',
        geWindowUsed: '사용',
        geWindowNotUsed: '미사용',
        geWindowSize: 'Ge Window 크기',
        serialNumber: '시리얼 번호',
        purchaseDate: '구매 시기',
        symptoms: '증상',
        submissionTime: '접수 시간',
        emailError: '이메일 발송에 실패했습니다.',
        sheetError: '구글 스프레드시트 저장에 실패했습니다.',
        requestError: '수리 요청 처리에 실패했습니다.',
      },
      en: {
        emailSubject: 'A new repair request has been submitted.',
        emailTitle: 'Repair Request Received',
        customerInfo: 'Customer Information',
        companyName: 'Company Name',
        address: 'Address',
        name: 'Name',
        phoneNumber: 'Phone Number',
        email: 'Email',
        productInfo: 'Product Information',
        product: 'Product',
        modelName: 'Model Name',
        lensSize: 'Lens Size',
        tempOption: 'Temperature Option',
        useGeWindow: 'Use Ge Window',
        geWindowUsed: 'Used',
        geWindowNotUsed: 'Not Used',
        geWindowSize: 'Ge Window Size',
        serialNumber: 'Serial Number',
        purchaseDate: 'Purchase Date',
        symptoms: 'Symptoms',
        submissionTime: 'Submission Time',
        emailError: 'Failed to send email.',
        sheetError: 'Failed to save to Google Spreadsheet.',
        requestError: 'Failed to process repair request.',
      },
    };

    const T = t[lang];

    // --- Email Sending Logic ---
    console.log('[submit-repair] Preparing to send email...');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let emailContent = `
      <h1>${T.emailTitle}</h1>
      <h2>${T.customerInfo}</h2>
      <p><strong>${T.companyName}:</strong> ${formDataObject.companyName || '-'}</p>
      <p><strong>${T.address}:</strong> ${formDataObject.address || '-'}</p>
      <p><strong>${T.name}:</strong> ${formDataObject.name || '-'}</p>
      <p><strong>${T.phoneNumber}:</strong> ${formDataObject.phoneNumber || '-'}</p>
      <p><strong>${T.email}:</strong> ${formDataObject.email || '-'}</p>
    `;

    if (formDataObject.products && formDataObject.products.length > 0) {
      emailContent += `<h2>${T.productInfo}</h2>`;
      formDataObject.products.forEach((product: any, index: number) => {
        emailContent += `
          <h3>${T.product} #${index + 1}</h3>
          <p><strong>${T.modelName}:</strong> ${product.modelName || '-'}</p>
          <p><strong>${T.lensSize}:</strong> ${product.lensSize || '-'}</p>
          <p><strong>${T.tempOption}:</strong> ${product.tempOption || '-'}</p>
          <p><strong>${T.useGeWindow}:</strong> ${product.geWindowToggle === 'on' ? T.geWindowUsed : T.geWindowNotUsed}</p>
          <p><strong>${T.geWindowSize}:</strong> ${product.geWindowSize || '-'}</p>
          <p><strong>${T.serialNumber}:</strong> ${product.serialNumber || '-'}</p>
          <p><strong>${T.purchaseDate}:</strong> ${product.purchaseDate || '-'}</p>
          <p><strong>${T.symptoms}:</strong> ${product.symptoms || '-'}</p>
        `;
      });
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: 'sue@coxcamera.com',
      subject: T.emailSubject,
      html: emailContent,
    };
    console.log('[submit-repair] Mail options prepared:', JSON.stringify(mailOptions, null, 2));

    try {
      await transporter.sendMail(mailOptions);
      console.log('[submit-repair] Email sent successfully!');
    } catch (emailError) {
      console.error('[submit-repair] Error sending email:', emailError);
      hasError = true;
      errorMessage += T.emailError + ' ';
    }

    // --- Google Sheets Appending Logic ---
    console.log('[submit-repair] Preparing to append to Google Sheet...');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({
      version: 'v4',
      auth,
    });

    const spreadsheetId = '1RTyahhPEmePUX-HtvtTpopxBNwW0MTPJx9Q6zC_OZL4';
    const range = '시트1';

    const rowsToAppend: any[][] = [];
    const baseCustomerInfo = [
      formDataObject.companyName || '',
      formDataObject.address || '',
      formDataObject.name || '',
      formDataObject.email || '',
      formDataObject.phoneNumber || '',
    ];

    if (formDataObject.products && formDataObject.products.length > 0) {
      formDataObject.products.forEach((product: any) => {
        const productRow = [
          product.modelName || '',
          product.lensSize || '',
          product.tempOption || '',
          product.serialNumber || '',
          product.purchaseDate || '',
          (product.geWindowToggle === 'on' ? T.geWindowUsed : T.geWindowNotUsed) || '',
          product.geWindowSize || '',
          product.symptoms || '',
        ];
        rowsToAppend.push([
          ...baseCustomerInfo,
          ...productRow,
          new Date().toLocaleString(lang === 'en' ? 'en-US' : 'ko-KR', { timeZone: 'Asia/Seoul' }),
        ]);
      });
    } else {
      rowsToAppend.push([
        ...baseCustomerInfo,
        '', '', '', '', '', '', '', '',
        new Date().toLocaleString(lang === 'en' ? 'en-US' : 'ko-KR', { timeZone: 'Asia/Seoul' }),
      ]);
    }
    console.log('[submit-repair] Rows to append to sheet:', JSON.stringify(rowsToAppend, null, 2));

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: rowsToAppend,
        },
      });
      console.log('[submit-repair] Data appended to Google Sheet successfully!');
    } catch (sheetError) {
      console.error('[submit-repair] Error appending to Google Sheet:', sheetError);
      hasError = true;
      errorMessage += T.sheetError + ' ';
    }

    if (hasError) {
      console.error(`[submit-repair] Finished with errors: ${errorMessage}`);
      return new Response(JSON.stringify({ message: errorMessage }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const redirectUrl = `/${lang}/support/repair-complete`;
    console.log(`[submit-repair] Success! Redirecting to: ${redirectUrl}`);

    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl,
      },
    });
  } catch (error) {
    console.error('[submit-repair] CRITICAL: Unhandled error processing submission:', error);
    const lang = new URLSearchParams(await request.clone().text()).get('lang') || 'ko';
    const errorMsg = lang === 'en' ? 'Failed to process repair request.' : '수리 요청 처리에 실패했습니다.';
    return new Response(JSON.stringify({ message: errorMsg, error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};


