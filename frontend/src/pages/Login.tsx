import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { Sparkles, Eye, EyeOff } from 'lucide-react'
import api from '../lib/api'
import { setUser, getUser } from '../lib/auth'

export default function Login() {
  if (getUser()) return <Navigate to="/dashboard" replace />
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError('All fields required'); return }
    setLoading(true); setError('')
    try {
      const { data } = await api.post('/api/auth/login', form)
      setUser(data.user)
      navigate('/dashboard')
    } catch (e: any) {
      setError(e.response?.data?.message || 'Login failed. Check your credentials.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center shadow-glass group-hover:bg-violet-700 transition-colors">
              <Sparkles size={22} className="text-white"/>
            </div>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-charcoal">Welcome back</h1>
          <p className="text-gray-500 mt-2 text-sm">Your career pivot is waiting.</p>
        </div>

        <div className="glass-card rounded-3xl p-8 shadow-float">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Email address</label>
              <input type="email" className="input-field" placeholder="priya@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} className="input-field pr-12" placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
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
                ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Signing in...</>
                : 'Sign in to CareerPivot'}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-violet-600 font-semibold hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}