import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, getAuthToken, setAuthToken } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    const token = getAuthToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const me = await api.getMe()
      setUser(me)
    } catch {
      setAuthToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const login = async (email, password) => {
    const { access_token } = await api.login({ email, password })
    setAuthToken(access_token)
    const me = await api.getMe()
    setUser(me)
    return me
  }

  const register = async (data) => {
    await api.register(data)
    return login(data.email, data.password)
  }

  const logout = () => {
    setAuthToken(null)
    setUser(null)
  }

  const updateProfile = async (data) => {
    const updated = await api.updateMe(data)
    setUser(updated)
    return updated
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isLoggedIn: !!user,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      updateProfile,
      refreshUser: loadUser,
    }),
    [user, loading, loadUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
