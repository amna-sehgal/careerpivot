import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../lib/api'
import type { SuggestionSet } from '../lib/types'
import { TrendingUp, TrendingDown, Calendar, Sparkles, BarChart2, ArrowLeft, Clock, Target, ChevronDown, ChevronUp } from 'lucide-react'

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

const fmtTime = (d: string) =>
  new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

export default function History() {
  const [history, setHistory] = useState<SuggestionSet[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<SuggestionSet | null>(null)
  const [expandedRole, setExpandedRole] = useState<number | null>(0)

  useEffect(() => {
    api.get('/api/career/history').then(({ data }) => {
      const h = data.history || []
      setHistory(h)
      if (h.length > 0) setSelected(h[0])
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  // Build progression data (reverse to chronological order for chart)
  const progression = [...history].reverse().map(set => ({
    date: set.createdAt,
    topMatch: set.suggestions[0]?.matchPercentage || 0,
    avgMatch: Math.round(set.suggestions.reduce((a, s) => a + s.matchPercentage, 0) / (set.suggestions.length || 1)),
    topRole: set.suggestions[0]?.roleName || '',
  }))

  const latestTop = progression[progression.length - 1]?.topMatch || 0
  const prevTop   = progression[progression.length - 2]?.topMatch || 0
  const delta     = latestTop - prevTop

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar/>
      <div className="pt-28 pb-16 px-4 max-w-6xl mx-auto">

        <div className="flex items-center gap-3 mb-8">
          <Link to="/dashboard" className="btn-ghost text-sm py-2"><ArrowLeft size={15}/> Dashboard</Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="section-label">Progress Tracking</span>
            <h1 className="font-serif text-4xl font-bold text-charcoal mt-2">Career History</h1>
            <p className="text-gray-500 mt-1.5 text-sm">See how your career readiness has evolved as you've grown your skills.</p>
          </div>
          <Link to="/results" className="btn-primary text-sm py-2.5 self-start md:self-auto">
            <Sparkles size={15}/> New Analysis
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"/>
          </div>
        )}

        {!loading && history.length === 0 && (
          <div className="glass-card rounded-3xl p-16 text-center max-w-md mx-auto shadow-card">
            <div className="w-20 h-20 rounded-3xl bg-violet-100 flex items-center justify-center mx-auto mb-6">
              <BarChart2 size={36} className="text-violet-400"/>
            </div>
            <h3 className="font-serif text-2xl font-bold text-charcoal mb-3">No history yet</h3>
            <p className="text-sm text-gray-500 mb-8">Run your first career analysis to start tracking your progress over time.</p>
            <Link to="/results" className="btn-primary">Get Career Advice</Link>
          </div>
        )}

        {!loading && history.length > 0 && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="stat-card text-center">
                <p className="text-2xl font-bold text-charcoal">{history.length}</p>
                <p className="text-xs text-gray-500 font-medium mt-1">Total Analyses</p>
              </div>
              <div className="stat-card text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <p className="text-2xl font-bold text-violet-600">{latestTop}%</p>
                  {history.length > 1 && (
                    <span className={`text-xs font-bold flex items-center gap-0.5 ${delta >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                      {delta >= 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                      {delta >= 0 ? '+' : ''}{delta}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-medium">Latest Top Match</p>
              </div>
              <div className="stat-card text-center">
                <p className="text-2xl font-bold text-charcoal">{history[0]?.suggestions[0]?.roleName?.split(' ')[0] || '—'}</p>
                <p className="text-xs text-gray-500 font-medium mt-1">Best Role (Latest)</p>
              </div>
              <div className="stat-card text-center">
                <p className="text-2xl font-bold text-charcoal">
                  {history[0]?.suggestions[0]?.timeToReadyWeeks || '—'}
                  <span className="text-base font-normal">w</span>
                </p>
                <p className="text-xs text-gray-500 font-medium mt-1">Weeks to Ready</p>
              </div>
            </div>

            {/* Progression Chart (visual) */}
            {progression.length >= 2 && (
              <div className="glass-card rounded-3xl p-6 shadow-card mb-8">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="section-label">Readiness Progression</p>
                    <p className="text-xs text-gray-400 mt-1">Your top match % over time</p>
                  </div>
                  {delta !== 0 && (
                    <span className={`badge text-sm px-4 py-2 ${delta > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                      {delta > 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                      {delta > 0 ? `+${delta}%` : `${delta}%`} since last
                    </span>
                  )}
                </div>
                <div className="space-y-4">
                  {progression.map((p, i) => (
                    <div key={p.date} className="flex items-center gap-4">
                      <div className="text-xs text-gray-400 font-medium w-24 flex-shrink-0">{fmtDate(p.date)}</div>
                      <div className="flex-1">
                        <div className="h-8 bg-violet-100 rounded-xl overflow-hidden relative">
                          <div
                            className="h-full rounded-xl flex items-center px-3 transition-all duration-700"
                            style={{ width: `${p.topMatch}%`, background: i === progression.length - 1 ? 'linear-gradient(90deg, #7C3AED, #06B6D4)' : '#A78BFA' }}
                          >
                            <span className="text-xs text-white font-bold">{p.topRole}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-violet-600 w-12 text-right flex-shrink-0">{p.topMatch}%</div>
                      {i > 0 && (
                        <div className={`flex-shrink-0 ${p.topMatch >= progression[i-1].topMatch ? 'text-emerald-500' : 'text-red-400'}`}>
                          {p.topMatch >= progression[i-1].topMatch ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                        </div>
                      )}
                      {i === 0 && <div className="w-[14px] flex-shrink-0"/>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Timeline Sidebar */}
              <div className="lg:col-span-1">
                <div className="glass-card rounded-3xl p-5 shadow-card">
                  <p className="section-label mb-4">Analysis History</p>
                  <div className="space-y-2">
                    {history.map((set, i) => {
                      const top = set.suggestions[0]
                      const isSelected = selected?._id === set._id
                      return (
                        <button key={set._id} onClick={() => { setSelected(set); setExpandedRole(0) }}
                          className={`w-full text-left rounded-2xl p-3.5 transition-all duration-200 ${
                            isSelected ? 'bg-violet-600 text-white shadow-glass' : 'hover:bg-violet-50 text-charcoal'
                          }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-bold flex items-center gap-1 ${isSelected ? 'text-violet-200' : 'text-gray-400'}`}>
                              <Calendar size={11}/> {fmtDate(set.createdAt)}
                            </span>
                            {i === 0 && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-violet-100 text-violet-600'}`}>Latest</span>}
                          </div>
                          <p className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-charcoal'}`}>{top?.roleName}</p>
                          <p className={`text-xs mt-0.5 ${isSelected ? 'text-violet-200' : 'text-gray-400'}`}>
                            Top match: <span className="font-bold">{top?.matchPercentage}%</span>
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Detail Panel */}
              {selected && (
                <div className="lg:col-span-2 space-y-4 animate-fade-in">
                  <div className="glass-card rounded-3xl p-6 shadow-card">
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <p className="section-label">Analysis from {fmtDate(selected.createdAt)}</p>
                        <p className="text-xs text-gray-400 mt-0.5">at {fmtTime(selected.createdAt)}</p>
                      </div>
                      {selected.profileSnapshot && (
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Profile at time of analysis</p>
                          <p className="text-sm font-semibold text-charcoal">{selected.profileSnapshot.currentRole} → {selected.profileSnapshot.targetCareerInterest}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {selected.suggestions.map((s, i) => (
                        <div key={s.rank} className={`rounded-2xl border transition-all duration-200 ${s.rank === 1 ? 'border-violet-200 bg-violet-50/50' : 'border-gray-100 bg-white'}`}>
                          <button
                            className="w-full p-4 text-left"
                            onClick={() => setExpandedRole(expandedRole === i ? null : i)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className={`badge text-xs ${s.rank === 1 ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-700'}`}>#{s.rank}</span>
                                <span className="font-semibold text-charcoal">{s.roleName}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-violet-600">{s.matchPercentage}%</span>
                                {expandedRole === i ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
                              </div>
                            </div>
                            <div className="mt-3 h-1.5 bg-violet-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${s.matchPercentage}%`, background: s.rank === 1 ? '#7C3AED' : '#A78BFA' }}/>
                            </div>
                          </button>

                          {expandedRole === i && (
                            <div className="px-4 pb-4 space-y-3 animate-fade-in">
                              <p className="text-sm text-gray-600 leading-relaxed">{s.reasoning}</p>

                              <div className="bg-gradient-to-r from-violet-600 to-violet-700 rounded-xl p-3.5">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-violet-200 mb-1">✦ Proof of Pivot</p>
                                <p className="text-xs text-white leading-relaxed">"{s.proofOfPivotStatement}"</p>
                              </div>

                              <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Skills to Learn</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {s.missingSkills.map(sk => (
                                    <span key={sk.skillName} className="badge text-xs bg-amber-50 text-amber-700 border border-amber-200">
                                      {sk.skillName} <span className="opacity-50">·{sk.estimatedWeeksToLearn}w</span>
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                                <span className="flex items-center gap-1"><Clock size={11} className="text-violet-400"/>{s.timeToReadyWeeks} weeks to ready</span>
                                <span className="flex items-center gap-1"><Target size={11} className="text-amber-400"/>{s.missingSkills.length} skill gaps</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills compared */}
                  {selected.profileSnapshot?.skills && (
                    <div className="glass-card rounded-3xl p-5 shadow-card">
                      <p className="section-label mb-3">Skills at Time of Analysis</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selected.profileSnapshot.skills.map(sk => (
                          <span key={sk} className="badge text-xs bg-gray-100 text-gray-600 border border-gray-200">{sk}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
