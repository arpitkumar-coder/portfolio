const { pool } = require("../config/db");
const { sendContactEmail } = require("../services/emailService");

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function createContact(req, res, next) {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const subject = String(req.body.subject || "").trim();
    const message = String(req.body.message || "").trim();

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject and message are required."
      });
    }

    if (name.length < 2 || name.length > 80) {
      return res.status(400).json({ success: false, message: "Name must be 2-80 characters." });
    }
    if (!validEmail(email) || email.length > 120) {
      return res.status(400).json({ success: false, message: "Please enter a valid email." });
    }
    if (subject.length < 3 || subject.length > 150) {
      return res.status(400).json({ success: false, message: "Subject must be 3-150 characters." });
    }
    if (message.length < 10 || message.length > 2000) {
      return res.status(400).json({ success: false, message: "Message must be 10-2000 characters." });
    }

    const result = await pool.query(
      `INSERT INTO contacts (name, email, subject, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id, created_at`,
      [name, email, subject, message]
    );

    const contact = { id: result.rows[0].id, name, email, subject, message };

    try {
      await sendContactEmail(contact);
    } catch (emailError) {
      console.error("Email notification failed:", emailError.message);
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { createContact };
