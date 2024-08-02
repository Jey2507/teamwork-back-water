import nodemailer from 'nodemailer';
import createHttpError from 'http-errors';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    if (!to) throw new Error('No recipient email address specified');
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
    };

    console.log(`Sending email to: ${to}`);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Failed to send email', error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
      error
    );
  }
};
