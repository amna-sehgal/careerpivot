const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

const makeToken = (userId, email) =>
  jwt.sign({ userId, email }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '30d' })

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body
  if (!firstName || !email || !password)
    return res.status(400).json({ message: 'All fields required' })
  if (password.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters' })
  try {
    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(409).json({ message: 'Email already registered. Please login.' })
    const user = await User.create({ firstName, lastName: lastName || '', email, passwordHash: await bcrypt.hash(password, 12) })
    res.status(201).json({ user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, token: makeToken(user._id, user.email) } })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ message: 'Signup failed. Try again.' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' })
  try {
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(401).json({ message: 'No account found with this email.' })
    if (!await bcrypt.compare(password, user.passwordHash))
      return res.status(401).json({ message: 'Incorrect password.' })
    res.json({ user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, token: makeToken(user._id, user.email) } })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Login failed. Try again.' })
  }
})

module.exports = router
