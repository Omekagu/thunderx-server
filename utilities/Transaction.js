import Transaction from '../models/Transaction.js'

export async function logTransaction ({
  userId,
  method,
  amount,
  coin,
  status,
  description,
  receiptPath
}) {
  try {
    await Transaction.create({
      userId,
      type: method,
      amount,
      coin,
      status,
      description,
      receiptPath,
      date: new Date()
    })
  } catch (err) {
    console.error('Failed to log transaction:', err.message)
  }
}
