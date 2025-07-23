import User from '../../models/UserModel.js'
import UserWallet from '../../models/UserWallet.js'

const getUserWithWallets = async (req, res) => {
  try {
    const userId = req.params.userId // or from auth: req.user._id

    const user = await User.findById(userId).select('-password') // hide password
    if (!user) return res.status(404).json({ message: 'User not found' })

    const wallets = await UserWallet.find({ userId })

    res.status(200).json({
      user: {
        firstname: user.firstname,
        surname: user.surname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        userCountry: user.userCountry
      },
      wallets
    })
  } catch (error) {
    console.error('Error fetching user data:', error)
    res.status(500).json({ message: 'Server Error' })
  }
}

export default getUserWithWallets
