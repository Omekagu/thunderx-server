import UserInfo from '../../models/UserModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import sendEmail from '../../utilities/sendEmail.js'
// import sendEmail from '../utils/sendEmail.js'

const jwtSecret = process.env.JWT_SECRET

export const login = async (req, res) => {
  const { email, password } = req.body
  console.log(email, password)

  try {
    const user = await UserInfo.findOne({ email })

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
    const token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, {
      expiresIn: '30m'
    })

    // Send login confirmation email to User
    await sendEmail(
      user.email,
      'Login Successful',
      `
      <p>Hi <b>${user.firstname}</b>,</p>
      <p>You have successfully logged in to your account.</p>
      <p>If this wasn't you, please reset your password immediately.</p>
      <li><b>Time:</b> ${new Date().toLocaleString()}</li>
      `
    )

    // Notify Admin
    await sendEmail(
      process.env.ADMIN_EMAIL,
      'User Login Alert',
      `
      <p>User <b>${user.firstname} ${user.lastname}</b> just logged in.</p>
      <ul>
        <li><b>Email:</b> ${user.email}</li>
        <li><b>Role:</b> ${user.role}</li>
        <li><b>Time:</b> ${new Date().toLocaleString()}</li>
      </ul>
      `
    )

    res.status(200).json({
      status: 'ok',
      data: {
        token,
        userId: user._id,
        role: user.role
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: 'error', message: 'server error' })
  }
}
