import DepositModel from '../../models/depositModel.js'
import Transactions from '../../models/Transaction.js'
import { v4 as uuidv4 } from 'uuid'

// Create a new deposit
export const createDeposit = async (req, res) => {
  console.log(req.body)

  try {
    const {
      userId,
      walletId,
      method,
      amount,
      coinRate,
      convertedAmount,
      walletsymbol,
      receipt
    } = req.body

    if (
      !userId ||
      !walletId ||
      !amount ||
      !method ||
      !coinRate ||
      !convertedAmount ||
      !walletsymbol ||
      !receipt
    ) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    // Create matching Transaction
    const transaction = await Transactions.create({
      userId,
      amount: parseFloat(amount),
      coin: walletsymbol,
      type: 'Deposit',
      method,
      status: 'pending'
    })

    // Create Deposit
    const deposit = await DepositModel.create({
      userId,
      transactionId: transaction._id,
      walletId,
      walletsymbol,
      method,
      amount,
      coinRate,
      convertedAmount,
      receipt,
      reference: uuidv4()
    })

    res.status(201).json({ message: 'Deposit created', deposit })
  } catch (err) {
    console.error('Error creating deposit:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// Update deposit status (admin)
export const updateDepositStatus = async (req, res) => {
  try {
    const { status } = req.body // "approved" | "rejected"
    const deposit = await DepositModel.findById(req.params.id)

    if (!deposit) return res.status(404).json({ message: 'Deposit not found' })

    deposit.status = status
    if (status === 'approved') deposit.approvedAt = new Date()
    await deposit.save()

    // Mirror status in transaction
    await Transactions.findOneAndUpdate(
      {
        userId: deposit.userId,
        walletId: deposit.walletId,
        amount: deposit.amount
      },
      { status: status === 'approved' ? 'success' : status }
    )

    res.json(deposit)
  } catch (err) {
    console.error('Error updating deposit:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get all deposits for a user
export const getUserDeposits = async (req, res) => {
  try {
    const deposits = await DepositModel.find({
      userId: req.params.userId
    }).sort({
      createdAt: -1
    })
    res.json(deposits)
  } catch (err) {
    console.error('Error fetching deposits:', err)
    res.status(500).json({ message: 'Server error' })
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
