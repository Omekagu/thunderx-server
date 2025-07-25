import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    firstname: { type: String },
    lastname: { type: String },
    referralcode: { type: String },
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

const User = mongoose.model('UserInfo', UserSchema)

export default User
