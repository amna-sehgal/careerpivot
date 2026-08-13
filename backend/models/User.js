const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstName:             { type: String, required: true, trim: true },
  lastName:              { type: String, default: '', trim: true },
  email:                 { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash:          { type: String, required: true },
  // Profile
  currentRole:           { type: String, default: '' },
  yearsOfExperience:     { type: Number, default: 0 },
  skills:                { type: [String], default: [] },
  interests:             { type: [String], default: [] },
  academicBackground:    { type: String, default: '' },
  location:              { type: String, default: '' },
  targetCareerInterest:  { type: String, default: '' },
  hoursPerWeekAvailable: { type: Number, default: 10 },
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
