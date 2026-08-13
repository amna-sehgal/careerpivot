import { Link, useNavigate, useLocation } from 'react-router-dom'
import { getUser, clearUser } from '../lib/auth'
import { Sparkles, LogOut, LayoutDashboard, Lightbulb, History, User } from 'lucide-react'

export default function Navbar() {
  const user = getUser()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const link = (to: string, label: string, Icon: any) => (
    <Link to={to} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
      pathname === to || pathname.startsWith(to + '/')
        ? 'bg-violet-100 text-violet-700'
        : 'text-gray-500 hover:text-violet-600 hover:bg-violet-50'
    }`}>
      <Icon size={15} />{label}
    </Link>
  )

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/60 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-glass">
            <Sparkles size={17} className="text-white" />
          </div>
          <span className="font-bold text-charcoal text-lg tracking-tight">
            Career<span className="text-violet-600">Pivot</span>
          </span>
        </Link>

        {user && (
          <div className="hidden md:flex items-center gap-1">
            {link('/dashboard',   'Dashboard',      LayoutDashboard)}
            {link('/results',     'Career Advice',  Lightbulb)}
            {link('/history',     'History',        History)}
            {link('/profile/edit','My Profile',     User)}
          </div>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden md:block text-sm font-medium text-gray-500">
                {user.firstName} {user.lastName}
              </span>
              <button onClick={() => { clearUser(); navigate('/') }}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors px-3 py-2 rounded-full hover:bg-red-50">
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"  className="text-sm font-semibold text-gray-600 hover:text-violet-600 px-4 py-2">Login</Link>
              <Link to="/signup" className="btn-primary text-sm py-2">Get Started Free</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
