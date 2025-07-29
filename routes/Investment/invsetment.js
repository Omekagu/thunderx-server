import express from 'express'
import {
  getAllInvestmentPlans,
  userInvestment
} from '../../controllers/investment/Investment.js'

const router = express.Router()

router.get('/', getAllInvestmentPlans)
router.post('/user-investments', userInvestment)

export default router
