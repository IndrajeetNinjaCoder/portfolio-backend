require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // IMPORTANT (false for 587)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;


    const mailOptions = {
  from: `"Website Contact" <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_USER,
  subject: `📩 ${name} - New Inquiry`,
  html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 25px; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
      
      <h2 style="margin-top: 0; color: #333;">🚀 New Client Inquiry</h2>
      <p style="color: #666; font-size: 14px;">You received a new message from your website contact form.</p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

      <p><strong style="color: #333;">Name:</strong><br/> ${name}</p>

      <p><strong style="color: #333;">Email:</strong><br/>
        <a href="mailto:${email}" style="color: #1a73e8; text-decoration: none;">
          ${email}
        </a>
      </p>

      <p><strong style="color: #333;">Message:</strong></p>
      <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #1a73e8;">
        <p style="margin: 0; color: #444; line-height: 1.6;">
          ${message}
        </p>
      </div>

      <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;" />

      <p style="font-size: 12px; color: #999; text-align: center;">
        This email was sent from your website contact form.
      </p>

    </div>
  </div>
  `,
};

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Email failed" });
  }
});

app.listen(process.env.PORT, () =>
  console.log("Server running on port " + process.env.PORT)
);