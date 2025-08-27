import express from 'express'
import { Users } from '../../controllers/user/users.js'
import getUserWithWallets from '../../controllers/user/getUserWithWallets.js'
import { getReferrals } from '../../controllers/auth/referal.js'
import {
  getAllUserKycs,
  getUserKyc,
  submitKyc,
  updateKycStatus
} from '../../controllers/user/UserKyc.js'

const router = express.Router()

router.get('/', Users)
router.get('/:userId', getUserWithWallets)
router.get('/referrals/:code', getReferrals)
router.post('/kyc/submit', submitKyc)
router.get('/kyc/:userId', getUserKyc)
router.get('/kyc/all/all', getAllUserKycs)
router.post('/kyc/:userId/:decision', updateKycStatus)

export default router
