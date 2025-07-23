import User from '../../models/UserModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '../../utilities/jwtSecret.js'

const login = async (req, res) => {
  const { email, password } = req.body
  try {
    User.findOne({ email }).then(user => {
      if (!user) {
        return res
          .status(404)
          .json({ staus: 'error', message: 'No record found' })
      }

      // Compare password with hashed password
      bcrypt.compare(password, user.hashedPassword, (err, isMatch) => {
        if (err) {
          return res
            .status(500)
            .json({ status: 'error', message: 'server error' })
        }
        console.log(email, user.hashedPassword)
        if (!isMatch) {
          return res
            .status(400)
            .json({ status: 'error', message: 'invalid password' })
        }

        // Generate JWT Token with userId
        const token = jwt.sign({ userId: user._id }, jwtSecret, {
          expiresIn: '30m'
        })
        // send userId algon with token
        console.log(token, user._id)

        res.status(200).json({
          status: 'ok',
          data: { token, userId: user._id }
        })
      })
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'server error' })
    process.exit(1)
  }
}
export default login
