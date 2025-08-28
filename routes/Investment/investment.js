import express from 'express'
import {
  createInvestmentplan,
  getAllInvestmentPlans,
  getUserInvestments,
  postUserInvestment
} from '../../controllers/investment/Investment.js'

const router = express.Router()

router.get('/', getAllInvestmentPlans)
router.post('/user-investments', postUserInvestment)
router.get('/:userId', getUserInvestments)
router.post('/create-plan', createInvestmentplan)

export default router
