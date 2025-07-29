import express from 'express'
import sendEmail from '../../utilities/sendEmail.js'
import generateOTP from '../../utilities/genOtp.js'
import User from '../../models/userModel.js'

const router = express.Router()

// Send OTP
export const sendOtp = async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(404).json({ message: 'User not found' })

  const otp = generateOTP()
  user.resetOTP = otp
  user.otpExpires = Date.now() + 10 * 60 * 1000 // 10 minutes
  await user.save()

  await sendEmail(email, 'Your OTP Code', `Your OTP is: ${otp}`)
  res.status(200).json({ message: 'OTP sent to email' })
}

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body
  const user = await User.findOne({ email })

  if (!user || user.resetOTP !== otp || Date.now() > user.otpExpires) {
    return res.status(400).json({ message: 'Invalid or expired OTP' })
  }

  user.resetOTP = null
  user.otpExpires = null
  user.otpVerified = true
  await user.save()

  res.status(200).json({ message: 'OTP verified' })
}

// Reset Password
export const resetOtp = async (req, res) => {
  const { email, newPassword } = req.body
  const user = await User.findOne({ email })

  if (!user || !user.otpVerified) {
    return res.status(400).json({ message: 'OTP not verified' })
  }

  user.password = newPassword
  user.otpVerified = false
  await user.save()

  res.status(200).json({ message: 'Password reset successful' })
}
