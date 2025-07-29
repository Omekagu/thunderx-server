import express from 'express'
import sendEmail from '../../utilities/sendEmail.js'
import generateOTP from '../../utilities/genOtp.js'
import User from '../../models/userModel.js'
import Otp from '../../models/otpModel.js'
import bcrypt from 'bcryptjs'

// Send OTP
export const sendOtp = async (req, res) => {
  const email = req.body.email.toLowerCase()
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'User not found' })

    const otp = generateOTP()

    // Remove previous OTPs (optional)
    await Otp.deleteMany({ email })

    // Save new OTP
    await Otp.create({ email, otp })

    // Send email
    await sendEmail(email, 'Your OTP Code', `Your OTP is: ${otp}`)

    res.json({ message: 'OTP sent to email' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error sending OTP' })
  }
}

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body
  console.log(email, otp)

  try {
    const otpRecord = await Otp.findOne({ email, otp })
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' })
    }

    // ✅ OTP is valid — delete it to prevent reuse
    await Otp.deleteOne({ _id: otpRecord._id })

    res.json({ message: 'OTP Verified' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error verifying OTP' })
  }
}

// Reset Password
export const resetOtp = async (req, res) => {
  const { email, newPassword } = req.body
  const normalizedEmail = email.toLowerCase() // Normalize email

  try {
    const user = await User.findOne({ email: normalizedEmail })
    if (!user) {
      return res
        .status(400)
        .json({ message: 'OTP not verified or user not found' })
    }

    // 🔐 Hash the new password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    user.password = newPassword
    user.hashedPassword = hashedPassword
    await user.save()

    res.status(200).json({ message: 'Password reset successful' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to reset password' })
  }
}
