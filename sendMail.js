import nodemailer from 'nodemailer';
import dotenv from "dotenv";

export default async function sendMail(toEmail, subject, text) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "swetarajak001@gmail.com",
      pass: "fyiu dgpg zdps tbru", // NOT your normal password
    },
  });

  let mailOptions = {
    from: process.env.AUTH_USER,
    to: toEmail,
    subject: subject,
    text: text,
  };
  let info = await transporter.sendMail(mailOptions);
  console.log("Email sent successfully!");
  console.log("Message sent: %s", info.messageId);
}

// sendMail().catch(console.error);

// module.exports = sendMail;
