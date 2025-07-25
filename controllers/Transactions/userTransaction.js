import Transaction from '../../models/Transaction.js'

// GET all transactions for a user
export const getUserTransaction = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.params.userId
    }).sort({ date: -1 })
    res.status(200).json({ status: 'ok', data: transactions })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

// POST a new transaction (for testing/demo)
export const postUserTransaction = async (req, res) => {
  const { userId, type, amount, status, description } = req.body
  try {
    const newTx = await Transaction.create({
      userId,
      type,
      amount,
      status,
      description
    })
    res.status(201).json({ status: 'ok', data: newTx })
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message })
  }
}
