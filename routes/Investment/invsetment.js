import express from 'express'
import {
  getAllInvestmentPlans,
  getUserInvestments,
  postUserInvestment
} from '../../controllers/investment/Investment.js'

const router = express.Router()

router.get('/', getAllInvestmentPlans)
router.post('/user-investments', postUserInvestment)
router.get('/:userId', getUserInvestments)

export default router
