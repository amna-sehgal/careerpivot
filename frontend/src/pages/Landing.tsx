import { Link, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { ArrowRight, Sparkles, TrendingUp, Users, Zap, CheckCircle, BarChart2, Target, BookOpen } from 'lucide-react'
import { getUser } from '../lib/auth'

const features = [
  { icon: <Target size={20}/>, title: 'Gap Intelligence Engine', desc: 'See your exact readiness % for 3 roles. Not vague. Not generic. Precise skill gap analysis tied to your background.' },
  { icon: <Sparkles size={20}/>, title: 'Proof of Pivot', desc: 'AI reframes your old experience as your unfair advantage in the new role. Turns "I don\'t qualify" into "I\'m uniquely ready."' },
  { icon: <TrendingUp size={20}/>, title: 'Evolution Tracking', desc: 'Update your profile as you learn. Watch your match % climb week over week. Tangible proof you\'re progressing.' },
  { icon: <BookOpen size={20}/>, title: '6-Week Roadmap', desc: 'Not a list of 50 courses. A clear, phased roadmap built for your exact gaps and your available hours per week.' },
  { icon: <BarChart2 size={20}/>, title: 'History & Comparison', desc: 'Every analysis is saved. Compare old vs new recommendations side by side. See how far you\'ve come.' },
  { icon: <Users size={20}/>, title: 'Personalized to You', desc: 'Your location, your background, your target — the AI references your actual profile, not a generic template.' },
]

export default function Landing() {
  if (getUser()) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar/>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="badge bg-violet-100 text-violet-700 border border-violet-200 mb-6 text-xs">
              <Sparkles size={11}/> AI-Powered Career Intelligence
            </span>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold text-charcoal leading-[1.1] mb-6">
              Career switcher?<br/>
              <span className="text-gradient">Know exactly</span><br/>
              how close you are.
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-md">
              Enter your background. Instantly see the 3 roles you're closest to landing — with your exact skill gaps, a 6-week roadmap, and proof your old experience is your superpower.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link to="/signup" className="btn-primary gap-2 text-base px-8 py-4">
                Get Your Analysis Free <ArrowRight size={17}/>
              </Link>
              <p className="text-sm text-gray-400 flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-500"/> No credit card · Results in 60 seconds
              </p>
            </div>
          </div>

          {/* Floating cards */}
          <div className="relative h-[480px] hidden lg:block">
            <div className="glass-card rounded-3xl p-6 absolute top-0 right-0 w-76 shadow-float">
              <span className="section-label mb-3 block">Gap Analysis · Live</span>
              <h3 className="font-serif text-xl font-bold text-charcoal mb-1">Product Manager</h3>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 h-2 rounded-full bg-violet-100 overflow-hidden">
                  <div className="h-2 rounded-full bg-violet-600" style={{ width: '82%' }}/>
                </div>
                <span className="text-sm font-bold text-violet-600">82%</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">Skills to learn:</p>
              {['SQL basics · 3w', 'PRD writing · 2w', 'User research · 2w'].map(s => (
                <div key={s} className="flex items-center gap-2 text-sm text-gray-600 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"/>
                  {s}
                </div>
              ))}
            </div>

            <div className="glass-card rounded-3xl p-5 absolute bottom-20 left-0 w-64 shadow-glass border-violet-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-violet-500 mb-1.5">✦ Proof of Pivot</p>
              <p className="text-xs text-gray-600 leading-relaxed italic">
                "Your 4 years in go-to-market strategy are exactly how products win in market. You just need to speak the language."
              </p>
            </div>

            <div className="glass-card rounded-2xl px-4 py-3 absolute bottom-4 right-8 flex items-center gap-3 shadow-card">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp size={16} className="text-emerald-600"/>
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal">Readiness: 68% → 82%</p>
                <p className="text-xs text-gray-400">After adding SQL to skills</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl px-4 py-3 absolute top-44 left-8 flex items-center gap-3 shadow-card">
              <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
                <Zap size={16} className="text-violet-600"/>
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal">6 weeks to job-ready</p>
                <p className="text-xs text-gray-400">At 10h/week pace</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 border-y border-violet-100 bg-white/60">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[['82%', 'Average readiness score', 'for users with complete profiles'],
            ['6 weeks', 'Average time to job-ready', 'from first analysis to applying'],
            ['3 paths', 'Personalized suggestions', 'ranked by your exact match %']].map(([v, l, s]) => (
            <div key={l}>
              <p className="font-serif text-4xl font-bold text-violet-600 mb-1">{v}</p>
              <p className="text-sm font-semibold text-charcoal">{l}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="section-label">What CareerPivot does</span>
          <h2 className="font-serif text-4xl font-bold text-charcoal mt-3">
            Every feature built for<br/>one thing: your clarity.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="glass-card rounded-3xl p-6 shadow-card hover:shadow-float transition-all duration-300 hover:-translate-y-1">
              <div className="w-11 h-11 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-charcoal mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="glass-card rounded-3xl p-10 md:p-14 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)' }}>
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-24 translate-x-24"/>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-16 -translate-x-16"/>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            {[['01', 'Build your profile', '3 minutes. Current role, skills, interests, and where you want to go.'],
              ['02', 'Get your gap analysis', 'AI returns 3 roles ranked by your exact readiness %, with skill gaps and roadmap.'],
              ['03', 'Watch your progress', 'Update as you learn. Re-analyze. See your match % climb week over week.']].map(([n, t, d]) => (
              <div key={n}>
                <span className="font-serif text-6xl font-bold text-white/20 block mb-3">{n}</span>
                <h3 className="font-semibold text-white mb-2">{t}</h3>
                <p className="text-violet-200 text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <span className="section-label">Get started</span>
        <h2 className="font-serif text-4xl font-bold text-charcoal mt-3 mb-3">
          Every career change starts<br/>with one question.
        </h2>
        <p className="text-xl text-gray-400 mb-10 italic">"Am I actually ready?"</p>
        <Link to="/signup" className="btn-primary text-base px-10 py-4 inline-flex">
          <Zap size={18}/> Find Out in 60 Seconds
        </Link>
      </section>

      <footer className="border-t border-violet-100 py-8 px-6 text-center">
        <p className="text-sm text-gray-400">
          Built with ❤️ · <span className="text-violet-600 font-semibold">CareerPivot</span> — AI-Powered Career Intelligence
        </p>
      </footer>
    </div>
  )
}