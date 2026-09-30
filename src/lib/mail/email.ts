import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
  try {
    // 1. Create a transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use "Mailgun", "SendGrid", etc.
      auth: {
        user: process.env.EMAIL_USERNAME, // Your email address
        pass: process.env.EMAIL_PASSWORD, // App password or email password
      },
    });

    // 2. Define email options
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      text,
      html,
    };

    // 3. Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}
