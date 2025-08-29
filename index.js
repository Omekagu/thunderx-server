import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongodbConnection from './configs/mongbDb.js'
import authRoutes from './routes/auth/auth.js'
import userRoutes from './routes/user/users.js'
import transactionRoutes from './routes/user/userTransaction.js'
import paymentRoutes from './routes/payments/payment.js'
import loanRoutes from './routes/loan/loan.js'
import investmentRoutes from './routes/Investment/investment.js'
import { EventEmitter } from 'events'

EventEmitter.defaultMaxListeners = 20

const app = express()

// middlewares
dotenv.config()
app.use(express.json())
app.use(cors())

// ROUTES
app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/transactions', transactionRoutes)
app.use('/investments', investmentRoutes)
app.use('/loans', loanRoutes)
app.use('/payment', paymentRoutes)
app.get('/', (req, res) => {
  try {
    console.log('server is running on port 5000')
    res.send('Serving is running')
  } catch (error) {
    console.log('error', error)
    res.send('server failed')
  }
})

mongodbConnection()

app.listen(5000, console.log(' server is up and running'))
