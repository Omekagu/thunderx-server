import { logTransaction } from '../../utilities/Transaction.js'

export const cashappPay = async (req, res) => {
  try {
    const { amount, coin, userId } = req.body
    const receiptPath = req.file?.path

    const newTx = await logTransaction({
      userId,
      amount,
      coin,
      method: 'Cash App',
      status: 'awaiting payment',
      receiptPath
    })

    res.json({ tag: 'yourCashTagHere', transactionId: newTx._id })
  } catch (err) {
    console.error('Cash App payment error:', err)
    res.status(500).json({ message: 'Payment failed' })
  }
}
