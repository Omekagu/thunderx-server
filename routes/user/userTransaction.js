import express from 'express'
import {
  getUserTransaction,
  postUserTransaction
} from '../../controllers/Transactions/userTransaction.js'
import { swapCoins } from '../../controllers/Transactions/swapCoin.js'
import { applyLoan } from '../../controllers/Transactions/loan.js'

const router = express.Router()

router.post('/swap', swapCoins)
router.get('/:userId', getUserTransaction)
router.post('/', postUserTransaction)
router.post('/applyforloan', applyLoan)

export default router
