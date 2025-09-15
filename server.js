// server.js
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

// ✅ Allow only your GitHub Pages frontend
app.use(cors({
  origin: "https://shashank-2004.github.io"
}));
app.use(bodyParser.json());

// ✅ Health check route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

// ✅ Setup email transporter
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,  // must be set in Render dashboard
    pass: process.env.GMAIL_PASS   // App Password, not normal Gmail password
  }
});

// ✅ Form submit route
app.post("/submit", (req, res) => {
  const { name, mobile, age, email } = req.body;
  console.log("📩 Form data received:", req.body);

  if (!name || !mobile || !age || !email) {
    return res.json({ success: false, message: "All fields are required" });
  }

  const mailOptions = {
    from: `"Consultation Form" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,  // send form results to yourself
    replyTo: email,
    subject: "New Consultation Request",
    html: `
      <h2>New Consultation Request</h2>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
        <tr><th align="left">Name</th><td>${name}</td></tr>
        <tr><th align="left">Mobile</th><td>${mobile}</td></tr>
        <tr><th align="left">Age</th><td>${age}</td></tr>
        <tr><th align="left">Email</th><td>${email}</td></tr>
      </table>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Mail error:", error);
      return res.json({ success: false, message: "Failed to send email" });
    }
    console.log("✅ Email sent:", info.response);
    res.json({ success: true, message: "Email sent successfully!" });
  });
});

// ✅ Use dynamic port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
