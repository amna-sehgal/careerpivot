import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Eye, EyeOff, CheckCircle } from 'lucide-react'
import api from '../lib/api'
import { setUser } from '../lib/auth'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.firstName || !form.email || !form.password) { setError('Please fill all required fields'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true); setError('')
    try {
      const { data } = await api.post('/api/auth/signup', form)
      setUser(data.user)
      navigate('/profile/edit')
    } catch (e: any) {
      setError(e.response?.data?.message || 'Signup failed. Try again.')
    } finally { setLoading(false) }
  }

  const f = (field: string) => (e: any) => setForm({ ...form, [field]: e.target.value })

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center shadow-glass group-hover:bg-violet-700 transition-colors">
              <Sparkles size={22} className="text-white"/>
            </div>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-charcoal">Start your pivot</h1>
          <p className="text-gray-500 mt-2 text-sm">Free forever. Your first analysis in 60 seconds.</p>
        </div>

        <div className="glass-card rounded-3xl p-8 shadow-float">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">First name <span className="text-red-400">*</span></label>
                <input className="input-field" placeholder="Priya" value={form.firstName} onChange={f('firstName')}/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Last name</label>
                <input className="input-field" placeholder="Sharma" value={form.lastName} onChange={f('lastName')}/>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Email address <span className="text-red-400">*</span></label>
              <input type="email" className="input-field" placeholder="priya@example.com" value={form.email} onChange={f('email')}/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Password <span className="text-red-400">*</span></label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} className="input-field pr-12" placeholder="Min. 6 characters"
                  value={form.password} onChange={f('password')}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}/>
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-500 transition-colors">
                  {show ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-600 font-medium">
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading}
              className="btn-primary w-full justify-center mt-2">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Creating account...</>
                : 'Create free account'}
            </button>
          </div>

          {/* What happens next */}
          <div className="mt-6 pt-5 border-t border-violet-50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">After signup, you'll:</p>
            <div className="space-y-2">
              {['Build your profile (3 min)', 'Get AI career gap analysis', 'See your readiness % for 3 roles'].map(s => (
                <div key={s} className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle size={13} className="text-emerald-500 flex-shrink-0"/> {s}
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
