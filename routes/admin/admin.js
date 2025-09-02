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
import {
  getBankTransferdetails,
  updateBankTransferdetails
} from '../../controllers/admin/BankTransfer.js'
import {
  createCoinwallet,
  deleteCoinWallet,
  getCoinWallet
} from '../../controllers/admin/WalletManager.js'

const router = express.Router()

router.get('/settings', getSettings)
router.post('/settings', updateSettings)

//Bank payment
router.get('/bankgateways', getBankGateways)
router.post('/bankgateways', createBanGateway)
router.put('/updatebankgateway/:id', updateBankGateway)
router.delete('/deletebankgateway/:id', deletebankgateway)

// Bank Transfer
router.get('/getBantTransferdetails', getBankTransferdetails)
router.post('/updateBankTransferdetails', updateBankTransferdetails)

// wallet Manager
router.get('/get-coinwallet', getCoinWallet)
router.post('/create-coinwallet', createCoinwallet)
router.delete('/delete-coinwallet/:id', deleteCoinWallet)

export default router
