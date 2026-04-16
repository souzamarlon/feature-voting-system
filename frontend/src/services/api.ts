import type { Feature } from '../types/feature'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
const API_ROOT = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`
const FEATURES_ENDPOINT = `${API_ROOT}/features`

interface CreateFeaturePayload {
  title: string
  description: string
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
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
