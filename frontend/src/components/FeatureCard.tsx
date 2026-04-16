import type { Feature } from '../types/feature'

interface FeatureCardProps {
  feature: Feature
  isVoting: boolean
  onUpvote: (id: number) => Promise<void>
  dataId?: number
}

function FeatureCard({
  feature,
  isVoting,
  onUpvote,
  dataId,
}: FeatureCardProps) {
  return (
    <article className="feature-card" data-id={dataId}>
      <div className="feature-card__content">
        <div className="feature-card__meta">
          <span className="feature-card__badge">{feature.votes} votes</span>
        </div>
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
      </div>

      <button
        type="button"
        className="feature-card__button"
        onClick={() => onUpvote(feature.id)}
        disabled={isVoting}
      >
        {isVoting ? 'Voting...' : 'Upvote'}
      </button>
    </article>
  )
}

export default FeatureCard
