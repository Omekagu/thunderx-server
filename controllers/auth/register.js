import User from '../../models/userModel.js'
import bcrypt from 'bcryptjs'

const register = async (req, res) => {
  const {
    firstname,
    surname,
    email,
    phoneNumber,
    referralCode,
    password,
    userCountry
  } = req.body

  try {
    const oldUser = await User.findOne({ email })
    if (oldUser) return res.status(400).json({ message: 'User already exists' })

    console.log(
      firstname,
      surname,
      email,
      phoneNumber,
      referralCode,
      password,
      userCountry
    )

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
      firstname,
      surname,
      email,
      phoneNumber,
      referralCode,
      password,
      hashedPassword,
      userCountry
    })
    console.log(newUser)
    await newUser.save()
    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error })
    process.exit(1)
  }
}
export default register
