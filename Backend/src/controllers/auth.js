import crypto from 'crypto' // built-in Node.js — no npm install needed
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

export const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  })

export async function register(req, res) {
  try {
    // console.log("Inside routes");
    const regUser = req.body
    const email = regUser.email;
    // console.log("error line 1")
    const password = regUser.password
    // console.log("error line 2")
    const user = await User.create({ email, password })
    // console.log("error line 3")
    const token = signToken(user._id)
    res.status(201).json({ token })
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ error: 'Email already exists' })
    res.status(500).json({ error: err.message, message: "why no entry" })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid credentials' })
    res.json({ token: signToken(user._id) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getMe(req, res) {
  const user = await User.findById(req.userId).select('-password')
  res.json({ user })
}
