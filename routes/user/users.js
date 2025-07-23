import express from 'express'
import { Users } from '../../controllers/user/users.js'
import getUserWithWallets from '../../controllers/user/getUserWithWallets.js'

const router = express.Router()

router.get('/users', Users)
router.get('/userwalletBalance/:userId', getUserWithWallets)

export default router
