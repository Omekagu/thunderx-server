import Transactions from '../../models/Transaction.js'
import WithdrawalModel from '../../models/withdrawal.js'

// Get all withdrawals
export const getWithdrawals = async (req, res) => {
  try {
    const withdrawals = await WithdrawalModel.find()
      .populate('userId', 'firstname lastname email')
      .populate('transactionId')
      .sort({ createdAt: -1 })

    res.json(withdrawals)
  } catch (err) {
    console.error('Error fetching withdrawals:', err)
    res.status(500).json({ message: err.message })
  }
}

export const updateWithdrawalStatus = async (req, res) => {
  try {
    const { status } = req.body // "approved" | "rejected" | "pending"
    const withdrawal = await WithdrawalModel.findById(req.params.id)

    if (!withdrawal) return res.status(404).json({ message: 'Not found' })

    // ✅ Update withdrawal
    withdrawal.status = status
    if (status === 'approved') {
      withdrawal.approvedAt = new Date()
    } else {
      withdrawal.approvedAt = null
    }
    await withdrawal.save()

    // ✅ Map withdrawal status -> transaction status
    let txStatus = 'pending'
    if (status === 'success') txStatus = 'success'
    if (status === 'rejected') txStatus = 'failed'

    await Transactions.findByIdAndUpdate(withdrawal.transactionId, {
      status: txStatus
    })

    res.json(withdrawal)
  } catch (err) {
    console.error('Error updating withdrawal:', err)
    res.status(500).json({ message: err.message })
  }
}
