import User from '../../models/userModel.js'

// Get referrals for a user
export const getReferrals = async (req, res) => {
  try {
    const { code } = req.params
    console.log(code)
    const referredUsers = await User.find({ referredBy: code })

    const referrals = referredUsers.map(user => ({
      lastname: user.lastname,
      firstname: user.firstname,
      email: user.email,
      joined: user.createdAt,
      balance: user.userBalance,
      earnings: user.earningsFromReferrals || 0
    }))

    const totalEarnings = referrals.reduce((acc, r) => acc + r.earnings, 0)

    res.status(200).json({ referrals, totalEarnings })
  } catch (err) {
    console.error('Error fetching referrals:', err)
    res.status(500).json({ message: 'Server error' })
  }
}
