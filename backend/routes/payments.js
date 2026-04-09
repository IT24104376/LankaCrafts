import express from 'express';
import { handlePaymentNotification, verifyPaymentNotification } from '../services/paymentService.js';

const router = express.Router();

router.post('/notify', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    const { order_id, payment_status, payhere_amount, payhere_currency, merchant_id } = req.body;
    
    const isValid = verifyPaymentNotification(order_id, parseFloat(payhere_amount), payment_status);
    
    if (isValid) {
      console.log(`[PAYMENT] Order ${order_id} payment successful. Amount: ${payhere_amount} ${payhere_currency}`);
      return res.status(200).send('OK');
    }
    
    console.log(`[PAYMENT] Order ${order_id} payment failed or invalid.`);
    return res.status(400).send('Payment verification failed');
  } catch (err) {
    console.error('[PAYMENT] Notification error:', err);
    return res.status(500).send('Error processing payment');
  }
});

export default router;
