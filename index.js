import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongodbConnection from './configs/mongbDb.js'
import authRoutes from './routes/auth/auth.js'

const app = express()

// middlewares
dotenv.config()
app.use(express.json())
app.use(cors())

// ROUTES
app.use('/auth', authRoutes)
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
