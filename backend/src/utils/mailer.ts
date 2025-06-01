import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv'
dotenv.config()
console.log(process.env.SMTP_USER)
console.log(process.env.SMTP_PASSWORD)
export const transporter = nodemailer.createTransport({
    
  host: 'live.smtp.mailtrap.io',
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendOrderEmail = async (
  to: string,
  subject: string,
  htmlContent: string
) => {
  await transporter.sendMail({
    from: '"Shrirang Wanikar" hello@demomailtrap.co',
    to,
    subject,
    html: htmlContent,
  });
};
