import express from 'express'
import { Users } from '../../controllers/user/users.js'

const router = express.Router()

router.get('/users', Users)

export default router
