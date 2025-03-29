const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const { authenticateUser } = require('../middlewares/auth');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

// Multer for file uploads (memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// Create a single, reliable transporter using an admin email account
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD
    }
});

router.post('/send-bulk-email', authenticateUser, upload.array('attachments'), async (req, res) => {
    try {
        const { recipients, subject, body, htmlBody } = req.body;
        let recipientList;
        
        try {
            recipientList = JSON.parse(recipients);
        } catch (error) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid recipients format. Must be a valid JSON array.' 
            });
        }

        if (!recipientList || !Array.isArray(recipientList) || recipientList.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Recipients list is required and must be an array' 
            });
        }
        
        if (!body || !body.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email body cannot be empty' 
            });
        }

        if (!subject || !subject.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email subject cannot be empty' 
            });
        }

        const senderName = req.user?.name || 'System User';
        const replyTo = req.user?.email;

        const attachments = req.files ? req.files.map(file => ({
            filename: file.originalname,
            content: file.buffer
        })) : [];

        const results = { 
            total: recipientList.length, 
            sent: 0, 
            failed: 0, 
            errors: [] 
        };

        // Send emails with rate limiting
        for (const [index, recipient] of recipientList.entries()) {
            try {
                // Basic rate limiting to avoid Gmail's limits
                if (index > 0 && index % 10 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                
                const mailOptions = {
                    from: `"${senderName}" <${process.env.ADMIN_EMAIL}>`,
                    to: recipient,
                    subject: subject,
                    text: body,
                    html: htmlBody || body.replace(/\n/g, '<br>'),
                    attachments,
                    ...(replyTo && { replyTo })
                };
                
                const info = await transporter.sendMail(mailOptions);
                console.log(`Email sent to ${recipient}: ${info.messageId}`);
                results.sent++;
            } catch (error) {
                console.error(`Failed to send email to ${recipient}:`, error);
                results.failed++;
                results.errors.push({ 
                    email: recipient, 
                    error: error.message 
                });
            }
        }

        // Return appropriate response
        if (results.sent === 0) {
            return res.status(500).json({ 
                success: false, 
                message: 'Failed to send all emails', 
                results 
            });
        } else if (results.failed > 0) {
            return res.status(206).json({ 
                success: true, 
                message: `Sent ${results.sent} emails, failed ${results.failed}`, 
                results 
            });
        } else {
            return res.status(200).json({ 
                success: true, 
                message: `Successfully sent ${results.sent} emails`, 
                results 
            });
        }
    } catch (error) {
        console.error('Bulk email error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error sending bulk emails', 
            error: error.message 
        });
    }
});

module.exports = router;