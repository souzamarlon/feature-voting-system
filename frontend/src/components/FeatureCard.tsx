import type { Feature } from '../types/feature'

interface FeatureCardProps {
  feature: Feature
  isVoting: boolean
  isReordering: boolean
  isHighlighted: boolean
  onUpvote: (id: number) => Promise<void>
  onDelete: (id: number) => Promise<void>
  canDelete: boolean
  dataId?: number
}

function FeatureCard({
  feature,
  isVoting,
  isReordering,
  isHighlighted,
  onUpvote,
  onDelete,
  canDelete,
  dataId,
}: FeatureCardProps) {
  const cardClassName = isHighlighted
    ? 'feature-card feature-card--highlighted'
    : 'feature-card'

  return (
    <article className={cardClassName} data-id={dataId}>
      <div className="feature-card__content">
        <div className="feature-card__meta">
          <span className="feature-card__badge">{feature.votes} votes</span>
          <span className="feature-card__owner">
            Created by {feature.created_by_username ?? 'unknown user'}
          </span>
          {isHighlighted ? (
            <span className="feature-card__status">Updated after your vote</span>
          ) : null}
        </div>
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
      </div>

      <div className="feature-card__actions">
        <button
          type="button"
          className="feature-card__button"
          onClick={() => onUpvote(feature.id)}
          disabled={isVoting || isReordering}
        >
          {isVoting ? 'Voting...' : isReordering ? 'Reordering...' : 'Upvote'}
        </button>

        {canDelete ? (
          <button
            type="button"
            className="feature-card__button feature-card__button--danger"
            onClick={() => onDelete(feature.id)}
            disabled={isReordering}
          >
            Delete
          </button>
        ) : null}
      </div>
    </article>
  )
}

export default FeatureCard
