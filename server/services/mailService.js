const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
require('dotenv').config(); // Load environment variables

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM;

/**
 * Configure Nodemailer Transporter
 */
const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure:false, // true for SSL, false for TLS
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

/**
 * Route to send payment request email
 */
router.post('/send-payment-request', async (req, res) => {
    const { email, requesterName, amount } = req.body;

    console.log("Received Data:", req.body);

    if (!email || !requesterName || !amount) {
        return res.status(400).json({ success: false, error: "Missing required parameters" });
    }

    try {
        const mailOptions = {
            from: EMAIL_FROM, // Sender's email
            to: email, // Receiver's email
            subject: `Payment Request from ${requesterName}`,
            html: `
                <p>Dear ${requesterName},</p>

                <p><strong>Hi</strong> has requested a payment of <strong>₹${amount}</strong>.</p>

                <p>You can complete the payment securely using the link below:</p>

                <p><a href="" style="background-color:#007bff; color:white; padding:10px 15px; text-decoration:none; border-radius:5px;">Pay Now</a></p>

                <p>If you have any questions, feel free to reply to this email.</p>

                <p>Best Regards,<br>AltPay Team</p>
                
                <hr>
                <p style="font-size:12px; color:gray;">If you didn't request this, please ignore this email. You can <a href="https://yourdomain.com/unsubscribe">unsubscribe</a> anytime.</p>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        res.json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error("Email sending failed:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Route to send payment confirmation email
 */
router.post('/send-payment-confirmation', async (req, res) => {
    const { email, friendName, amount } = req.body;

    if (!email || !friendName || !amount) {
        return res.status(400).json({ success: false, error: "Missing required parameters" });
    }

    try {
        const mailOptions = {
            from: EMAIL_FROM,
            to: email,
            subject: `AltPay: Payment Confirmation`,
            text: `Good news! ${friendName} has paid ₹${amount} on your behalf. Visit the app for details.`,
        };

        const info = await transporter.sendMail(mailOptions);
        res.json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error("Email sending failed:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
