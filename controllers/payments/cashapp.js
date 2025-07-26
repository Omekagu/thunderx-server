import { logTransaction } from '../../utilities/Transaction.js'

export const cashappPay = async (req, res) => {
  const { amount, coin, userId } = req.body
  const receiptPath = req.file?.path

  await logTransaction({
    userId,
    amount,
    coin,
    method: 'Cash App',
    status: 'awaiting payment',
    receiptPath
  })
  res.json({ tag: 'yourCashTagHere', transactionId: newTx._id })
}
