import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../lib/api'
import { getUser, setProfile } from '../lib/auth'
import type { SuggestionSet } from '../lib/types'
import {
  Sparkles, ArrowRight, Edit3, TrendingUp, Clock, Target, BookOpen,
  BarChart2, CheckCircle, AlertCircle, User, MapPin, Briefcase, GraduationCap,
} from 'lucide-react'

export default function Dashboard() {
  const user = getUser()
  const navigate = useNavigate()
  const [profile, setProfileState] = useState<any>(null)
  const [latestAnalysis, setLatestAnalysis] = useState<SuggestionSet | null>(null)
  const [historyCount, setHistoryCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, historyRes] = await Promise.all([
          api.get('/api/profile'),
          api.get('/api/career/history'),
        ])
        const p = profileRes.data.profile
        setProfileState(p)
        setProfile(p)
        const history: SuggestionSet[] = historyRes.data.history || []
        setHistoryCount(history.length)
        if (history.length > 0) setLatestAnalysis(history[0])
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const profileComplete = profile && profile.currentRole && profile.targetCareerInterest && profile.skills?.length >= 2
  const topSuggestion = latestAnalysis?.suggestions?.[0]
  const avgMatch = latestAnalysis
    ? Math.round(latestAnalysis.suggestions.reduce((a, s) => a + s.matchPercentage, 0) / latestAnalysis.suggestions.length)
    : null

  if (loading) {
    return (
      <div className="min-h-screen bg-mesh">
        <Navbar />
        <div className="pt-28 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4"/>
            <p className="text-gray-500 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />
      <div className="pt-28 pb-16 px-4 max-w-6xl mx-auto">

        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-serif text-4xl font-bold text-charcoal">
              Welcome back, {user?.firstName} 👋
            </h1>
            <p className="text-gray-500 mt-1">
              {profileComplete
                ? latestAnalysis
                  ? 'Your latest career analysis is ready. Keep updating your skills to improve your match.'
                  : 'Your profile is complete! Get your personalized career advice below.'
                : 'Complete your profile to unlock your personalized career gap analysis.'}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/profile/edit" className="btn-secondary text-sm py-2.5">
              <Edit3 size={15}/> Edit Profile
            </Link>
            <Link to="/results" className="btn-primary text-sm py-2.5">
              <Sparkles size={15}/>
              {latestAnalysis ? 'Re-analyze' : 'Get Career Advice'}
            </Link>
          </div>
        </div>

        {/* Profile incomplete banner */}
        {!profileComplete && (
          <div className="glass-card rounded-2xl p-5 mb-6 border-l-4 border-amber-400 flex items-start gap-4">
            <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20}/>
            <div className="flex-1">
              <p className="font-semibold text-charcoal mb-1">Complete your profile to get started</p>
              <p className="text-sm text-gray-500">Add your current role, target career interest, and at least 2 skills to unlock AI career gap analysis.</p>
            </div>
            <Link to="/profile/edit" className="btn-primary text-sm py-2 flex-shrink-0">
              Complete Profile <ArrowRight size={14}/>
            </Link>
          </div>
        )}

        {/* Stats Row */}
        {profileComplete && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="stat-card text-center">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center mx-auto mb-2">
                <Target size={18} className="text-violet-600"/>
              </div>
              <p className="text-2xl font-bold text-charcoal">{profile?.skills?.length || 0}</p>
              <p className="text-xs text-gray-500 font-medium">Skills Listed</p>
            </div>
            <div className="stat-card text-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                <BarChart2 size={18} className="text-emerald-600"/>
              </div>
              <p className="text-2xl font-bold text-charcoal">{historyCount}</p>
              <p className="text-xs text-gray-500 font-medium">Analyses Run</p>
            </div>
            <div className="stat-card text-center">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-2">
                <TrendingUp size={18} className="text-amber-600"/>
              </div>
              <p className="text-2xl font-bold text-charcoal">{avgMatch !== null ? `${avgMatch}%` : '—'}</p>
              <p className="text-xs text-gray-500 font-medium">Avg Match Score</p>
            </div>
            <div className="stat-card text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <Clock size={18} className="text-blue-600"/>
              </div>
              <p className="text-2xl font-bold text-charcoal">
                {topSuggestion ? `${topSuggestion.timeToReadyWeeks}w` : '—'}
              </p>
              <p className="text-xs text-gray-500 font-medium">Weeks to Ready</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Profile Card */}
          <div className="lg:col-span-1 space-y-5">
            <div className="glass-card rounded-3xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-5">
                <p className="section-label">My Profile</p>
                <Link to="/profile/edit" className="text-violet-600 hover:text-violet-700 transition-colors">
                  <Edit3 size={15}/>
                </Link>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-violet-50">
                <div className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-glass">
                  {user?.firstName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-charcoal">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-3.5">
                <InfoRow icon={<Briefcase size={14}/>}
                  label="Current Role"
                  value={profile?.currentRole || 'Not set'}
                  empty={!profile?.currentRole}/>
                <InfoRow icon={<Target size={14}/>}
                  label="Target Career"
                  value={profile?.targetCareerInterest || 'Not set'}
                  empty={!profile?.targetCareerInterest}
                  highlight/>
                <InfoRow icon={<GraduationCap size={14}/>}
                  label="Background"
                  value={profile?.academicBackground || 'Not set'}
                  empty={!profile?.academicBackground}/>
                <InfoRow icon={<MapPin size={14}/>}
                  label="Location"
                  value={profile?.location || 'Not set'}
                  empty={!profile?.location}/>
                <InfoRow icon={<Clock size={14}/>}
                  label="Hours / Week"
                  value={profile?.hoursPerWeekAvailable ? `${profile.hoursPerWeekAvailable}h available` : 'Not set'}
                  empty={!profile?.hoursPerWeekAvailable}/>
              </div>

              {/* Skills preview */}
              {profile?.skills?.length > 0 && (
                <div className="mt-5 pt-5 border-t border-violet-50">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2.5">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.slice(0, 8).map((s: string) => (
                      <span key={s} className="badge bg-violet-100 text-violet-700 text-xs">{s}</span>
                    ))}
                    {profile.skills.length > 8 && (
                      <span className="badge bg-gray-100 text-gray-500 text-xs">+{profile.skills.length - 8} more</span>
                    )}
                  </div>
                </div>
              )}

              {/* Profile completeness */}
              <div className="mt-5 pt-5 border-t border-violet-50">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span className="font-semibold">Profile completeness</span>
                  <span className="font-bold text-violet-600">{calcCompleteness(profile)}%</span>
                </div>
                <div className="h-1.5 bg-violet-100 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-600 rounded-full transition-all duration-700"
                    style={{ width: `${calcCompleteness(profile)}%` }}/>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card rounded-3xl p-5 shadow-card">
              <p className="section-label mb-4">Quick Actions</p>
              <div className="space-y-2">
                <Link to="/results" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-violet-50 transition-colors group">
                  <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center group-hover:bg-violet-200 transition-colors">
                    <Sparkles size={16} className="text-violet-600"/>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">Get Career Advice</p>
                    <p className="text-xs text-gray-400">Run AI gap analysis</p>
                  </div>
                  <ArrowRight size={14} className="text-gray-300 ml-auto group-hover:text-violet-500 transition-colors"/>
                </Link>
                <Link to="/profile/edit" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-violet-50 transition-colors group">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <Edit3 size={16} className="text-emerald-600"/>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">Update Skills</p>
                    <p className="text-xs text-gray-400">Add new skills you've learned</p>
                  </div>
                  <ArrowRight size={14} className="text-gray-300 ml-auto group-hover:text-violet-500 transition-colors"/>
                </Link>
                <Link to="/history" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-violet-50 transition-colors group">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                    <BarChart2 size={16} className="text-amber-600"/>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">View History</p>
                    <p className="text-xs text-gray-400">Track your progress over time</p>
                  </div>
                  <ArrowRight size={14} className="text-gray-300 ml-auto group-hover:text-violet-500 transition-colors"/>
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Latest Analysis */}
          <div className="lg:col-span-2 space-y-5">
            {latestAnalysis ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="section-label">Latest Analysis</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(latestAnalysis.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <Link to="/results" className="btn-secondary text-sm py-2">
                    Re-analyze <ArrowRight size={14}/>
                  </Link>
                </div>

                {/* Role cards compact */}
                {latestAnalysis.suggestions.map((s) => (
                  <div key={s.rank} className={`glass-card rounded-3xl p-5 shadow-card ${s.rank === 1 ? 'ring-2 ring-violet-200' : ''}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`badge ${s.rank === 1 ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-700'}`}>
                          {s.rank === 1 && <Star size={11}/>} #{s.rank} Match
                        </span>
                        <h3 className="font-serif text-xl font-bold text-charcoal">{s.roleName}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-violet-600">{s.matchPercentage}%</p>
                        <p className="text-xs text-gray-400">readiness</p>
                      </div>
                    </div>

                    <div className="h-2 bg-violet-100 rounded-full overflow-hidden mb-4">
                      <div className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${s.matchPercentage}%`, background: s.rank === 1 ? '#7C3AED' : '#A78BFA' }}/>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{s.reasoning}</p>

                    {/* Proof of pivot */}
                    <div className="bg-gradient-to-r from-violet-600 to-violet-700 rounded-2xl p-4 mb-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-violet-200 mb-1">✦ Proof of Pivot</p>
                      <p className="text-xs text-white leading-relaxed">"{s.proofOfPivotStatement}"</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {s.missingSkills.slice(0, 3).map(sk => (
                          <span key={sk.skillName} className="badge text-xs bg-amber-50 text-amber-700 border border-amber-200">
                            {sk.skillName}
                          </span>
                        ))}
                        {s.missingSkills.length > 3 && (
                          <span className="badge text-xs bg-gray-100 text-gray-500">+{s.missingSkills.length - 3} more</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock size={12} className="text-violet-400"/>{s.timeToReadyWeeks}w
                      </div>
                    </div>
                  </div>
                ))}

                <Link to="/history" className="block glass-card rounded-2xl p-4 text-center hover:bg-violet-50/50 transition-colors group">
                  <p className="text-sm font-semibold text-violet-600 flex items-center justify-center gap-2">
                    <BarChart2 size={15}/> View full history & progress tracking
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                  </p>
                </Link>
              </>
            ) : (
              <div className="glass-card rounded-3xl p-10 shadow-card text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 rounded-3xl bg-violet-100 flex items-center justify-center mx-auto mb-6">
                  <Sparkles size={36} className="text-violet-500"/>
                </div>
                <h3 className="font-serif text-2xl font-bold text-charcoal mb-3">
                  Your analysis awaits
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-8">
                  {profileComplete
                    ? "Click below to run your first AI career gap analysis. Takes about 15 seconds."
                    : "Complete your profile first, then run your career gap analysis to see which roles you're closest to landing."}
                </p>
                {profileComplete ? (
                  <Link to="/results" className="btn-primary">
                    <Sparkles size={16}/> Run My Career Analysis
                  </Link>
                ) : (
                  <Link to="/profile/edit" className="btn-primary">
                    Complete My Profile <ArrowRight size={16}/>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value, empty, highlight }: {
  icon: React.ReactNode; label: string; value: string; empty?: boolean; highlight?: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${highlight ? 'bg-violet-100 text-violet-600' : 'bg-gray-100 text-gray-500'}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className={`text-sm font-semibold ${empty ? 'text-gray-300 italic' : highlight ? 'text-violet-600' : 'text-charcoal'}`}>
          {value}
        </p>
      </div>
      {!empty && <CheckCircle size={14} className="text-emerald-400 ml-auto mt-1.5 flex-shrink-0"/>}
    </div>
  )
}

function calcCompleteness(profile: any): number {
  if (!profile) return 0
  let score = 0
  if (profile.currentRole)          score += 20
  if (profile.targetCareerInterest) score += 25
  if (profile.skills?.length >= 2)  score += 25
  if (profile.academicBackground)   score += 10
  if (profile.location)             score += 10
  if (profile.interests?.length >= 1) score += 10
  return score
}

function Star({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
}
