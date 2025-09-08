import WithdrawalModel from '../../models/withdrawal.js'

// Get all withdrawals
export const getWithdrawals = async (req, res) => {
  try {
    const withdrawals = await WithdrawalModel.find()
      .populate('userId', 'name email')
      .populate('transactionId')
      .sort({ createdAt: -1 })

    res.json(withdrawals)
  } catch (err) {
    console.error('Error fetching withdrawals:', err)
    res.status(500).json({ message: err.message })
  }
}

// Approve / Decline / Pending update
export const updateWithdrawalStatus = async (req, res) => {
  try {
    const { status } = req.body // "approved" | "rejected" | "pending"
    const withdrawal = await WithdrawalModel.findById(req.params.id)

    if (!withdrawal) return res.status(404).json({ message: 'Not found' })

    withdrawal.status = status
    if (status === 'approved') withdrawal.approvedAt = new Date()
    await withdrawal.save()

    // Mirror status in transaction
    await TransactionModel.findByIdAndUpdate(withdrawal.transactionId, {
      status
    })

    res.json(withdrawal)
  } catch (err) {
    console.error('Error updating withdrawal:', err)
    res.status(500).json({ message: err.message })
  }
}
