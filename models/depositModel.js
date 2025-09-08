// models/deposit.js
import mongoose from 'mongoose'

const depositSchema = new mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ['crypto', 'bank', 'cashapp', 'applepay'],
      required: true
    },
    walletId: { type: String, required: true }, // selected wallet from gateways
    details: { type: Object }, // proof, address, bank info etc
    receipt: { type: String }, // optional uploaded file
    status: {
      type: String,
      enum: ['pending', 'success', 'rejected'],
      default: 'pending'
    },
    approvedAt: { type: Date }
  },
  { timestamps: true }
)

export default mongoose.model('Deposit', depositSchema)
