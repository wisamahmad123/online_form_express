import dotenv from 'dotenv'
import mongoose from "mongoose"

dotenv.config()

const connection = () => {
  mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_NAME}?retryWrites=true&w=majority`, {
    dbName: process.env.MONGODB_NAME,
  })

  const conn = mongoose.connection
  conn.on('error', console.error.bind(console, 'Connection error: '))
  conn.once('open', () => {
    console.log(`Connected to MongoDB Database: ${process.env.MONGODB_NAME}`)
  })
}

export default connection
