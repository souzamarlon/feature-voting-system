import { useEffect, useRef, useState } from 'react'

import FeatureForm from '../components/FeatureForm'
import FeatureList from '../components/FeatureList'
import { createFeature, getFeatures, upvoteFeature } from '../services/api'
import type { Feature } from '../types/feature'

function sortFeatures(features: Feature[]) {
  return [...features].sort((left, right) => {
    if (right.votes !== left.votes) {
      return right.votes - left.votes
    }

    return right.created_at.localeCompare(left.created_at)
  })
}

function HomePage() {
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
    try {
      const createdFeature = await createFeature(payload)
      setFeatures((currentFeatures) =>
        sortFeatures([...currentFeatures, createdFeature]),
      )
      setErrorMessage('')
    } catch {
      setErrorMessage('Unable to create a feature right now.')
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
            onReorderStart={() => setIsReordering(true)}
            onReorderEnd={() => setIsReordering(false)}
          />
        )}
      </div>
    </main>
  )
}

export default HomePage
