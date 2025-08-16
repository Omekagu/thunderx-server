import Transaction from '../../models/Transaction.js'
import User from '../../models/userModel.js'
import UserWallet from '../../models/UserWallet.js'

export const withdrawFunds = async (req, res) => {
  console.log('Withdrawal request received:', req.body)
  try {
    const {
      userId,
      amount,
      method,
      walletSymbol,
      cryptoAddress,
      bankName,
      accountNumber,
      accountName,
      cashAppTag,
      applePayNumber
    } = req.body

    // Validation
    if (!userId || !amount || !method || !walletSymbol) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields.' })
    }

    // Get user
    const user = await User.findById(userId)
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: 'User not found.' })

    // Get wallet from UserWallet collection
    const wallet = await UserWallet.findOne({ userId, symbol: walletSymbol })
    if (!wallet)
      return res
        .status(400)
        .json({ success: false, message: 'Wallet not found.' })

    if (Number(wallet.balance) < Number(amount)) {
      return res
        .status(400)
        .json({ success: false, message: 'Insufficient wallet balance.' })
    }

    // Deduct from wallet and save
    wallet.balance = Number(wallet.balance) - Number(amount)
    await wallet.save()

    // Build withdrawal details object
    let details = {}
    if (method === 'crypto') {
      if (!cryptoAddress)
        return res
          .status(400)
          .json({ success: false, message: 'Crypto address required.' })
      details = { cryptoAddress }
    } else if (method === 'bank') {
      if (!bankName || !accountNumber || !accountName)
        return res
          .status(400)
          .json({ success: false, message: 'Bank info required.' })
      details = { bankName, accountNumber, accountName }
    } else if (method === 'cashapp') {
      if (!cashAppTag)
        return res
          .status(400)
          .json({ success: false, message: 'Cash App Tag required.' })
      details = { cashAppTag }
    } else if (method === 'applepay') {
      if (!applePayNumber)
        return res
          .status(400)
          .json({ success: false, message: 'Apple Pay number required.' })
      details = { applePayNumber }
    }

    // Record transaction as pending
    await Transaction.create({
      userId,
      amount: parseFloat(amount),
      coin: walletSymbol,
      type: 'Withdraw',
      status: 'pending',
      method,
      details
    })

    res.json({ success: true, message: 'Withdrawal request submitted.' })
  } catch (err) {
    console.error('Withdrawal error:', err)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}
