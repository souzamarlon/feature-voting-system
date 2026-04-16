import {
  createFeature,
  deleteFeature,
  getFeatures,
  loginUser,
  setAuthToken,
  upvoteFeature,
} from '../services/api'

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
    setAuthToken(null)
    vi.unstubAllGlobals()
    fetchMock.mockReset()
  })

  it('calls the feature list endpoint', async () => {
    await getFeatures()

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/api/features',
      expect.objectContaining({
        headers: expect.any(Headers),
      }),
    )
    const headers = fetchMock.mock.calls[0][1]?.headers as Headers
    expect(headers.get('Content-Type')).toBe('application/json')
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

  it('deletes a feature with the delete endpoint', async () => {
    await deleteFeature(7)

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/api/features/7',
      expect.objectContaining({
        method: 'DELETE',
      }),
    )
  })

  it('posts credentials to the login endpoint', async () => {
    await loginUser({
      username: 'admin',
      password: 'admin123',
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/api/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          username: 'admin',
          password: 'admin123',
        }),
      }),
    )
  })
})
