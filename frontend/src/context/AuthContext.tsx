import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { getAuthToken, loginUser, setAuthToken } from '../services/api'
import type { User } from '../types/user'

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const defaultAuthContext: AuthContextValue = {
  user: null,
  token: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
}

const AuthContext = createContext<AuthContextValue>(defaultAuthContext)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(getAuthToken())

  async function login(username: string, password: string) {
    const response = await loginUser({ username, password })

    setToken(response.token)
    setUser(response.user)
    setAuthToken(response.token)
  }

  function logout() {
    setUser(null)
    setToken(null)
    setAuthToken(null)
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: user !== null && token !== null,
      login,
      logout,
    }),
    [token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
