import Transaction from '../models/Transaction.js'
console.log(
  'Transaction Type Enum:',
  Transaction.schema.path('type').enumValues
)
console.log(
  'Transaction Status Enum:',
  Transaction.schema.path('status').enumValues
)

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
