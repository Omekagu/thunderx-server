import User from '../../models/UserModel.js'

export const Users = async (req, res) => {
  try {
    const users = await User.find({})
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'error', error })
  }
}
