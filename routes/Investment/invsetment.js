import express from 'express'
import { getAllInvestmentPlans } from '../../controllers/investment/Investment.js'

const router = express.Router()

router.get('/', getAllInvestmentPlans)

export default router
