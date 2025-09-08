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
import {
  createDeposit,
  getDeposits,
  updateDepositStatus
} from '../../controllers/Transactions/deposit.js'

const router = express.Router()

// USER TRANSACTION
router.get('/:userId', getUserTransaction)
router.post('/', postUserTransaction)

// SWAP COIN
router.post('/swap', swapCoins)

// WITHDRAWAL
router.post('/withdrawFunds', withdrawFunds)
router.get('/withdraw/withdrawal', getWithdrawals)
router.put('/withdrawal/:id/status', updateWithdrawalStatus)

// DEPOSIT
router.get('/deposit/user', getDeposits) // get user deposits
router.post('/deposit', createDeposit) // user submit deposit
router.put('/deposit/:id/status', updateDepositStatus)

export default router
