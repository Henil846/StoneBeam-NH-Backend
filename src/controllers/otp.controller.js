const nodemailer = require("nodemailer");

// ─── In-Memory OTP Store ───
// Map<email, { otp, expiresAt, attempts }>
const otpStore = new Map();
// Map<email, { count, windowStart }>
const rateLimitStore = new Map();

const OTP_EXPIRY_MS = 5 * 60 * 1000;       // 5 minutes
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_OTP_REQUESTS = 5;                   // max per window
const MAX_VERIFY_ATTEMPTS = 5;                // max wrong attempts

// ─── Email Transporter ───
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// ─── Generate 6-digit OTP ───
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ─── Clean expired entries periodically ───
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpStore) {
    if (now > data.expiresAt) {
      otpStore.delete(email);
    }
  }
  for (const [email, data] of rateLimitStore) {
    if (now > data.windowStart + RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.delete(email);
    }
  }
}, 60 * 1000); // Clean every minute

// ─── Send OTP ───
async function sendOTP(req, res) {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    // Rate limiting
    const now = Date.now();
    const rateData = rateLimitStore.get(email);

    if (rateData) {
      if (now - rateData.windowStart < RATE_LIMIT_WINDOW_MS) {
        if (rateData.count >= MAX_OTP_REQUESTS) {
          const waitMinutes = Math.ceil(
            (RATE_LIMIT_WINDOW_MS - (now - rateData.windowStart)) / 60000
          );
          return res.status(429).json({
            message: `Too many OTP requests. Please try again in ${waitMinutes} minute(s).`,
          });
        }
        rateData.count += 1;
      } else {
        // Reset window
        rateLimitStore.set(email, { count: 1, windowStart: now });
      }
    } else {
      rateLimitStore.set(email, { count: 1, windowStart: now });
    }

    // Generate OTP
    const otp = generateOTP();
    otpStore.set(email, {
      otp,
      expiresAt: now + OTP_EXPIRY_MS,
      attempts: 0,
    });

    // Always log OTP to console for development
    console.log(`\n════════════════════════════════════════`);
    console.log(`  OTP for ${email}: ${otp}`);
    console.log(`════════════════════════════════════════\n`);

    // Try sending email if credentials are configured
    const emailUser = (process.env.EMAIL_USER || "").trim();
    const emailPass = (process.env.EMAIL_PASS || "").trim();
    let emailSent = false;

    if (emailUser && emailPass && !emailUser.includes("your_gmail") && !emailPass.includes("your_app")) {
      try {
        const transporter = createTransporter();

        const mailOptions = {
          from: `"StoneBeam-NH" <${emailUser}>`,
          to: email,
          subject: "Your StoneBeam-NH Verification Code",
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #1a1a2e; border-radius: 16px; overflow: hidden;">
              <div style="background: linear-gradient(135deg, #7b2cbf, #9d4edd); padding: 32px 24px; text-align: center;">
                <h1 style="color: #fff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 2px;">SB</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">StoneBeam-NH</p>
              </div>
              <div style="padding: 32px 24px; text-align: center;">
                <h2 style="color: #fff; font-size: 20px; margin: 0 0 8px;">Email Verification</h2>
                <p style="color: #a0a0b8; font-size: 14px; margin: 0 0 24px;">Use the code below to verify your email address</p>
                <div style="background: rgba(123, 44, 191, 0.15); border: 1px solid rgba(123, 44, 191, 0.3); border-radius: 12px; padding: 20px; display: inline-block;">
                  <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #9d4edd;">${otp}</span>
                </div>
                <p style="color: #a0a0b8; font-size: 13px; margin: 24px 0 0;">This code expires in <strong style="color: #fff;">5 minutes</strong></p>
                <p style="color: #666; font-size: 12px; margin: 16px 0 0;">If you didn't request this, please ignore this email.</p>
              </div>
              <div style="padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
                <p style="color: #555; font-size: 11px; margin: 0;">© 2026 StoneBeam-NH. All rights reserved.</p>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;
        console.log(`✅ Email sent successfully to ${email}`);
      } catch (emailErr) {
        console.warn(`⚠ Email failed (using console OTP instead):`, emailErr.message);
      }
    } else {
      console.log(`ℹ Email credentials not configured — check OTP in console above`);
    }

    return res.status(200).json({
      message: emailSent
        ? "OTP sent successfully. Please check your email."
        : "OTP generated! Check your backend terminal for the code.",
    });
  } catch (err) {
    console.error("Send OTP error:", err);
    return res.status(500).json({
      message: "Failed to send OTP. Please try again later.",
    });
  }
}

// ─── Verify OTP ───
async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const storedData = otpStore.get(email);

    if (!storedData) {
      return res.status(400).json({
        message: "No OTP found for this email. Please request a new one.",
        expired: true,
      });
    }

    // Check expiry
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({
        message: "OTP has expired. Please request a new one.",
        expired: true,
      });
    }

    // Check max attempts
    if (storedData.attempts >= MAX_VERIFY_ATTEMPTS) {
      otpStore.delete(email);
      return res.status(429).json({
        message: "Too many failed attempts. Please request a new OTP.",
        expired: true,
      });
    }

    // Compare
    if (storedData.otp !== otp.toString().trim()) {
      storedData.attempts += 1;
      const remaining = MAX_VERIFY_ATTEMPTS - storedData.attempts;
      return res.status(400).json({
        message: `Invalid OTP. ${remaining} attempt(s) remaining.`,
        verified: false,
      });
    }

    // Success — remove OTP from store
    otpStore.delete(email);

    return res.status(200).json({
      message: "Email verified successfully!",
      verified: true,
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({
      message: "Verification failed. Please try again.",
    });
  }
}

module.exports = { sendOTP, verifyOTP };
