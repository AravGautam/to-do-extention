import express from 'express'
import {
  register,
  login,
  getMe
} from '../controllers/auth.js'
import protect from '../middleware/protect.js'

const router = express.Router()
router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
// POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { googleToken } = req.body
    if (!googleToken) {
      return res.status(400).json({ error: 'No Google token provided' })
    }

    // Step 1 — verify the token with Google and get user info
    const googleRes = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleToken}`
    )
    if (!googleRes.ok) {
      return res.status(401).json({ error: 'Invalid Google token' })
    }
    const googleUser = await googleRes.json()
    // googleUser = { id, email, name, picture, verified_email }

    // Step 2 — find existing user or create a new one
    let user = await User.findOne({ email: googleUser.email })

    if (!user) {
      // New user — create account, no password needed
      user = await User.create({
        email:    googleUser.email,
        name:     googleUser.name,
        avatar:   googleUser.picture,
        googleId: googleUser.id,
        password: crypto.randomUUID() // random — never used
      })
    } else if (!user.googleId) {
      // Existing email user — link their Google account
      user.googleId = googleUser.id
      user.avatar   = googleUser.picture
      await user.save()
    }

    // Step 3 — return your own JWT (same as email login)
    res.json({
      token: signToken(user._id),
      user:  {
        email:  user.email,
        name:   user.name,
        avatar: user.avatar
      }
    })

  } catch (err) {
    console.error('Google auth error:', err)
    res.status(500).json({ error: err.message })
  }
})

export default router