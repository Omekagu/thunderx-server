import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    firstname: { type: String },
    lastname: { type: String },
    refCode: { type: String, unique: true, index: true },
    referredBy: { type: String }, // stores refCode of the inviter
    referralBonus: { type: Number, default: 0 },
    referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    email: { type: String },
    phoneNumber: { type: String },
    password: {
      type: String,
      required: function () {
        return !this.provider
      }
    },
    hashedPassword: { type: String },
    userCountry: { type: String },
    wallet: {
      balance: { type: Number, default: 0 },
      coinBalance: { type: Number, default: 0 }
    },
    loan: {
      active: { type: Boolean, default: false },
      totalBorrowed: { type: Number, default: 0 },
      totalRepaid: { type: Number, default: 0 },
      outstandingBalance: { type: Number, default: 0 }
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    collection: 'UserInfo'
  }
)

const User = mongoose.models.UserInfo || mongoose.model('UserInfo', UserSchema)

export default User
