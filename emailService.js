const nodemailer = require("nodemailer");

function createTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

async function sendContactEmail(contact) {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn("SMTP is not configured; email notification skipped.");
    return;
  }

  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_RECEIVER || process.env.SMTP_USER,
    replyTo: contact.email,
    subject: `Portfolio contact: ${contact.subject}`,
    text:
`New portfolio contact

Name: ${contact.name}
Email: ${contact.email}
Subject: ${contact.subject}

Message:
${contact.message}`
  });
}

module.exports = { sendContactEmail };
