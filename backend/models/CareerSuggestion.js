const mongoose = require('mongoose')

const missingSkillSchema = new mongoose.Schema({
  skillName:             { type: String, required: true },
  estimatedWeeksToLearn: { type: Number, required: true },
  priority:              { type: String, enum: ['high','medium','low'], default: 'medium' },
}, { _id: false })

const roadmapPhaseSchema = new mongoose.Schema({
  phase:        { type: Number, required: true },
  weeks:        { type: String, required: true },
  focus:        { type: String, required: true },
  hoursPerWeek: { type: Number, required: true },
  resources:    { type: [String], default: [] },
}, { _id: false })

const suggestionSchema = new mongoose.Schema({
  rank:                  { type: Number, required: true },
  roleName:              { type: String, required: true },
  matchPercentage:       { type: Number, required: true },
  reasoning:             { type: String, required: true },
  missingSkills:         { type: [missingSkillSchema], default: [] },
  timeToReadyWeeks:      { type: Number, required: true },
  proofOfPivotStatement: { type: String, required: true },
  highlevelRoadmap:      { type: [roadmapPhaseSchema], default: [] },
}, { _id: false })

const careerSuggestionSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  suggestions: { type: [suggestionSchema], required: true },
  profileSnapshot: {
    currentRole: String, yearsOfExperience: Number, skills: [String],
    interests: [String], academicBackground: String, location: String,
    targetCareerInterest: String, hoursPerWeekAvailable: Number,
  },
}, { timestamps: true })

module.exports = mongoose.model('CareerSuggestion', careerSuggestionSchema)
