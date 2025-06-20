const nodemailer = require("nodemailer");
const path = require("path");

// === TRANSPORTER ===
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// === BASE WRAPPER TEMPLATE ===
const baseWrapper = (content) => `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f8ff; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,0.05); padding: 32px;">
      <div style="text-align: center;">
        <img src="cid:logoImage" alt="Namma Oor Offers Logo" style="width: 110px; height: 110px; object-fit: contain; margin-bottom: 14px;" />
        <h1 style="color: #4a6bff; font-size: 24px; margin: 0;">Namma Oor Offers</h1>
        <hr style="border: none; height: 2px; background: #d0e4ff; margin: 16px 0 30px;">
      </div>
      ${content}
      <div style="margin-top: 40px; text-align: center; font-size: 13px; color: #777;">
        <p>You’re receiving this email from Namma Oor Offers.</p>
        <p>If you didn’t request this, please ignore this message.</p>
      </div>
    </div>
  </div>
`;

// === EMAIL TEMPLATES ===
const templates = {
  otp: (otp) =>
    baseWrapper(`
      <h2 style="color: #333; text-align: center;">🔐 Your OTP Code</h2>
      <p style="font-size: 16px; text-align: center; color: #555;">
        Use the following One-Time Password (OTP) to verify your email address:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 28px; font-weight: bold; color: #4a6bff; background: #eaf4ff; padding: 14px 30px; border-radius: 10px; display: inline-block;">
          ${otp}
        </span>
      </div>
      <p style="font-size: 14px; text-align: center; color: #555;">
        This OTP is valid for 10 minutes.
      </p>
    `),

  reset: (link) =>
    baseWrapper(`
      <h2 style="color: #333; text-align: center;">🔁 Password Reset</h2>
      <p style="font-size: 16px; text-align: center; color: #555;">
        Click the button below to reset your password:
      </p>
      <div style="text-align: center; margin-top: 20px;">
        <a href="${link}" style="background-color: #5ac8fa; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="margin-top: 20px; font-size: 14px; text-align: center; color: #555;">
        If you didn’t request this, you can safely ignore this email.
      </p>
    `),

  welcome: (username) =>
    baseWrapper(`
      <h2 style="color: #333; text-align: center;">🎉 Welcome to Namma Oor Offers, ${username}!</h2>
      <p style="font-size: 16px; text-align: center; color: #555;">
        Start uploading Excel files and visualize your data like never before with beautiful 2D and 3D interactive charts.
      </p>
      <div style="text-align: center; margin-top: 20px;">
        <a href="https://nammaooroffers.com" style="background-color: #4a6bff; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Get Started
        </a>
      </div>
      <p style="margin-top: 20px; text-align: center; color: #444;">
        Welcome aboard,<br/><strong>The Namma Oor Offers Team 📊</strong>
      </p>
    `),
};

// === ATTACHMENTS (LOGO) ===
const logoAttachment = {
  filename: "logo.png",
  path: path.join(__dirname, "../logo/logo.png"),
  cid: "logoImage",
};

// === EMAIL SENDING FUNCTIONS ===
const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"Namma Oor Offers" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: templates.otp(otp),
    attachments: [logoAttachment],
  });
};

const sendResetLink = async (email, link) => {
  await transporter.sendMail({
    from: `"Namma Oor Offers" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password",
    html: templates.reset(link),
    attachments: [logoAttachment],
  });
};

const sendWelcomeEmail = async (email, username) => {
  await transporter.sendMail({
    from: `"Namma Oor Offers" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Welcome to Namma Oor Offers, ${username}!`,
    html: templates.welcome(username),
    attachments: [logoAttachment],
  });
};

// === EXPORTS ===
module.exports = {
  sendOTP,
  sendResetLink,
  sendWelcomeEmail,
};
