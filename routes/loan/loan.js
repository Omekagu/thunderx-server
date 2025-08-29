import express from 'express'
import {
  applyForLoan,
  createLoanPlan,
  deleteLoan,
  getAllLoanPlans,
  getLoanHistory,
  updateLoan
} from '../../controllers/loan/loan.js'

const router = express.Router()

router.post('/create', createLoanPlan) // POST: create new loan plan
router.post('/applyforloan', applyForLoan)
router.get('/getLoanHistory/:userId', getLoanHistory)
router.get('/all', getAllLoanPlans) // GET: fetch all loan plans
router.delete('/:id', deleteLoan)
router.put('/:id', updateLoan)

export default router
