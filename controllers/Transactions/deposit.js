import DepositModel from '../../models/depositModel.js'
import Transactions from '../../models/Transaction.js'
import UserWallet from '../../models/UserWallet.js'
import { jwtSecret } from '../../utilities/jwtSecret.js'
import sendEmail from '../../utilities/sendEmail.js'
import UserInfo from '../../models/UserModel.js'

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

    // ✅ Find user
    const user = await UserInfo.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // ✅ Create matching Transaction
    const transaction = await Transactions.create({
      userId,
      amount: parseFloat(amount),
      coin: walletsymbol,
      type: 'Deposit',
      method,
      status: 'pending'
    })

    // ✅ Create Deposit
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
      reference: jwtSecret
    })

    // ✅ Send Email to User
    await sendEmail(
      user.email,
      '💰 Deposit Received',
      `
      <p>Hi <b>${user.firstname}</b>,</p>
      <p>You made a deposit of <b>$${convertedAmount}</b>. 
      Your transaction is <b>pending admin approval</b>.</p>
      <p>Reference ID: <code>${deposit.reference}</code></p>
      `
    )

    // ✅ Send Email to Admin
    await sendEmail(
      process.env.ADMIN_EMAIL,
      '⚡ New Deposit Alert',
      `
      <p>User <b>${user.firstname} ${user.lastname}</b> (${user.email}) just made a deposit.</p>
      <ul>
        <li><b>Amount:</b> $${convertedAmount}</li>
        <li><b>Method:</b> ${method}</li>
        <li><b>Reference ID:</b> ${deposit.reference}</li>
      </ul>
      <p>Login to the admin panel to review and approve this deposit.</p>
      `
    )

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
