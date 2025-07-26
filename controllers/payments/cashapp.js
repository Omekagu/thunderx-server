import { logTransaction } from '../../utilities/Transaction'

export const cashappPay = async (req, res) => {
  const { amount, coin, userId } = req.body
  await logTransaction({
    userId,
    amount,
    coin,
    method: 'Cash App',
    status: 'awaiting payment'
  })
  res.json({ tag: 'yourCashTagHere' })
}
