import mongoose from 'mongoose'

const userWalletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    symbol: { type: String, required: true },
    walletAddress: { type: String, required: true }, // Inherited from coin
    balance: { type: Number, default: 0 },
    network: { type: String, required: true },
    decimals: { type: Number, required: true }
  },
  { timestamps: true }
)

export default mongoose.model('UserWallet', userWalletSchema)
