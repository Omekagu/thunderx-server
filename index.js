import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongodbConnection from './configs/mongbDb.js'
const app = express()

// middlewares
dotenv.config()

app.use(
  cors({
    origin: '*'
  })
)
mongodbConnection()

app.listen(5000, console.log(' server is up and running'))
