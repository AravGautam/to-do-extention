import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import todoRoutes from './routes/todos.js'

dotenv.config()

const app = express()

// Allow Chrome extension + local dev origins
app.use(cors({
  origin(origin, cb) {
    const ok = !origin
      || /^chrome-extension:///.test(origin)
      || origin === 'http://localhost:5173'
    cb(null, ok)
  },
  credentials: true
}))

app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/todos', todoRoutes)

app.get('/health', (req, res) => res.json({ ok: true }))

// MongoDB connect then listen
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT || 4000, () =>
      console.log(`Server on port ${process.env.PORT || 4000}, http://localhost:4000`)
    )
  })
  .catch(err => {
    console.error('DB connection failed:', err)
    process.exit(1)
  })