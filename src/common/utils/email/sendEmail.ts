import nodemailer from 'nodemailer';

export const sendEmail = ({
  to,
  html,
}: {
  to: string;
  subject?: string;
  html: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SEND_EMAIL_HOST,
    port: Number(process.env.SEND_EMAIL_PORT),
    secure: true,
    service: 'gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const main = async () => {
    const info = await transporter.sendMail({
      from: `E-Commerce HTI<${process.env.USER}>`,
      to,
      subject: 'email OTP',
      html,
    });
    console.log(info);
  };
  main().catch((err) => {
    console.log(`Sending Email Error => ${err}`);
  });
};
