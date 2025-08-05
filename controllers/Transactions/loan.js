import Loan from '../../models/LoanModel.js'
import UserWallet from '../../models/UserWallet.js'

export const applyLoan = async (req, res) => {
  try {
    const { userId, walletId, amount, term, documentUrl } = req.body
    console.log(req.body)
    if (!userId || !walletId || !amount || !term) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // 🔒 Check for existing unpaid loans
    const existingLoan = await Loan.findOne({
      userId,
      status: { $in: ['Pending', 'Approved', 'Rejected'] } // adjust based on your statuses
    })

    if (existingLoan) {
      return res.status(400).json({
        message:
          'You already have an active or unpaid loan. Please repay it before applying again.'
      })
    }

    // ✅ Validate wallet and get balance
    const wallet = await UserWallet.findOne({ _id: walletId, userId })

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' })
    }

    const maxLoanAllowed = wallet.balance * 0.6
    if (amount > maxLoanAllowed) {
      return res.status(400).json({
        message: `Maximum loan allowed is $${maxLoanAllowed.toFixed(2)}`
      })
    }

    // 💰 Calculate interest
    const interestRate = 0.1
    const interest = amount * interestRate
    const totalRepayment = amount + interest

    // 📅 Parse term and calculate due date
    const months = parseInt(term.split(' ')[0])
    const dueDate = new Date()
    dueDate.setMonth(dueDate.getMonth() + months)

    // 📝 Create loan
    const newLoan = new Loan({
      userId,
      walletId,
      amount,
      interest,
      totalRepayment,
      term,
      documentUrl,
      dueDate,
      status: 'pending' // or 'active', based on your flow
    })

    await newLoan.save()

    res.status(201).json({
      message: 'Loan application submitted',
      loan: newLoan
    })
  } catch (err) {
    console.error('Loan application error:', err)
    res.status(500).json({ message: 'Server error' })
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
