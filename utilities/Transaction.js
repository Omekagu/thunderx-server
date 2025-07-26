import Transaction from '../models/Transaction'

export async function logTransaction ({
  userId,
  method,
  amount,
  coin,
  status,
  description
}) {
  try {
    await Transaction.create({
      userId,
      type: method,
      amount,
      coin,
      status,
      description,
      date: new Date()
    })
  } catch (err) {
    console.error('Failed to log transaction:', err.message)
  }
}
