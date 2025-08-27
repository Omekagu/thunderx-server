import express from 'express'
import { Users } from '../../controllers/user/users.js'
import getUserWithWallets from '../../controllers/user/getUserWithWallets.js'
import { getReferrals } from '../../controllers/auth/referal.js'
import {
  getAllUserKycs,
  getKycByUserId,
  postKyc,
  updateKycStatus
} from '../../controllers/user/UserKyc.js'

const router = express.Router()

router.get('/', Users)
router.get('/:userId', getUserWithWallets)
router.get('/referrals/:code', getReferrals)
// POST submit KYC
router.post('/kyc/send-kyc', postKyc)

// GET one user’s KYC
router.get('/kyc/:userId', getKycByUserId)

// GET all KYCs
router.get('/kyc/get/all', getAllUserKycs)

// PUT verify/reject KYC
router.put('/kyc/:userId/status', updateKycStatus)

export default router
