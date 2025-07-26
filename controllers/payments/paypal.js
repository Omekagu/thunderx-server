import { logTransaction } from '../../utilities/Transaction'

export const paypalPay = async (req, res) => {
  const { amount, coin, userId } = req.body
  await logTransaction({
    userId,
    amount,
    coin,
    method: 'PayPal',
    status: 'pending'
  })
  res.json({ url: 'https://paypal.com/checkout/fake-link' })
}
