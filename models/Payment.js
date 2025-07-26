// models/Transaction.js
const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  coin: String,
  type: { type: String, enum: ['Buy', 'Sell'], required: true },
  method: { type: String },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending'
  },
  receipt: String,
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Transaction', TransactionSchema)
