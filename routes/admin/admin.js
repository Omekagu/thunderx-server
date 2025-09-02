import express from 'express'
import {
  getSettings,
  updateSettings
} from '../../controllers/admin/settings.js'
import {
  createBanGateway,
  deletebankgateway,
  getBankGateways,
  updateBankGateway
} from '../../controllers/admin/BankGateways.js'

const router = express.Router()

router.get('/settings', getSettings)
router.post('/settings', updateSettings)
router.get('/bankgateways', getBankGateways)
router.post('/bankgateways', createBanGateway)
router.put('/updatebankgateway/:id', updateBankGateway)
router.delete('/deletebankgateway/:id', deletebankgateway)

export default router
