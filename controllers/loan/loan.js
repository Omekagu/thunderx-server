import LoanPlan from '../../models/LoanPlanModel.js'

export const createLoanPlan = async (req, res) => {
  try {
    const newLoanPlan = await LoanPlan.create(req.body)
    res.status(201).json({ status: 'ok', data: newLoanPlan })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const getAllLoanPlans = async (req, res) => {
  try {
    const loanPlans = await LoanPlan.find().sort({ createdAt: -1 })
    res.status(200).json({ status: 'ok', data: loanPlans })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

// ✅ Delete loan
export const deleteLoan = async (req, res) => {
  try {
    await LoanPlan.findByIdAndDelete(req.params.id)
    res.status(200).json({ status: 'ok', message: 'Loan deleted' })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

// ✅ Update loan
export const updateLoan = async (req, res) => {
  try {
    const loan = await LoanPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
    res.status(200).json({ status: 'ok', data: loan })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}
