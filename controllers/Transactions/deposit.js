// controllers/depositController.js
import DepositModel from '../../models/depositModel.js'
import Transactions from '../../models/Transaction.js'
import User from '../../models/userModel.js'

// User creates a deposit request
export const createDeposit = async (req, res) => {
  try {
    const { userId, amount, method, walletId, details, receipt } = req.body

    // 1. Create Transaction first
    const transaction = await Transactions.create({
      userId,
      type: 'Deposit',
      amount: parseFloat(amount),
      coin: walletId, // assuming walletId represents the coin symbol
      method,
      status: 'pending'
    })

    // 2. Link Deposit to Transaction
    const deposit = await DepositModel.create({
      userId,
      transactionId: transaction._id,
      amount,
      method,
      walletId,
      details,
      receipt
    })

    res.status(201).json(deposit)
  } catch (err) {
    console.error('Error creating deposit:', err)
    res.status(500).json({ message: err.message })
  }
}

// Admin updates deposit status
export const updateDepositStatus = async (req, res) => {
  try {
    const { status } = req.body
    const deposit = await DepositModel.findById(req.params.id)
    if (!deposit) return res.status(404).json({ message: 'Deposit not found' })

    deposit.status = status
    if (status === 'approved') {
      deposit.approvedAt = new Date()
      // credit user balance
      await User.findByIdAndUpdate(deposit.userId, {
        $inc: { balance: deposit.amount }
      })
    }
    await deposit.save()

    // Mirror status in transaction
    await Transaction.findByIdAndUpdate(deposit.transactionId, {
      status: status === 'approved' ? 'success' : status
    })

    res.json(deposit)
  } catch (err) {
    console.error('Error updating deposit status:', err)
    res.status(500).json({ message: err.message })
  }
}

export const getDeposits = async (req, res) => {
  try {
    const deposits = await DepositModel.find()
      .populate('userId', 'firstname lastname email')
      .populate('transactionId')
    res.json(deposits)
  } catch (err) {
    console.error('Error fetching deposits:', err)
    res.status(500).json({ message: err.message })
  }
}
