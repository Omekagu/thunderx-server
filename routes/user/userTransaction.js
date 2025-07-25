import express from 'express'
import {
  getUserTransaction,
  postUserTransaction
} from '../../controllers/Transactions/userTransaction.js'

const router = express.Router()

router.get('/:userId', getUserTransaction)
router.post('/', postUserTransaction)

export default router
