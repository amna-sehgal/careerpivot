import { useState } from 'react'
import { ChevronDown, ChevronUp, Clock, Zap, BookOpen, Star, Target, TrendingUp } from 'lucide-react'
import type { CareerSuggestion } from '../lib/types'

interface Props { suggestion: CareerSuggestion; rank: number }

const priorityStyle: Record<string, string> = {
  high:   'bg-red-50 text-red-600 border-red-200',
  medium: 'bg-amber-50 text-amber-600 border-amber-200',
  low:    'bg-emerald-50 text-emerald-600 border-emerald-200',
}

export default function RoleCard({ suggestion, rank }: Props) {
  const [expanded, setExpanded] = useState(rank === 1)
  const pct = suggestion.matchPercentage
  const circumference = 2 * Math.PI * 36
  const strokeDash = (pct / 100) * circumference

  const rankColors = [
    { badge: 'Best Match', ring: 'ring-2 ring-violet-300', accent: '#7C3AED' },
    { badge: '2nd Match',  ring: '',                        accent: '#A78BFA' },
    { badge: '3rd Match',  ring: '',                        accent: '#C4B5FD' },
  ]
  const cfg = rankColors[rank - 1] || rankColors[2]

  return (
    <div className={`glass-card rounded-3xl p-6 animate-slide-up transition-all duration-300 ${cfg.ring} ${rank === 1 ? 'shadow-float' : 'shadow-card'}`}>
      {/* Header row */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1 pr-4">
          <span className={`badge mb-2 ${rank === 1 ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-700'}`}>
            {rank === 1 && <Star size={11} />}{cfg.badge}
          </span>
          <h3 className="font-serif text-2xl font-bold text-charcoal leading-tight mt-1">
            {suggestion.roleName}
          </h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><Clock size={13} className="text-violet-400"/>{suggestion.timeToReadyWeeks}w to job-ready</span>
            <span className="flex items-center gap-1.5"><Target size={13} className="text-amber-400"/>{suggestion.missingSkills.length} gaps</span>
          </div>
        </div>
        {/* Circular readiness dial */}
        <div className="relative flex-shrink-0 w-20 h-20">
          <svg viewBox="0 0 88 88" className="w-20 h-20 -rotate-90">
            <circle cx="44" cy="44" r="36" fill="none" stroke="#EDE9FE" strokeWidth="8"/>
            <circle cx="44" cy="44" r="36" fill="none" stroke={cfg.accent} strokeWidth="8"
              strokeLinecap="round" strokeDasharray={`${strokeDash} ${circumference}`}
              className="transition-all duration-1000"/>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-violet-600 leading-none">{pct}%</span>
            <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide">Ready</span>
          </div>
        </div>
      </div>

      {/* Readiness bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>Your current readiness</span>
          <span className="font-semibold text-violet-600">{pct}%</span>
        </div>
        <div className="h-2 bg-violet-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${cfg.accent}, #06B6D4)` }}/>
        </div>
      </div>

      {/* Reasoning */}
      <div className="bg-violet-50/70 border border-violet-100 rounded-2xl p-4 mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-1.5 flex items-center gap-1.5">
          <TrendingUp size={11}/> Why this fits you
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">{suggestion.reasoning}</p>
      </div>

      {/* Proof of Pivot */}
      <div className="relative overflow-hidden rounded-2xl mb-4 p-5"
        style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)' }}>
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10"/>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5"/>
        <p className="relative text-xs font-bold uppercase tracking-widest text-violet-200 mb-2">✦ Proof of Pivot</p>
        <p className="relative text-sm text-white leading-relaxed italic">"{suggestion.proofOfPivotStatement}"</p>
      </div>

      {/* Missing Skills */}
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2.5">Skills to Learn</p>
        <div className="flex flex-wrap gap-2">
          {suggestion.missingSkills.map(skill => (
            <span key={skill.skillName} className={`badge border ${priorityStyle[skill.priority]}`}>
              {skill.skillName}
              <span className="opacity-50 ml-1">·{skill.estimatedWeeksToLearn}w</span>
            </span>
          ))}
        </div>
      </div>

      {/* Roadmap toggle */}
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between pt-4 border-t border-violet-100 text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors">
        <span className="flex items-center gap-1.5"><BookOpen size={15}/>6-Week Roadmap</span>
        {expanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
      </button>

      {expanded && (
        <div className="mt-4 space-y-3 animate-fade-in">
          {suggestion.highlevelRoadmap.map(phase => (
            <div key={phase.phase} className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-bold">
                {phase.phase}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-charcoal">{phase.focus}</span>
                  <span className="text-xs text-gray-400">{phase.weeks} · {phase.hoursPerWeek}h/wk</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {phase.resources.map(r => (
                    <span key={r} className="text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-0.5">{r}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
