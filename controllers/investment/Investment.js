import InvestmentplanModel from '../../models/InvestmentplanModel.js'
import Transaction from '../../models/Transaction.js'
import UserInvestment from '../../models/userInvestmentModel.js'
import UserWallet from '../../models/UserWallet.js'

export const getAllInvestmentPlans = async (req, res) => {
  try {
    const plans = await InvestmentplanModel.find().sort({ minDeposit: 1 })
    res.status(200).json({ success: true, data: plans })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const postUserInvestment = async (req, res) => {
  const { userId, planId, amount, walletSymbol, walletAddress } = req.body

  try {
    // Fetch investment plan
    const plan = await InvestmentplanModel.findById(planId)
    if (!plan) {
      return res.status(404).json({ success: false, msg: 'Plan not found' })
    }

    // Validate amount against plan limits
    if (amount < plan.minDeposit || amount > plan.maxDeposit) {
      return res
        .status(400)
        .json({ success: false, msg: 'Invalid investment amount' })
    }

    // Check user's wallet
    const wallet = await UserWallet.findOne({
      userId,
      symbol: walletSymbol,
      walletAddress
    })
    if (!wallet) {
      return res.status(404).json({ success: false, msg: 'Wallet not found' })
    }

    if (wallet.balance < amount) {
      return res
        .status(400)
        .json({ success: false, msg: 'Insufficient wallet balance' })
    }

    // Calculate expected return: daily profit * duration
    const totalProfit = amount * (plan.profitRate / 100) * plan.durationDays
    const expectedReturn = parseFloat((amount + totalProfit).toFixed(2))

    // Deduct investment from wallet
    wallet.balance -= amount
    await wallet.save()

    // Create the user investment entry
    const newInvestment = await UserInvestment.create({
      userId,
      planId,
      amount,
      dailyProfitRate: plan.profitRate,
      durationDays: plan.durationDays,
      startDate: new Date(),
      nextPayoutDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // next day
      expectedReturn,
      currentDay: 0,
      totalPaid: 0,
      status: 'active',
      lastUpdated: new Date()
    })

    await Transaction.create({
      userId,
      amount,
      coin: walletSymbol,
      type: 'Investment',
      status: 'success',
      method: 'Wallet',
      receipt: '' // optional, or store investment ID
    })

    return res.status(201).json({
      success: true,
      msg: 'Investment started successfully',
      data: newInvestment
    })
  } catch (err) {
    console.error('Start Investment Error:', err)
    return res.status(500).json({ success: false, msg: 'Server error' })
  }
}

export const getUserInvestments = async (req, res) => {
  try {
    const userId = req.params.userId

    const investments = await UserInvestment.find({ userId })
      .populate({
        path: 'planId',
        select: 'title category profitRate durationDays minDeposit maxDeposit' // Adjust fields as needed
      })
      .sort({ createdAt: -1 }) // optional: newest first

    res.status(200).json({ status: 'ok', data: investments })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}
