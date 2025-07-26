import Transaction from '../models/Transaction.js'

export const logTransaction = async ({
  userId,
  amount,
  coin,
  method,
  status,
  receiptPath
}) => {
  const newTx = new Transaction({
    userId,
    amount,
    coin,
    type: 'Buy', // <-- required field
    method,
    status: 'pending', // <-- must match enum in schema
    receipt: receiptPath || null,
    createdAt: new Date()
  })

  return await newTx.save()
}
