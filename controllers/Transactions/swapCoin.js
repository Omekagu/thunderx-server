import Transactions from '../../models/Transaction.js'
import User from '../../models/UserModel.js'
import UserWallet from '../../models/UserWallet.js'

export const swapCoins = async (req, res) => {
  const { userId, fromCoin, toCoin, amount, receiveAmount } = req.body

  const user = await User.findById(userId)
  const wallets = await UserWallet.find({ userId })

  const fromWallet = wallets.find(w => w.symbol === fromCoin)
  const toWallet = wallets.find(w => w.symbol === toCoin)

  if (!fromWallet || fromWallet.balance < amount) {
    return res.status(400).json({ error: 'Insufficient balance' })
  }

  // Update balances
  fromWallet.balance -= parseFloat(amount)
  if (toWallet) {
    toWallet.balance += parseFloat(receiveAmount)
  } else {
    await UserWallet.create({
      userId,
      symbol: toCoin,
      balance: parseFloat(receiveAmount),
      network: 'Custom',
      walletAddress: '',
      decimals: 18
    })
  }

  await fromWallet.save()
  if (toWallet) await toWallet.save()

  await Transactions.create({
    userId,
    amount: parseFloat(receiveAmount),
    coin: toCoin,
    type: 'Coin Swap',
    status: 'success',
    method: 'Wallet',
    receipt: ''
  })

  res.json({ message: 'Swap successful' })
}
