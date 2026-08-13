import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getUser } from './lib/auth'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import EditProfile from './pages/EditProfile'
import Results from './pages/Results'
import History from './pages/History'

function Guard({ children }: { children: React.ReactNode }) {
  return getUser() ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Landing />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/signup"      element={<Signup />} />
        <Route path="/dashboard"   element={<Guard><Dashboard /></Guard>} />
        <Route path="/profile/edit" element={<Guard><EditProfile /></Guard>} />
        <Route path="/results"     element={<Guard><Results /></Guard>} />
        <Route path="/history"     element={<Guard><History /></Guard>} />
        {/* legacy /profile redirect */}
        <Route path="/profile"     element={<Guard><Dashboard /></Guard>} />
      </Routes>
    </BrowserRouter>
  )
}
