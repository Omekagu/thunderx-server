import express from 'express'
import register from '../../controllers/auth/register.js'
import login from '../../controllers/auth/login.js'
import {
  resetOtp,
  sendOtp,
  verifyOtp
} from '../../controllers/auth/forgotPassword.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/send-otp', sendOtp)
router.post('/verify-otp', verifyOtp)
router.post('/reset-password', resetOtp)

export default router
