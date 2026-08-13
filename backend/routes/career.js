const express = require('express')
const User = require('../models/User')
const CareerSuggestion = require('../models/CareerSuggestion')
const { getCareerSuggestions } = require('../lib/openrouter')
const router = express.Router()

// POST /api/career/analyze
router.post('/analyze', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash')
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (!user.currentRole || !user.targetCareerInterest || user.skills.length < 2) {
      return res.status(400).json({
        message: 'Please complete your profile first — current role, target interest, and at least 2 skills are required.'
      })
    }

    const profileData = {
      currentRole: user.currentRole, yearsOfExperience: user.yearsOfExperience,
      skills: user.skills, interests: user.interests, academicBackground: user.academicBackground,
      location: user.location, targetCareerInterest: user.targetCareerInterest,
      hoursPerWeekAvailable: user.hoursPerWeekAvailable,
    }

    const suggestions = await getCareerSuggestions(profileData)

    const saved = await CareerSuggestion.create({ userId: user._id, suggestions, profileSnapshot: profileData })

    res.json({ id: saved._id, suggestions, createdAt: saved.createdAt })
  } catch (err) {
    console.error('[Career Analyze] Error:', err.message)
    res.status(500).json({ message: err.message || 'Analysis failed. Please try again.' })
  }
})

// GET /api/career/history
router.get('/history', async (req, res) => {
  try {
    const history = await CareerSuggestion.find({ userId: req.user.userId }).sort({ createdAt: -1 }).limit(20).lean()
    res.json({ history })
  } catch (err) {
    console.error('History error:', err)
    res.status(500).json({ message: 'Failed to fetch history' })
  }
})

// GET /api/career/history/:id
router.get('/history/:id', async (req, res) => {
  try {
    const set = await CareerSuggestion.findOne({ _id: req.params.id, userId: req.user.userId }).lean()
    if (!set) return res.status(404).json({ message: 'Not found' })
    res.json(set)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch suggestion set' })
  }
})

module.exports = router
