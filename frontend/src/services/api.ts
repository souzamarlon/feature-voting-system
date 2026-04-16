import type { Feature } from '../types/feature'
import type { User } from '../types/user'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
const API_ROOT = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`
const FEATURES_ENDPOINT = `${API_ROOT}/features`
const AUTH_ENDPOINT = `${API_ROOT}/auth`

let authToken: string | null = null

interface CreateFeaturePayload {
  title: string
  description: string
}

interface LoginPayload {
  username: string
  password: string
}

interface AuthResponse {
  token: string
  user: User
}

interface CurrentUserResponse {
  user: User
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function setAuthToken(token: string | null) {
  authToken = token
}

export function getAuthToken() {
  return authToken
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)

  headers.set('Content-Type', 'application/json')

  if (authToken) {
    headers.set('Authorization', `Token ${authToken}`)
  }

  const response = await fetch(url, {
    ...init,
    headers,
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`

    try {
      const errorResponse = (await response.json()) as { detail?: string }
      if (errorResponse.detail) {
        message = errorResponse.detail
      }
    } catch {
      // Ignore JSON parse errors for empty or non-JSON responses.
    }

    throw new ApiError(response.status, message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export function getFeatures(): Promise<Feature[]> {
  return request<Feature[]>(FEATURES_ENDPOINT)
}

export function createFeature(payload: CreateFeaturePayload): Promise<Feature> {
  return request<Feature>(FEATURES_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function upvoteFeature(id: number): Promise<Feature> {
  return request<Feature>(`${FEATURES_ENDPOINT}/${id}/upvote`, {
    method: 'POST',
  })
}

export function deleteFeature(id: number): Promise<void> {
  return request<void>(`${FEATURES_ENDPOINT}/${id}`, {
    method: 'DELETE',
  })
}

export function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  return request<AuthResponse>(`${AUTH_ENDPOINT}/login`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function fetchCurrentUser(): Promise<User> {
  const response = await request<CurrentUserResponse>(`${AUTH_ENDPOINT}/me`)
  return response.user
}
