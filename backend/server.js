const express = require('express')
const cors = require('cors')
require('dotenv').config()

const { connectDB } = require('./lib/db')
const { verifyToken } = require('./middleware/auth')

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.use('/api/auth',    require('./routes/auth'))
app.use('/api/profile', verifyToken, require('./routes/profile'))
app.use('/api/career',  verifyToken, require('./routes/career'))

app.get('/health', (_, res) => res.json({ ok: true }))

app.get('/debug/openrouter', (req, res) => {
  const key = process.env.OPENROUTER_API_KEY?.trim()

  res.json({
    keyExists: !!key,
    keyLength: key?.length || 0,
    correctFormat: key?.startsWith('sk-or-v1-') || false,
    nodeEnvironment: process.env.NODE_ENV
  })
})

const PORT = process.env.PORT || 4000

connectDB().then(() => {
  app.listen(PORT, () => console.log(`✅ CareerPivot backend running on :${PORT}`))
}).catch(err => {
  console.error('❌ MongoDB connection failed:', err.message)
  process.exit(1)
})
