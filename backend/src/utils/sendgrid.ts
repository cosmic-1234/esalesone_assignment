// src/utils/email.ts
import sgMail from '@sendgrid/mail';
import * as dotenv from 'dotenv'
dotenv.config()
sgMail.setApiKey(process.env.SENDGRID_API as string);

export async function sendOrderConfirmationEmail(to: string, subject: string, htmlContent: string) {
  const msg = {
    to,
    from: 'baskinson1221@gmail.com',
    subject,
    html: htmlContent,
  };

  await sgMail.send(msg);
  console.log(`Mail send  ${msg} ` )
}
