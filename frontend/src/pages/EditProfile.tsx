import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import TagInput from '../components/TagInput'
import api from '../lib/api'
import { setProfile } from '../lib/auth'
import { Save, ArrowLeft, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react'

const SKILLS = ['React','Node.js','Python','SQL','TypeScript','Java','Machine Learning','Data Analysis','Excel','Tableau','Power BI','Product Management','UX Design','Figma','Marketing','SEO','Content Writing','Sales','Communication','Project Management','Agile','Scrum','AWS','Docker','Git','MongoDB','Go-to-Market','Customer Research','Analytics','Storytelling','Leadership','Statistics','R','TensorFlow','PyTorch','Pandas','NumPy','Django','Flask','Spring Boot','C++','Kotlin','Swift','Cybersecurity','Blockchain','DevOps','CI/CD','Kubernetes','Redis','GraphQL']
const INTERESTS = ['Product Management','Data Science','Machine Learning','Software Engineering','UX/UI Design','Product Design','Business Analytics','Growth Marketing','DevOps','Cloud Engineering','Cybersecurity','Blockchain','AI/ML Engineering','Technical Program Management','Product Marketing','Data Engineering','Full Stack Development','Mobile Development','Quantitative Finance','Research & Development']
const BACKGROUNDS = ['B.Tech / B.E. (CS)','B.Tech / B.E. (Other)','BCA','B.Sc (CS/IT)','MBA','BBA','B.Sc (Physics / Math)','BA / B.Com','Diploma','Self-Taught','M.Tech','MCA','M.Sc']
const LOCATIONS = ['Bangalore','Mumbai','Delhi NCR','Hyderabad','Pune','Chennai','Kolkata','Ahmedabad','Jaipur','Indore','Chandigarh','Noida','Gurugram','Remote / Open to Relocation']
const STEPS = ['About You','Skills & Interests','Career Goal']

export default function EditProfile() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfileState] = useState({
    currentRole: '', yearsOfExperience: 1, academicBackground: '', location: '',
    skills: [] as string[], interests: [] as string[], targetCareerInterest: '', hoursPerWeekAvailable: 10,
  })

  useEffect(() => {
    api.get('/api/profile').then(({ data }) => {
      if (data.profile) setProfileState((p) => ({ ...p, ...data.profile }))
    }).catch(() => {})
  }, [])

  const set = (key: string) => (val: any) => setProfileState(p => ({ ...p, [key]: val }))

  const handleSave = async (redirect = false) => {
    setSaving(true); setError('')
    try {
      await api.post('/api/profile', profile)
      setProfile(profile)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      if (redirect) navigate('/dashboard')
    } catch (e: any) {
      setError(e.response?.data?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  const canNext = () => {
    if (step === 0) return profile.currentRole.trim().length > 0
    if (step === 1) return profile.skills.length >= 1
    if (step === 2) return !!profile.targetCareerInterest
    return true
  }

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar/>
      <div className="pt-28 pb-16 px-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/dashboard" className="btn-ghost text-sm py-2">
            <ArrowLeft size={15}/> Back to Dashboard
          </Link>
        </div>
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-charcoal">Edit Your Profile</h1>
          <p className="text-gray-500 mt-1.5 text-sm">The more detailed your profile, the better your career recommendations.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button onClick={() => i <= step && setStep(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  i === step ? 'bg-violet-600 text-white shadow-glass'
                  : i < step ? 'bg-violet-100 text-violet-700 cursor-pointer hover:bg-violet-200'
                  : 'bg-white text-gray-400 border border-gray-200 cursor-not-allowed'
                }`}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                  {i < step ? '✓' : i + 1}
                </span>
                {s}
              </button>
              {i < STEPS.length - 1 && <div className="w-6 h-0.5 bg-violet-100 rounded-full"/>}
            </div>
          ))}
        </div>

        <div className="glass-card rounded-3xl p-8 shadow-float">
          {step === 0 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Current Role / Job Title</label>
                <input className="input-field" placeholder="e.g. Marketing Manager, Software Engineer, HR Specialist"
                  value={profile.currentRole} onChange={e => set('currentRole')(e.target.value)}/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Years of Experience — <span className="text-violet-600">{profile.yearsOfExperience} year{profile.yearsOfExperience !== 1 ? 's' : ''}</span>
                </label>
                <input type="range" min="0" max="20" step="1" value={profile.yearsOfExperience}
                  onChange={e => set('yearsOfExperience')(Number(e.target.value))}
                  className="w-full accent-violet-600 h-2"/>
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Fresher</span><span>5y</span><span>10y</span><span>20y+</span></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Academic Background</label>
                <select className="input-field appearance-none cursor-pointer" value={profile.academicBackground}
                  onChange={e => set('academicBackground')(e.target.value)}>
                  <option value="">Select your qualification</option>
                  {BACKGROUNDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Location</label>
                <select className="input-field appearance-none cursor-pointer" value={profile.location}
                  onChange={e => set('location')(e.target.value)}>
                  <option value="">Select your city</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <TagInput label="Your Current Skills (min. 1)" placeholder="Type and press Enter — e.g. React, SQL, Marketing"
                tags={profile.skills} onChange={set('skills')} suggestions={SKILLS}/>
              <TagInput label="Your Interests (What do you enjoy?)" placeholder="e.g. Product Strategy, Data Analysis"
                tags={profile.interests} onChange={set('interests')} suggestions={INTERESTS}/>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Target Career Direction</label>
                <select className="input-field appearance-none cursor-pointer" value={profile.targetCareerInterest}
                  onChange={e => set('targetCareerInterest')(e.target.value)}>
                  <option value="">Select where you want to go</option>
                  {INTERESTS.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
                <p className="text-xs text-gray-400 mt-1.5">Pick your primary direction — we'll suggest 3 nearby roles you're closest to landing.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Hours available per week to learn — <span className="text-violet-600">{profile.hoursPerWeekAvailable}h</span>
                </label>
                <input type="range" min="2" max="40" step="2" value={profile.hoursPerWeekAvailable}
                  onChange={e => set('hoursPerWeekAvailable')(Number(e.target.value))}
                  className="w-full accent-violet-600 h-2"/>
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>2h (light)</span><span>10h</span><span>20h</span><span>40h (full-time)</span></div>
              </div>

              {/* Summary */}
              <div className="bg-violet-50 rounded-2xl p-4 border border-violet-100">
                <p className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-3">Profile Summary</p>
                <div className="grid grid-cols-2 gap-2.5 text-sm">
                  <div><span className="text-gray-400">Role:</span> <span className="font-semibold text-charcoal">{profile.currentRole||'—'}</span></div>
                  <div><span className="text-gray-400">Location:</span> <span className="font-semibold text-charcoal">{profile.location||'—'}</span></div>
                  <div><span className="text-gray-400">Skills:</span> <span className="font-semibold text-charcoal">{profile.skills.length} added</span></div>
                  <div><span className="text-gray-400">Target:</span> <span className="font-semibold text-violet-600">{profile.targetCareerInterest||'—'}</span></div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-600 font-medium">{error}</div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-violet-50">
            <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
              className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft size={16}/> Back
            </button>
            <div className="flex items-center gap-3">
              <button onClick={() => handleSave()} disabled={saving}
                className="btn-secondary text-sm py-2.5">
                <Save size={14}/> {saved ? 'Saved ✓' : saving ? 'Saving...' : 'Save'}
              </button>
              {step < STEPS.length - 1 ? (
                <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                  className="btn-primary text-sm py-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                  Next <ChevronRight size={14}/>
                </button>
              ) : (
                <button onClick={() => handleSave(true)} disabled={!canNext() || saving}
                  className="btn-primary text-sm py-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                  <CheckCircle size={14}/> Save & Go to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}