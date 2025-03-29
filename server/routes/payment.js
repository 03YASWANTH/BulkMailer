const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { authenticateUser } = require('../middlewares/auth');
const Friend = require('../models/friend');
const {sendPaymentRequestEmail} = require("../services/mailService")

router.post('/', authenticateUser, async (req, res) => {
    try {
        const {name,amount,paymentLink} = req.body;

        if (!paymentLink) 
        {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid input parameters' 
            });
        }

        // Fetch friend details
        const friends = await Friend.find({
            user: req.user._id
        });
        console.log(friends)

        // Send emails to friends
        const emailPromises = friends.map(friend => {
            sendPaymentRequestEmail({
                email: friend.email,
                requesterName: name,
                FriendName:friend.name,
                amount,
                paymentLink
            })
            

            return transporter.sendMail(mailOptions);
        });

        // Wait for all emails to be sent
        await Promise.all(emailPromises);

        res.status(201).json({
            success: true,
            message: 'Payment request created and emails sent',
            paymentRequest
        });

    } catch (error) {
        console.error('Payment request creation error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create payment request',
            error: error.message 
        });
    }
});

module.exports = router;