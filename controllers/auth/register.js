import Coin from '../../models/Coin.js'
import User from '../../models/UserModel.js'
import bcrypt from 'bcryptjs'
import UserWallet from '../../models/UserWallet.js'

const register = async (req, res) => {
  const {
    firstname,
    surname,
    email,
    phoneNumber,
    referralCode,
    password,
    userCountry
  } = req.body

  try {
    const oldUser = await User.findOne({ email })
    if (oldUser) return res.status(400).json({ message: 'User already exists' })

    console.log(
      firstname,
      surname,
      email,
      phoneNumber,
      referralCode,
      password,
      userCountry
    )

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      firstname,
      surname,
      email,
      phoneNumber,
      referralCode,
      password,
      hashedPassword,
      userCountry
    })
    console.log(newUser)
    await newUser.save()
    const activeCoins = await Coin.find({ status: 'active' })

    // 3. Create wallets for the user
    const walletEntries = activeCoins.map(coin => ({
      userId: User._id,
      symbol: coin.symbol,
      walletAddress: coin.walletAddress, // inherited
      balance: 0,
      network: coin.network,
      decimals: coin.decimals
    }))

    await UserWallet.insertMany(walletEntries)

    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error })
    process.exit(1)
  }
}
export default register
