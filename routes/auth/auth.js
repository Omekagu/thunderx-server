import express from 'express'
import register from '../../controllers/auth/register.js'
import login from '../../controllers/auth/login.js'
import forgotPassword from '../../controllers/auth/forgotPassword.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/forgotpassword', forgotPassword)

export default router
