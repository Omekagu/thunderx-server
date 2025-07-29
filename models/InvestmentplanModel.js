import mongoose from 'mongoose'

const InvestmentPlanSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  profitRate: { type: Number, required: true }, // daily profit %
  durationDays: { type: Number, required: true },
  minDeposit: { type: Number, required: true },
  maxDeposit: { type: Number, required: true },
  minWithdraw: { type: Number, default: 50 },
  payoutFrequency: { type: String, enum: ['daily'], default: 'daily' },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.InvestmentPlan ||
  mongoose.model('InvestmentPlan', InvestmentPlanSchema)
