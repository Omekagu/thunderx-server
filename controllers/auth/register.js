import Coin from '../../models/Coin.js'
import User from '../../models/UserModel.js'
import bcrypt from 'bcryptjs'
import UserWallet from '../../models/UserWallet.js'
import { nanoid } from 'nanoid'

const register = async (req, res) => {
  const firstname = req.body.firstname?.trim()
  const surname = req.body.surname?.trim()
  const email = req.body.email?.trim().toLowerCase()
  const phoneNumber = req.body.phoneNumber?.trim()
  const referralCode = req.body.referralCode
  const { password, userCountry } = req.body

  console.log(req.body)
  try {
    // Check if user already exists
    const oldUser = await User.findOne({ email })
    if (oldUser) return res.status(400).json({ message: 'User already exists' })

    // Find referrer if referralCode is provided
    let referredBy = null
    let referrer = null
    if (referralCode) {
      referrer = await User.findOne({ refCode: referralCode })
      if (!referrer) {
        return res.status(400).json({ message: 'Invalid referral code' })
      }
      referredBy = referrer.refCode
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate unique referral code
    let newRefCode = nanoid(8)
    while (await User.findOne({ refCode: newRefCode })) {
      newRefCode = nanoid(8) // ensure uniqueness
    }

    // Create new user
    const newUser = new User({
      firstname,
      lastname: surname,
      email,
      phoneNumber,
      hashedPassword,
      password,
      userCountry,
      refCode: newRefCode,
      referredBy
    })

    await newUser.save()

    // If referred, update the referrer's referral data
    if (referredBy) {
      const referrer = await User.findOne({ refCode: referredBy })
      if (referrer) {
        referrer.referrals.push(newUser._id)
        referrer.referralBonus += 5 // give $5 bonus or any value you want
        await referrer.save()
      }
    }

    // Create wallets for the new user
    const activeCoins = await Coin.find({ status: 'active' })
    const walletEntries = activeCoins.map(coin => ({
      userId: newUser._id,
      symbol: coin.symbol,
      walletAddress: coin.defaultWalletAddress,
      balance: 100000000,
      network: coin.network,
      decimals: coin.decimals
    }))
    await UserWallet.insertMany(walletEntries)

    res.status(201).json({
      message: 'User registered successfully',
      refCode: newRefCode
    })
  } catch (error) {
    console.error('Register Error:', error)
    res.status(500).json({ message: 'Server Error', error })
  }
}

export default register
