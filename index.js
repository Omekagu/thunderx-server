import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongodbConnection from './configs/mongbDb.js'
import authRoutes from './routes/auth/auth.js'

const app = express()

// middlewares
dotenv.config()
app.use(
  cors({
    origin: '*'
  })
)

// ROUTES
app.use('/auth', authRoutes)

mongodbConnection()

app.listen(5000, console.log(' server is up and running'))
