import investmentPlans from '../../models/InvestmentplanModel.js'
import InvestmentplanModel from '../../models/InvestmentplanModel.js'
import Transactions from '../../models/Transaction.js'
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
    if (amount < plan.minAmount || amount > plan.maxAmount) {
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
    const duration = parseInt(plan.payoutFrequency, 10) || 0
    const totalProfit = amount * (plan.profitRate / 100) * duration
    const expectedReturn = parseFloat((amount + totalProfit).toFixed(2))

    // Create the user investment entry
    const newInvestment = await UserInvestment.create({
      userId,
      planId,
      amount,
      walletSymbol,
      walletAddress,
      dailyProfitRate: plan.profitRate,
      durationDays: duration, // normalized field
      startDate: new Date(),
      nextPayoutDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
      expectedReturn,
      currentDay: 0,
      totalPaid: 0,
      status: 'active',
      lastUpdated: new Date()
    })

    await Transactions.create({
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

// export const getUserInvestments = async (req, res) => {
//   try {
//     const userId = req.params.userId

//     let investments = await UserInvestment.find({ userId })
//       .populate({
//         path: 'planId',
//         select: 'title category profitRate durationDays minDeposit maxDeposit'
//       })
//       .sort({ createdAt: -1 })

//     // Check and update completed status
//     const now = new Date()

//     for (let investment of investments) {
//       const startDate = new Date(investment.startDate)
//       const endDate = new Date(startDate)
//       endDate.setDate(startDate.getDate() + investment.durationDays)

//       if (now >= endDate && investment.status !== 'completed') {
//         investment.status = 'completed'
//         await investment.save()

//         // Credit the user's wallet used for investing
//         const wallet = await UserWallet.findOne({
//           userId: investment.userId,
//           symbol: investment.walletSymbol,
//           walletAddress: investment.walletAddress
//         })

//         if (wallet) {
//           wallet.balance += investment.expectedReturn
//           await wallet.save()

//           // Record a transaction for the payout
//           await Transaction.create({
//             userId: investment.userId,
//             amount: investment.expectedReturn,
//             coin: investment.walletSymbol,
//             type: 'Investment-Payout',
//             status: 'success',
//             method: 'Wallet',
//             receipt: investment._id?.toString() || ''
//           })
//         }
//       }
//     }

//     // Re-fetch to return updated statuses
//     investments = await UserInvestment.find({ userId })
//       .populate({
//         path: 'planId',
//         select: 'title category profitRate durationDays minDeposit maxDeposit'
//       })
//       .sort({ createdAt: -1 })

//     res.status(200).json({ status: 'ok', data: investments })
//   } catch (err) {
//     res.status(500).json({ status: 'error', message: err.message })
//   }
// }

export const getUserInvestments = async (req, res) => {
  try {
    const userId = req.params.userId

    // Fetch investments and populate plan details
    const investments = await UserInvestment.find({ userId })
      .populate({
        path: 'planId',
        select:
          'title name category profitRate durationType durationDays minDeposit maxDeposit'
      })
      .sort({ createdAt: -1 })

    // Send data directly; frontend handles all calculations
    res.status(200).json({ status: 'ok', data: investments })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

export const getAllUserInvestments = async (req, res) => {
  try {
    const investments = await UserInvestment.find()
      .populate({ path: 'userId', select: 'firstname lastname email' })
      .populate({
        path: 'planId',
        select:
          'title name category profitRate durationType durationDays minDeposit maxDeposit'
      })
      .sort({ createdAt: -1 })

    res.status(200).json({ status: 'ok', data: investments })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

export const createInvestmentplan = async (req, res) => {
  console.log('Create Plan Req Body:', req.body)
  try {
    const {
      category,
      name,
      profitRate,
      durationType,
      minAmount,
      maxAmount,
      payoutFrequency,
      capitalBack
    } = req.body
    const newPlan = await investmentPlans.create({
      name,
      profitRate,
      minAmount,
      maxAmount,
      payoutFrequency,
      durationType,
      capitalBack,
      category
    })
    console.log('New Investment Plan Created:', newPlan)
    return res.status(201).json({ status: 'ok', data: newPlan })
  } catch (error) {
    console.error('API Create Plan Error:', error)
    console.log('Error Details:', error)
    return res
      .status(500)
      .json({ status: 'error', message: 'Internal server error' })
  }
}

// DELETE
export const deleteInvestmentPlan = async (req, res) => {
  await InvestmentplanModel.findByIdAndDelete(req.params.id)
  res.json({ success: true, message: 'Deleted successfully' })
}

// UPDATE
export const updateInvestmentPlan = async (req, res) => {
  const updated = await InvestmentplanModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
  res.json({ success: true, data: updated })
}
