import mongoose from 'mongoose'

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  coin: { type: String, required: true }, // e.g. "USD", "BTC", "ETH"
  type: {
    type: String,
    enum: [
      'Deposit',
      'Withdraw',
      'Coin Swap',
      'Buy',
      'Sell',
      'Interest',
      'Loan',
      'Transfer',
      'Investment - Payout',
      'Referral',
      'Investment' // ✅ Added to track investment funding
    ],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'awaiting payment', 'success', 'rejected', 'failed'],
    default: 'pending'
  },
  method: { type: String, required: true }, // e.g. "Stripe", "Cash App", "Wallet"
  receipt: { type: String },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Transaction ||
  mongoose.model('Transaction', TransactionSchema)
