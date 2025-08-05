import express from 'express'
import { Users } from '../../controllers/user/users.js'
import getUserWithWallets from '../../controllers/user/getUserWithWallets.js'
import { getReferrals } from '../../controllers/auth/referal.js'

const router = express.Router()

router.get('/', Users)
router.get('/:userId', getUserWithWallets)
router.get('/referrals/:code', getReferrals)

export default router
