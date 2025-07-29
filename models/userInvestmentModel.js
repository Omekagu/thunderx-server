import mongoose from 'mongoose'

const UserInvestmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InvestmentPlan',
    required: true
  },
  amount: { type: Number, required: true },
  dailyProfitRate: { type: Number, required: true }, // for tracking plan % at investment time
  durationDays: { type: Number, required: true },
  startDate: { type: Date, required: true },
  nextPayoutDate: { type: Date },
  currentDay: { type: Number, default: 0 },
  totalPaid: { type: Number, default: 0 },
  expectedReturn: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.UserInvestment ||
  mongoose.model('UserInvestment', UserInvestmentSchema)
