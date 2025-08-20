import type { APIRoute } from 'astro';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  let hasError = false;
  let errorMessage = '';

  try {
    const body = await request.text();
    const params = new URLSearchParams(body);

    const formDataObject: { [key: string]: any } = {};
    for (const [key, value] of params.entries()) {
      // Handle multiple product entries by grouping them
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

    // Normalize products array to remove empty/undefined entries
    if (formDataObject.products) {
      formDataObject.products = formDataObject.products.filter(Boolean);
    }

    console.log('Received repair submission:', formDataObject);


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

    let emailContent = `
      <h1>수리 요청 접수</h1>
      <h2>고객 정보</h2>
      <p><strong>업체명:</strong> ${formDataObject.companyName || '-'}</p>
      <p><strong>주소:</strong> ${formDataObject.address || '-'}</p>
      <p><strong>이름:</strong> ${formDataObject.name || '-'}</p>
      <p><strong>전화번호:</strong> ${formDataObject.phoneNumber || '-'}</p>
      <p><strong>이메일:</strong> ${formDataObject.email || '-'}</p>
    `;

    if (formDataObject.products && formDataObject.products.length > 0) {
      emailContent += `<h2>제품 정보</h2>`;
      formDataObject.products.forEach((product: any, index: number) => {
        emailContent += `
          <h3>제품 #${index + 1}</h3>
          <p><strong>모델명:</strong> ${product.modelName || '-'}</p>
          <p><strong>렌즈 크기:</strong> ${product.lensSize || '-'}</p>
          <p><strong>온도 옵션:</strong> ${product.tempOption || '-'}</p>
          <p><strong>Ge Window 사용 여부:</strong> ${product.geWindowToggle === 'on' ? '사용' : '미사용'}</p>
          <p><strong>Ge Window 크기:</strong> ${product.geWindowSize || '-'}</p>
          <p><strong>시리얼 번호:</strong> ${product.serialNumber || '-'}</p>
          <p><strong>구매 시기:</strong> ${product.purchaseDate || '-'}</p>
          <p><strong>증상:</strong> ${product.symptoms || '-'}</p>
        `;
      });
    }

    const mailOptions = {
      from: process.env.SMTP_USER, // Sender address
      to: 'sue@coxcamera.com',
      subject: '새로운 수리 요청이 접수되었습니다.',
      html: emailContent,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully!');
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      hasError = true;
      errorMessage += '이메일 발송에 실패했습니다. ';
    }
    // --- End Email Sending Logic ---

    // --- Google Sheets Appending Logic ---
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
    const range = '시트1'; // Sheet name

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
          (product.geWindowToggle === 'on' ? '사용' : '미사용') || '',
          product.geWindowSize || '',
          product.symptoms || '',
        ];
        rowsToAppend.push([
          ...baseCustomerInfo,
          ...productRow,
          new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }), // 접수 시간
        ]);
      });
    } else {
      // If no products, append a single row with customer info and empty product fields
      rowsToAppend.push([
        ...baseCustomerInfo,
        '', '', '', '', '', '', '', '', // Empty product fields
        new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }), // 접수 시간
      ]);
    }

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
      console.log('Data appended to Google Sheet successfully!');
    } catch (sheetError) {
      console.error('Error appending to Google Sheet:', sheetError);
      hasError = true;
      errorMessage += '구글 스프레드시트 저장에 실패했습니다. ';
    }
    // --- End Google Sheets Appending Logic ---

    if (hasError) {
      return new Response(JSON.stringify({ message: errorMessage }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // --- Redirection to Completion Page ---
    const queryParams = new URLSearchParams();
    for (const key in formDataObject) {
      if (key !== 'products') {
        queryParams.append(key, formDataObject[key]);
      }
    }
    if (formDataObject.products) {
      formDataObject.products.forEach((product: any, index: number) => {
        for (const pKey in product) {
          queryParams.append(`products[${index}][${pKey}]`, product[pKey]);
        }
      });
    }

    const redirectUrl = `/ko/support/repair-complete?${queryParams.toString()}`;

    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl,
      },
    });
  } catch (error) {
    console.error('Error processing repair submission:', error);
    return new Response(JSON.stringify({ message: 'Failed to process repair request.', error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
