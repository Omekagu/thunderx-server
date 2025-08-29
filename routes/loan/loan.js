import express from 'express'
import {
  createLoanPlan,
  deleteLoan,
  getAllLoanPlans,
  updateLoan
} from '../../controllers/loan/loan.js'

const router = express.Router()

router.post('/create', createLoanPlan) // POST: create new loan plan
router.get('/all', getAllLoanPlans) // GET: fetch all loan plans
router.delete('/:id', deleteLoan)
router.put('/:id', updateLoan)

export default router
