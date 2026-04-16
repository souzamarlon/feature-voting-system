import { useState } from 'react'
import type { FormEvent } from 'react'

import { ApiError } from '../services/api'
import { useAuth } from '../context/AuthContext'

function LoginBar() {
  const { user, isAuthenticated, login, logout } = useAuth()
  const [username, setUsername] = useState('user')
  const [password, setPassword] = useState('user123')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await login(username, password)
      setErrorMessage('')
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Unable to log in right now.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthenticated && user) {
    return (
      <section className="auth-bar">
        <div className="auth-bar__info">
          <strong>Logged in as {user.username}</strong>
          <span>{user.role === 'admin' ? 'Admin access' : 'Regular user'}</span>
        </div>
        <button
          type="button"
          className="feature-card__button auth-bar__button"
          onClick={logout}
        >
          Log out
        </button>
      </section>
    )
  }

  return (
    <section className="auth-bar auth-bar--login">
      <div className="auth-bar__info">
        <strong>Log in to create and delete features</strong>
        <span>Demo users: admin/admin123 or user/user123.</span>
      </div>

      <form className="auth-bar__form" onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username"
        />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          type="password"
        />
        <button
          type="submit"
          className="feature-card__button auth-bar__button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      {errorMessage ? <p className="auth-bar__error">{errorMessage}</p> : null}
    </section>
  )
}

export default LoginBar
