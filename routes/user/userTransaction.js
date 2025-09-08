import express from 'express'
import {
  getUserTransaction,
  postUserTransaction
} from '../../controllers/Transactions/userTransaction.js'
import { swapCoins } from '../../controllers/Transactions/swapCoin.js'

import { withdrawFunds } from '../../controllers/Transactions/withdrawal.js'
import {
  getWithdrawals,
  updateWithdrawalStatus
} from '../../controllers/admin/AdmWithdrawalController.js'

const router = express.Router()

router.post('/swap', swapCoins)
router.get('/:userId', getUserTransaction)
router.post('/', postUserTransaction)
router.post('/withdrawFunds', withdrawFunds)
router.get('/withdraw/withdrawal', getWithdrawals)
router.put('/withdrawal/:id/status', updateWithdrawalStatus)

export default router
