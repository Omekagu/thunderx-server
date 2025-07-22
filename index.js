import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

// middlewares
dotenv.config()
app.use(
  cors({
    origin: '*'
  })
)

const app = express()

app.listen(5000, console.log(' server is up and running'))
