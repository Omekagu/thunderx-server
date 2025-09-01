import User from '../../models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '../../utilities/jwtSecret.js'

const login = async (req, res) => {
  const { email, password } = req.body
  console.log(email, password)

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res
        .status(404)
        .json({ status: 'error', message: 'No record found' })
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword)

    if (!isMatch) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Invalid password' })
    }

    // Generate JWT Token with userId + role
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // 👈 include role
      jwtSecret,
      { expiresIn: '30m' }
    )

    res.status(200).json({
      status: 'ok',
      data: {
        token,
        userId: user._id,
        role: user.role // 👈 send role back
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: 'error', message: 'server error' })
  }
}

export default login
