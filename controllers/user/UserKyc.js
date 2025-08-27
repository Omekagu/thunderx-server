import User from '../../models/userModel.js'

export const postKyc = async (req, res) => {
  try {
    const { userId, ...fields } = req.body
    if (!userId) return res.json({ success: false, error: 'Missing userId' })

    const user = await User.findById(userId)
    if (!user) return res.json({ success: false, error: 'User not found' })

    if (user.kyc && user.kyc.status !== 'rejected') {
      return res.json({ success: false, error: 'KYC already submitted' })
    }

    user.kyc = {
      ...fields,
      status: 'pending',
      submittedAt: new Date()
    }

    await user.save()

    res.json({ success: true, kyc: user.kyc })
  } catch (err) {
    console.error('Error submitting KYC:', err)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}

export const getKycByUserId = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      'kyc firstname lastname email'
    )
    if (!user) return res.json({ success: false, error: 'User not found' })

    res.json({ success: true, kyc: user.kyc })
  } catch (err) {
    console.error('Error fetching user KYC:', err)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}

export const getAllUserKycs = async (req, res) => {
  try {
    const users = await User.find({ 'kyc.status': { $exists: true } }).select(
      'firstname lastname email kyc'
    )

    res.json({ success: true, kycs: users })
  } catch (err) {
    console.error('Error fetching all KYCs:', err)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}

export const updateKycStatus = async (req, res) => {
  try {
    const { userId } = req.params
    const { status } = req.body // 'verified' | 'rejected'

    if (!['verified', 'rejected'].includes(status)) {
      return res.json({ success: false, error: 'Invalid status' })
    }

    const user = await User.findById(userId)
    if (!user) return res.json({ success: false, error: 'User not found' })

    user.kyc.status = status
    await user.save()

    res.json({ success: true, kyc: user.kyc })
  } catch (err) {
    console.error('Error updating KYC status:', err)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}
