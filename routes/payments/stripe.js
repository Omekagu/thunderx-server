import express from 'express'
import { StripePay } from '../../controllers/payments/stripe.js'

const router = express.Router()

router.post('/create-checkout-session', StripePay)

export default router
