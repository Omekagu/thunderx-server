import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    firstname: { type: String },
    lastname: { String },
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
