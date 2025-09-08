import Transactions from '../../models/Transaction.js'
import withdrawalModel from '../../models/withdrawal.js'
import User from '../../models/UserModel.js'
import UserWallet from '../../models/UserWallet.js'

export const withdrawFunds = async (req, res) => {
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
      bankCountry,
      bankSwiftCode,
      cashAppTag,
      applePayNumber
    } = req.body

    if (!userId || !amount || !method || !walletSymbol) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields.' })
    }

    const user = await User.findById(userId)
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: 'User not found.' })

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

    // Deduct from wallet
    wallet.balance = Number(wallet.balance) - Number(amount)
    await wallet.save()

    // Build details object
    let details = {}
    if (method === 'crypto') {
      if (!cryptoAddress)
        return res
          .status(400)
          .json({ success: false, message: 'Crypto address required.' })
      details = { cryptoAddress }
    } else if (method === 'bank') {
      if (!bankName || !accountNumber || !accountName || !bankCountry)
        return res
          .status(400)
          .json({ success: false, message: 'Bank info required.' })
      details = {
        bankName,
        accountNumber,
        accountName,
        bankCountry,
        bankSwiftCode
      }
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

    // Record transaction
    const transaction = await Transactions.create({
      userId,
      amount: parseFloat(amount),
      coin: walletSymbol,
      type: 'Withdraw',
      status: 'pending',
      method,
      details
    })

    // Record withdrawal linked to transaction
    await withdrawalModel.create({
      transactionId: transaction._id,
      userId,
      amount: parseFloat(amount),
      coin: walletSymbol,
      method,
      details,
      status: 'pending'
    })

    res.json({ success: true, message: 'Withdrawal request submitted.' })
  } catch (err) {
    console.error('Withdrawal error:', err)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}
