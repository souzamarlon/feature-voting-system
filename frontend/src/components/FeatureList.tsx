import AnimatedList from './AnimatedList'
import FeatureCard from './FeatureCard'
import type { Feature } from '../types/feature'

interface FeatureListProps {
  features: Feature[]
  activeVoteId: number | null
  isReordering: boolean
  highlightedId: number | null
  onUpvote: (id: number) => Promise<void>
  onReorderStart: () => void
  onReorderEnd: () => void
}

function FeatureList({
  features,
  activeVoteId,
  isReordering,
  highlightedId,
  onUpvote,
  onReorderStart,
  onReorderEnd,
}: FeatureListProps) {
  if (features.length === 0) {
    return (
      <section className="feature-list feature-list--empty">
        <h2>No feature requests yet</h2>
        <p>Be the first person to suggest one.</p>
      </section>
    )
  }

  return (
    <section className="feature-list">
      <div className="feature-list__header">
        <h2>Top voted features</h2>
        <p>Features are sorted automatically by vote count.</p>
      </div>

      <AnimatedList
        className="feature-list__items"
        onReorderStart={onReorderStart}
        onReorderEnd={onReorderEnd}
      >
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            isVoting={activeVoteId === feature.id}
            isReordering={isReordering}
            isHighlighted={highlightedId === feature.id}
            onUpvote={onUpvote}
            dataId={feature.id}
          />
        ))}
      </AnimatedList>
    </section>
  )
}

export default FeatureList
