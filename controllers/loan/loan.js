import LoanPlan from '../../models/LoanPlanModel.js'
import Loan from '../../models/LoanModel.js'
import Transaction from '../../models/Transaction.js'
import UserWallet from '../../models/UserWallet.js'
// import UserWallet from '../../models/UserWallet.js'

export const createLoanPlan = async (req, res) => {
  try {
    const newLoanPlan = await LoanPlan.create(req.body)
    res.status(201).json({ status: 'ok', data: newLoanPlan })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const getAllLoanPlans = async (req, res) => {
  try {
    const loanPlans = await LoanPlan.find().sort({ createdAt: -1 })
    res.status(200).json({ status: 'ok', data: loanPlans })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

// ✅ Delete loan
export const deleteLoan = async (req, res) => {
  try {
    await LoanPlan.findByIdAndDelete(req.params.id)
    res.status(200).json({ status: 'ok', message: 'Loan deleted' })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

// ✅ Update loan
export const updateLoan = async (req, res) => {
  try {
    const loan = await LoanPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
    res.status(200).json({ status: 'ok', data: loan })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

export const applyForLoan = async (req, res) => {
  try {
    const { userId, walletId, amount, loanPurpose, documentUrl } = req.body

    if (!userId || !walletId || !amount || !loanPurpose || !documentUrl) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required'
      })
    }

    // Check for active loan
    const existingLoan = await Loan.findOne({
      userId,
      status: { $in: ['Pending', 'Approved'] }
    })
    if (existingLoan) {
      return res.status(403).json({
        status: 'error',
        message:
          'You already have an active or pending loan. Please settle it before applying for a new one.'
      })
    }

    // Find loan plan
    const loanPlan = await LoanPlan.findOne({ name: loanPurpose })
    if (!loanPlan) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Loan plan not found' })
    }

    // Find wallet to get symbol
    const wallet = await UserWallet.findById(walletId)
    if (!wallet) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Wallet not found' })
    }

    // Calculate interest
    const interestRate = loanPlan.interestRate / 100
    const interest = amount * interestRate
    const totalRepayment = amount + interest

    // Calculate due date
    let dueDate = new Date()
    if (loanPlan.durationType === 'months') {
      dueDate.setMonth(dueDate.getMonth() + loanPlan.duration)
    } else {
      dueDate.setDate(dueDate.getDate() + loanPlan.duration)
    }

    // Create loan
    const loan = await Loan.create({
      userId,
      walletId,
      amount,
      interest,
      totalRepayment,
      term: `${loanPlan.duration} ${loanPlan.durationType}`,
      loanPurpose,
      documentUrl,
      dueDate,
      status: 'Pending'
    })

    // Log transaction with wallet.symbol
    const tx = await Transaction.create({
      userId,
      amount,
      coin: wallet.symbol, // ✅ use wallet symbol here
      type: 'Loan',
      status: 'pending',
      method: 'Wallet',
      receipt: documentUrl
    })

    return res.status(201).json({
      status: 'ok',
      message: 'Loan application submitted successfully',
      data: loan,
      transaction: { id: tx._id, tag: 'thunderxcash' }
    })
  } catch (err) {
    console.error('Loan application error:', err)
    res.status(500).json({ status: 'error', message: err.message })
  }
}

export const getLoanHistory = async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.params.userId }).sort({
      appliedOn: -1
    })
    res.json(loans)
  } catch (error) {
    console.error('Error fetching user loans:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
