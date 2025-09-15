// server.js
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: "https://github.com/Shashank-2004"   // your GitHub Pages link
}));
 // You can specify the allowed origin here for better security: app.use(cors({ origin: 'https://shashank-2004.github.io' }));
app.use(bodyParser.json());

// Setup email transporter using environment variables
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Use environment variables for security
    pass: process.env.GMAIL_PASS  // Use environment variables for security
  }
});

app.post("/submit", (req, res) => {
  const { name, mobile, age, email } = req.body;

  if (!name || !mobile || !age || !email) {
    return res.json({ success: false, message: "All fields are required" });
  }

  const mailOptions = {
    from: `"Consultation Form" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER, // The recipient can also be an environment variable
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
      console.error(error);
      return res.json({ success: false, message: "Failed to send email" });
    }
    res.json({ success: true, message: "Email sent successfully!" });
  });
});

// Use a dynamic port provided by the hosting environment
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});