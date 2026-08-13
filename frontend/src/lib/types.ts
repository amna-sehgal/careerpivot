export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  token: string
}

export interface UserProfile {
  currentRole: string
  yearsOfExperience: number
  skills: string[]
  interests: string[]
  academicBackground: string
  location: string
  targetCareerInterest: string
  hoursPerWeekAvailable: number
}

export interface MissingSkill {
  skillName: string
  estimatedWeeksToLearn: number
  priority: 'high' | 'medium' | 'low'
}

export interface RoadmapPhase {
  phase: number
  weeks: string
  focus: string
  hoursPerWeek: number
  resources: string[]
}

export interface CareerSuggestion {
  rank: number
  roleName: string
  matchPercentage: number
  reasoning: string
  missingSkills: MissingSkill[]
  timeToReadyWeeks: number
  proofOfPivotStatement: string
  highlevelRoadmap: RoadmapPhase[]
}

export interface SuggestionSet {
  _id: string
  createdAt: string
  suggestions: CareerSuggestion[]
  profileSnapshot?: UserProfile
}
