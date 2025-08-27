import Kyc from '../../models/KycModel.js'

export const postKyc = async (req, res) => {
  const { userId, ...fields } = req.body
  if (!userId) return res.json({ success: false, error: 'Missing userId' })
  const existing = await Kyc.findOne({ userId })
  if (existing)
    return res.json({ success: false, error: 'KYC already submitted' })
  const kyc = new Kyc({
    userId,
    ...fields,
    status: 'pending',
    submittedAt: new Date()
  })
  await kyc.save()
  res.json({ success: true })
}

export const getKycByUserId = async (req, res) => {
  const kyc = await Kyc.findOne({ userId: req.params.userId })
  if (!kyc) return res.json({ success: true, kyc: null })
  res.json({ success: true, kyc })
}

export const getAllUserKycs = async (req, res) => {
  try {
    const kycs = await Kyc.find({})
    res.json(kycs)
  } catch (error) {
    console.error('Error fetching all user KYCs:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
