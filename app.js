import dotenv from 'dotenv'
import express from 'express'
import apiRouter from './routes/api.js'
import connection from './connection.js'

const env = dotenv.config().parsed
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use('/', apiRouter)

app.use((req, res) => {
    res.status(404).json({ "message" : '404_NOT_FOUND' })
})

// MongoDB Connection
connection()

export default app