import InvestmentplanModel from '../../models/InvestmentplanModel.js'

export const getAllInvestmentPlans = async (req, res) => {
  try {
    const plans = await InvestmentplanModel.find().sort({ minDeposit: 1 })
    res.status(200).json({ success: true, data: plans })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
