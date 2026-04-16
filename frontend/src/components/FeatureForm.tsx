import { useState } from 'react'
import type { FormEvent } from 'react'

interface FeatureFormProps {
  onSubmit: (payload: { title: string; description: string }) => Promise<void>
}

function FeatureForm({ onSubmit }: FeatureFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title.trim() || !description.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
      })
      setTitle('')
      setDescription('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="feature-form" onSubmit={handleSubmit}>
      <div className="feature-form__header">
        <h2>Submit a feature idea</h2>
        <p>Capture requests quickly and let the team vote on what matters most.</p>
      </div>

      <label className="feature-form__field">
        <span>Title</span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Dark mode for the dashboard"
          maxLength={200}
        />
      </label>

      <label className="feature-form__field">
        <span>Description</span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe why this feature would help users."
          rows={4}
        />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Add feature'}
      </button>
    </form>
  )
}

export default FeatureForm
