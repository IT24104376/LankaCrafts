import crypto from 'crypto';

const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID || '1226424';
const PAYHERE_SECRET = process.env.PAYHERE_SECRET || 'GiDStKxCdHWjQaBgwOwoBuRg5rOkMWGf';
const PAYHERE_BASE_URL = process.env.PAYHERE_MODE === 'live'
  ? 'https://www.payhere.lk/pay/checkout'
  : 'https://sandbox.payhere.lk/pay/checkout';

export function generatePaymentHash(orderId, amount, currency = 'LKR') {
  const hash = crypto.createHash('sha256');
  hash.update(PAYHERE_SECRET + orderId + amount.toFixed(2) + currency + PAYHERE_MERCHANT_ID);
  return hash.digest('hex').toUpperCase();
}

export function createPaymentLink(payment) {
  const { orderId, amount, currency = 'LKR', items, customerName, email, phone, address, city, country } = payment;

  const hash = generatePaymentHash(orderId, amount, currency);

  const params = new URLSearchParams({
    merchant_id: PAYHERE_MERCHANT_ID,
    return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/crafts/payment/success`,
    cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/crafts/payment/cancel`,
    notify_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/notify`,
    order_id: orderId,
    items: items,
    amount: amount.toFixed(2),
    currency: currency,
    hash: hash,
    first_name: customerName.split(' ')[0],
    last_name: customerName.split(' ').slice(1).join(' ') || '',
    email: email,
    phone: phone,
    address: address || '',
    city: city || '',
    country: country || 'Sri Lanka',
  });

  return `${PAYHERE_BASE_URL}?${params.toString()}`;
}

export function verifyPaymentNotification(orderId, amount, statusCode) {
  if (statusCode !== '2') {
    return false;
  }

  return true;
}

export async function handlePaymentNotification(req) {
  const { order_id, payment_status, payhere_amount, payhere_currency } = req.body;

  if (payment_status !== '2') {
    return { success: false, orderId: order_id };
  }

  return { success: true, orderId: order_id };
}