import type { User } from './types'

export const getUser = (): User | null => {
  try { return JSON.parse(localStorage.getItem('cp_user') || 'null') } catch { return null }
}
export const setUser = (u: User) => localStorage.setItem('cp_user', JSON.stringify(u))
export const clearUser = () => { localStorage.removeItem('cp_user'); localStorage.removeItem('cp_profile') }
export const getProfile = (): any => {
  try { return JSON.parse(localStorage.getItem('cp_profile') || 'null') } catch { return null }
}
export const setProfile = (p: any) => localStorage.setItem('cp_profile', JSON.stringify(p))
