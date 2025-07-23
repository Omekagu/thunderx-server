import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { String },
    referralcode: { type: String },
    email: { type: String },
    phone: { type: String },
    password: {
      type: String,
      required: function () {
        return !this.provider
      }
    },
    dialCode: { type: String },
    country: { type: String },
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
