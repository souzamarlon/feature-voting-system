import { createFeature, getFeatures, upvoteFeature } from '../services/api'

describe('api service', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ([]),
    })
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockReset()
  })

  it('calls the feature list endpoint', async () => {
    await getFeatures()

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/api/features',
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )
  })

  it('posts a new feature to the create endpoint', async () => {
    await createFeature({
      title: 'Keyboard shortcuts',
      description: 'Add shortcuts for fast triage.',
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/api/features',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          title: 'Keyboard shortcuts',
          description: 'Add shortcuts for fast triage.',
        }),
      }),
    )
  })

  it('posts to the upvote endpoint for the selected feature', async () => {
    await upvoteFeature(42)

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/api/features/42/upvote',
      expect.objectContaining({
        method: 'POST',
      }),
    )
  })
})
