import { Router } from 'express'
import User   from '../models/user.js'
import crypto from 'crypto'
import protect from '../middleware/protect.js'
import {
  register,
  login,
  signToken
} from '../controllers/auth.js'

const router = Router()
router.use(protect)  // ← REMOVE this line — it blocks login/register!

router.post('/register', register)
router.post('/login',    login)

// Google OAuth route
router.post('/google', async (req, res) => {
  try {
    const { googleToken } = req.body
    if (!googleToken) {
      return res.status(400).json({ error: 'No Google token provided' })
    }

    const googleRes = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleToken}`
    )
    if (!googleRes.ok) {
      return res.status(401).json({ error: 'Invalid Google token' })
    }
    const googleUser = await googleRes.json()

    let user = await User.findOne({ email: googleUser.email })

    if (!user) {
      user = await User.create({
        email:    googleUser.email,
        name:     googleUser.name     || '',
        avatar:   googleUser.picture  || '',
        googleId: googleUser.id,
        password: crypto.randomUUID()
      })
    } else if (!user.googleId) {
      user.googleId = googleUser.id
      user.avatar   = googleUser.picture || ''
      await user.save()
    }

    res.json({
      token: signToken(user._id),
      user: {
        email:  user.email,
        name:   user.name,
        avatar: user.avatar
      }
    })

  } catch (err) {
    console.error('Google auth error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// Protected routes below
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.userId).select('-password')
  res.json({ user })
})

export default router