import DepositModel from '../../models/depositModel.js'
import Transactions from '../../models/Transaction.js'
import { v4 as uuidv4 } from 'uuid'
import UserWallet from '../../models/UserWallet.js'

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

// Get all deposits with user details
export const getAllDeposits = async (req, res) => {
  try {
    const deposits = await DepositModel.find()
      .populate('userId', 'firstname lastname email')
      .populate('walletId', 'symbol balance')

    res.json(deposits)
  } catch (err) {
    console.error('Error fetching deposits:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// Update deposit status and credit wallet if success
export const updateDepositStatus = async (req, res) => {
  try {
    const { status } = req.body // "success" | "rejected"
    const deposit = await DepositModel.findById(req.params.id)

    if (!deposit) return res.status(404).json({ message: 'Deposit not found' })

    deposit.status = status
    if (status === 'success') deposit.approvedAt = new Date()
    await deposit.save()

    // ✅ Map withdrawal status -> transaction status
    let txStatus = 'pending'
    if (status === 'success') txStatus = 'success'
    if (status === 'rejected') txStatus = 'failed'

    await Transactions.findByIdAndUpdate(deposit.transactionId, {
      status: txStatus
    })

    if (status === 'success') {
      const wallet = await UserWallet.findById(deposit.walletId)
      if (wallet) {
        const addAmount = Number(deposit.convertedAmount) // ensure number
        wallet.balance = Number(wallet.balance || 0) + addAmount
        await wallet.save()
      }
    }

    res.json(deposit)
  } catch (err) {
    console.error('Error updating deposit:', err)
    res.status(500).json({ message: 'Server error' })
  }
}
