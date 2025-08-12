import Kyc from '../../models/KycModel.js'

export const postKyc = async (req, res) => {
  try {
    const {
      userId,
      idDocumentUrl,
      address,
      dateOfBirth,
      nextOfKin,
      maidenName,
      nationality,
      phone,
      email
    } = req.body

    // Basic validation
    if (
      !userId ||
      !idDocumentUrl ||
      !address ||
      !dateOfBirth ||
      !nextOfKin ||
      !maidenName ||
      !nationality ||
      !phone ||
      !email
    ) {
      return res
        .status(400)
        .json({ success: false, error: 'Missing required fields' })
    }

    // Save KYC record to DB
    const kyc = new Kyc({
      userId,
      idDocumentUrl,
      address,
      dateOfBirth,
      nextOfKin,
      maidenName,
      nationality,
      phone,
      email,
      status: 'pending',
      submittedAt: new Date()
    })
    await kyc.save()

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: 'Server error' })
  }
}

export const getKycByUserId = async (req, res) => {
  console.log('Fetching KYC for user:', req.params.userId)
  try {
    const kyc = await Kyc.findOne({ userId: req.params.userId })
    if (!kyc) {
      return res.status(404).json({ success: false, error: 'Not found' })
    }
    res.json({ success: true, status: kyc.status })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
}
