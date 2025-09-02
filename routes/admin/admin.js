import express from 'express'
import {
  getSettings,
  updateSettings
} from '../../controllers/admin/settings.js'

const router = express.Router()

router.get('/settings', getSettings)
router.post('/settings', updateSettings)

export default router
