import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import RoleCard from '../components/RoleCard'
import api from '../lib/api'
import type { CareerSuggestion } from '../lib/types'
import { Sparkles, RefreshCw, BarChart2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

const LOADING_MSGS = [
  'Reading your profile details...',
  'Mapping your skills to job requirements...',
  'Calculating your readiness scores...',
  'Identifying your skill gaps...',
  'Crafting your Proof of Pivot statements...',
  'Building your 6-week roadmaps...',
  'Almost ready...',
]

export default function Results() {
  const [suggestions, setSuggestions] = useState<CareerSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [msgIndex, setMsgIndex] = useState(0)
  const [analyzed, setAnalyzed] = useState(false)
  const intervalRef = useRef<any>(null)

  const analyze = async () => {
    setLoading(true); setError(''); setSuggestions([]); setMsgIndex(0)
    intervalRef.current = setInterval(() => {
      setMsgIndex(i => (i + 1) % LOADING_MSGS.length)
    }, 2200)
    try {
      const { data } = await api.post('/api/career/analyze')
      setSuggestions(data.suggestions)
      setAnalyzed(true)
    } catch (e: any) {
      const msg = e.response?.data?.message || 'Analysis failed. Please try again.'
      setError(msg)
      console.error('Analyze failed:', e.response?.data)
    } finally {
      clearInterval(intervalRef.current)
      setLoading(false)
    }
  }

  useEffect(() => { analyze(); return () => clearInterval(intervalRef.current) }, [])

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar/>
      <div className="pt-28 pb-16 px-4 max-w-6xl mx-auto">

        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="btn-ghost text-sm py-2">
            <ArrowLeft size={15}/> Dashboard
          </Link>
        </div>

        <div className="text-center mb-10">
          <span className="section-label">Gap Intelligence Engine ⚡</span>
          <h1 className="font-serif text-4xl font-bold text-charcoal mt-3 mb-3">Your Career Pivot Analysis</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Based on your profile, these are the 3 roles you're closest to landing right now — ranked by match percentage.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative w-28 h-28 mb-8">
              <div className="absolute inset-0 w-28 h-28 rounded-full border-4 border-violet-100"/>
              <div className="absolute inset-0 w-28 h-28 rounded-full border-4 border-violet-600 border-t-transparent animate-spin"/>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={32} className="text-violet-600 animate-pulse"/>
              </div>
            </div>
            <p className="text-lg font-semibold text-charcoal mb-2 animate-pulse">{LOADING_MSGS[msgIndex]}</p>
            <p className="text-sm text-gray-400 mb-8">This takes 10–20 seconds</p>
            <div className="flex gap-2">
              {LOADING_MSGS.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === msgIndex ? 'bg-violet-600 scale-125' : 'bg-violet-200'}`}/>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="max-w-lg mx-auto">
            <div className="glass-card rounded-3xl p-8 shadow-card text-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-500"/>
              </div>
              <h3 className="font-semibold text-charcoal mb-2 text-lg">Analysis couldn't run</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <Link to="/profile/edit" className="btn-secondary">Update Profile</Link>
                <button onClick={analyze} className="btn-primary"><RefreshCw size={15}/> Try Again</button>
              </div>
            </div>

            {/* Debug hint */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wide">How to fix this</p>
              <ol className="text-xs text-amber-800 space-y-2 list-decimal list-inside">
                <li>Go to <strong>openrouter.ai/keys</strong> → create a new API key</li>
                <li>Open <code className="bg-amber-100 px-1 rounded font-mono">backend/.env</code> file</li>
                <li>Set: <code className="bg-amber-100 px-1 rounded font-mono">OPENROUTER_API_KEY=sk-or-v1-yourkey</code></li>
                <li>Make sure there are <strong>no quotes, no spaces</strong> around the key</li>
                <li><strong>Restart your backend server</strong> after saving .env</li>
              </ol>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && suggestions.length > 0 && (
          <div className="animate-fade-in">
            {/* Summary banner */}
            <div className="glass-card rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-violet-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <CheckCircle size={20} className="text-emerald-600"/>
                </div>
                <div>
                  <p className="font-semibold text-charcoal text-sm">Analysis complete</p>
                  <p className="text-xs text-gray-500">
                    Top match: <span className="font-bold text-violet-600">{suggestions[0]?.roleName}</span> at {suggestions[0]?.matchPercentage}% readiness
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={analyze} className="btn-secondary text-sm py-2">
                  <RefreshCw size={14}/> Re-analyze
                </button>
                <Link to="/history" className="btn-secondary text-sm py-2">
                  <BarChart2 size={14}/> View History
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {suggestions.map(s => <RoleCard key={s.rank} suggestion={s} rank={s.rank}/>)}
            </div>

            <div className="glass-card rounded-2xl p-5 text-center border border-violet-100">
              <p className="text-sm font-semibold text-charcoal mb-1">Update your profile as you learn new skills</p>
              <p className="text-xs text-gray-500 mb-4">Re-analyze weekly to watch your readiness score climb.</p>
              <div className="flex justify-center gap-3">
                <Link to="/profile/edit" className="btn-primary text-sm py-2.5">
                  <Sparkles size={14}/> Add New Skills
                </Link>
                <Link to="/dashboard" className="btn-secondary text-sm py-2.5">
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}