import { useEffect, useRef, useState } from 'react'

import FeatureForm from '../components/FeatureForm'
import FeatureList from '../components/FeatureList'
import LoginBar from '../components/LoginBar'
import { useAuth } from '../context/AuthContext'
import {
  ApiError,
  createFeature,
  deleteFeature,
  getFeatures,
  upvoteFeature,
} from '../services/api'
import type { Feature } from '../types/feature'
import type { User } from '../types/user'

function sortFeatures(features: Feature[]) {
  return [...features].sort((left, right) => {
    if (right.votes !== left.votes) {
      return right.votes - left.votes
    }

    return right.created_at.localeCompare(left.created_at)
  })
}

function canDeleteFeature(feature: Feature, user: User | null) {
  if (!user) {
    return false
  }

  return user.role === 'admin' || feature.created_by_username === user.username
}

function HomePage() {
  const { user } = useAuth()
  const [features, setFeatures] = useState<Feature[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [activeVoteId, setActiveVoteId] = useState<number | null>(null)
  const [isReordering, setIsReordering] = useState(false)
  const [highlightedId, setHighlightedId] = useState<number | null>(null)
  const highlightTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    async function loadFeatures() {
      try {
        const response = await getFeatures()
        setFeatures(sortFeatures(response))
      } catch {
        setErrorMessage('Unable to load features right now.')
      } finally {
        setIsLoading(false)
      }
    }

    loadFeatures()
  }, [])

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current !== null) {
        window.clearTimeout(highlightTimeoutRef.current)
      }
    }
  }, [])

  async function handleCreateFeature(payload: {
    title: string
    description: string
  }) {
    if (!user) {
      setErrorMessage('Please log in to create a feature.')
      return
    }

    try {
      const createdFeature = await createFeature(payload)
      setFeatures((currentFeatures) =>
        sortFeatures([...currentFeatures, createdFeature]),
      )
      setErrorMessage('')
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setErrorMessage('Please log in to create a feature.')
      } else {
        setErrorMessage('Unable to create a feature right now.')
      }
    }
  }

  async function handleUpvote(id: number) {
    setActiveVoteId(id)

    try {
      const updatedFeature = await upvoteFeature(id)
      setFeatures((currentFeatures) =>
        sortFeatures(
          currentFeatures.map((feature) =>
            feature.id === updatedFeature.id ? updatedFeature : feature,
          ),
        ),
      )
      setHighlightedId(updatedFeature.id)

      if (highlightTimeoutRef.current !== null) {
        window.clearTimeout(highlightTimeoutRef.current)
      }

      highlightTimeoutRef.current = window.setTimeout(() => {
        setHighlightedId(null)
      }, 800)

      setErrorMessage('')
    } catch {
      setErrorMessage('Unable to register your vote right now.')
    } finally {
      setActiveVoteId(null)
    }
  }

  async function handleDelete(id: number) {
    if (!user) {
      setErrorMessage('Please log in to delete features.')
      return
    }

    try {
      await deleteFeature(id)
      setFeatures((currentFeatures) =>
        currentFeatures.filter((feature) => feature.id !== id),
      )
      setErrorMessage('')
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        setErrorMessage(
          'You can only delete your own features unless you are an admin.',
        )
      } else if (error instanceof ApiError && error.status === 401) {
        setErrorMessage('Please log in to delete features.')
      } else {
        setErrorMessage('Unable to delete the feature right now.')
      }
    }
  }

  return (
    <main className="page">
      <section className="page__hero">
        <p className="page__eyebrow">Feature Voting System</p>
        <h1>Collect feedback and surface the most wanted ideas.</h1>
        <p className="page__intro">
          A minimal React and Django app for submitting features and voting on
          priorities.
        </p>
      </section>

      <LoginBar />

      {errorMessage ? <p className="page__error">{errorMessage}</p> : null}

      <div className="page__grid">
        <FeatureForm onSubmit={handleCreateFeature} />
        {isLoading ? (
          <section className="feature-list feature-list--empty">
            <h2>Loading features...</h2>
          </section>
        ) : (
          <FeatureList
            features={features}
            activeVoteId={activeVoteId}
            isReordering={isReordering}
            highlightedId={highlightedId}
            onUpvote={handleUpvote}
            onDelete={handleDelete}
            canDeleteFeature={(feature) => canDeleteFeature(feature, user)}
            onReorderStart={() => setIsReordering(true)}
            onReorderEnd={() => setIsReordering(false)}
          />
        )}
      </div>
    </main>
  )
}

export default HomePage
