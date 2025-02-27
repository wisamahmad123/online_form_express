import dotenv from 'dotenv'
import mongoose from "mongoose"

const env = dotenv.config().parsed



const connection = () => {
mongoose.connect(env.MONGODB_URI , {
    dbName: env.MONGODB_NAME
  })
  const conn = mongoose.connection
  conn.on('error', console.error.bind(console, 'Connection error :'))
  conn.once('open', () => {
    console.log(`Connected to MongoDB Database: ${env.MONGODB_NAME}`)
  })
}

export default connection