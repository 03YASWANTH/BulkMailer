// // routes/payment.js
// const express = require('express');
// const router = express.Router();
// const { authenticateUser } = require('../middlewares/auth');
// const { 
//   createPaymentRequest, 
//   getPaymentRequestById,
//   getUserPaymentRequests,
//   cancelPaymentRequest,
//   processPayment
// } = require('../controllers/paymentController');

// router.use(authenticateUser);

// router.route('/')
//   .post(createPaymentRequest)
//   .get(getUserPaymentRequests);

// router.route('/:id')
//   .get(getPaymentRequestById)
//   .patch(cancelPaymentRequest);

// // This route is for friends to process payment
// router.post('/process/:requestId', processPayment);

// module.exports = router;