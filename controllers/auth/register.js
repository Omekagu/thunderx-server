import Coin from '../../models/Coin.js'
import User from '../../models/userModel.js'
import bcrypt from 'bcryptjs'
import UserWallet from '../../models/UserWallet.js'
import { nanoid } from 'nanoid'
import sendEmail from '../../utilities/sendEmail.js'

const register = async (req, res) => {
  const firstname = req.body.firstname?.trim()
  const surname = req.body.surname?.trim()
  const email = req.body.email?.trim().toLowerCase()
  const phoneNumber = req.body.phoneNumber?.trim()
  const referralCode = req.body.referralCode
  const { password, userCountry } = req.body

  try {
    // Check if user already exists
    const oldUser = await User.findOne({ email })
    if (oldUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Handle referral
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
      newRefCode = nanoid(8)
    }

    // Create new user
    const newUser = new User({
      firstname,
      lastname: surname,
      email,
      phoneNumber,
      password,
      hashedPassword, // ✅ only save hashed password
      userCountry,
      refCode: newRefCode,
      referredBy
    })

    await newUser.save()

    // If referred, update referrer's data
    if (referredBy && referrer) {
      referrer.referrals.push(newUser._id)
      referrer.referralBonus += 5 // ✅ match comment
      await referrer.save()
    }

    // Create wallets for user
    const activeCoins = await Coin.find({ status: 'active' })
    const walletEntries = activeCoins.map(coin => ({
      userId: newUser._id,
      symbol: coin.symbol,
      walletAddress: coin.defaultWalletAddress, // ❗ consider unique generation later
      balance: 0,
      network: coin.network,
      decimals: coin.decimals
    }))
    await UserWallet.insertMany(walletEntries)

    // Send welcome email
    await sendEmail(
      newUser.email,
      'Welcome to Our Platform!',
      `
        <p>Hi <b>${newUser.firstname}</b>,</p>
        <p>Welcome to our investment platform! Your account has been created successfully.</p>
        <p>Your referral code: <b>${newRefCode}</b></p>
        <p>Start exploring your dashboard and enjoy our services.</p>
      `
    )
    // Send welcome email
    await sendEmail(
      process.env.ADMIN_EMAIL,
      'New User Registration',
      `
        <p>Hi Admin,</p>
        <p>A new user has registered on the platform:</p>
        <ul>
          <li><b>Name:</b> ${newUser.firstname} ${newUser.lastname}</li>
          <li><b>Email:</b> ${newUser.email}</li>
          <li><b>Phone:</b> ${newUser.phoneNumber}</li>
          <li><b>Referral Code:</b> ${newRefCode}</li>
        </ul>
        <p>Login to the admin panel to review the new user.</p>
      `
    )

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
