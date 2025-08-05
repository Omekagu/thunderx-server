import express from 'express'
import {
  getUserTransaction,
  postUserTransaction
} from '../../controllers/Transactions/userTransaction.js'
import { swapCoins } from '../../controllers/Transactions/swapCoin.js'
import {
  applyLoan,
  getLoanHistory
} from '../../controllers/Transactions/loan.js'

const router = express.Router()

router.post('/swap', swapCoins)
router.get('/:userId', getUserTransaction)
router.post('/', postUserTransaction)
router.post('/applyforloan', applyLoan)
router.get('/getLoanHistory/:userId', getLoanHistory)

export default router
