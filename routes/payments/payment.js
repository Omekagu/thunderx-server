import express from 'express'
import { StripePay } from '../../controllers/payments/stripe.js'
import { paypalPay } from '../../controllers/payments/paypal.js'
import { cashappPay } from '../../controllers/payments/cashapp.js'
import multer from 'multer'
import path from 'path'

// Set up storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/receipts'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
})

const upload = multer({ storage })

const router = express.Router()

router.post('/stripe', StripePay)
router.post('/paypal', paypalPay)
router.post('/cashapp', upload.single('receipt'), cashappPay)

export default router
