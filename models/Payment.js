// models/Transaction.js
const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  userId: String,
  amount: Number,
  coin: String,
  method: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Transaction', transactionSchema)
