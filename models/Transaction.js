import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['Deposit', 'Withdraw', 'Interest', 'Loan', 'Transfer'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending'
    },
    description: {
      type: String
    }
  },
  { timestamps: true }
)

export default mongoose.model('Transaction', transactionSchema)
