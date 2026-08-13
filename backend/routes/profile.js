const express = require('express')
const User = require('../models/User')
const router = express.Router()

const PROFILE_FIELDS = ['currentRole','yearsOfExperience','skills','interests','academicBackground','location','targetCareerInterest','hoursPerWeekAvailable']

// GET /api/profile
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash')
    if (!user) return res.status(404).json({ message: 'User not found' })

    const profileComplete = !!(user.currentRole && user.targetCareerInterest && user.skills.length >= 2)

    res.json({
      profile: {
        currentRole: user.currentRole, yearsOfExperience: user.yearsOfExperience,
        skills: user.skills, interests: user.interests, academicBackground: user.academicBackground,
        location: user.location, targetCareerInterest: user.targetCareerInterest,
        hoursPerWeekAvailable: user.hoursPerWeekAvailable,
      },
      user: { firstName: user.firstName, lastName: user.lastName, email: user.email },
      profileComplete,
    })
  } catch (err) {
    console.error('Get profile error:', err)
    res.status(500).json({ message: 'Failed to fetch profile' })
  }
})

// POST /api/profile
router.post('/', async (req, res) => {
  const updates = {}
  for (const key of PROFILE_FIELDS) {
    if (req.body[key] !== undefined) updates[key] = req.body[key]
  }
  try {
    const user = await User.findByIdAndUpdate(req.user.userId, { $set: updates }, { new: true }).select('-passwordHash')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ message: 'Profile saved successfully', profile: updates })
  } catch (err) {
    console.error('Save profile error:', err)
    res.status(500).json({ message: 'Failed to save profile' })
  }
})

module.exports = router
