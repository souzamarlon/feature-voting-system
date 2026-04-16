import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import HomePage from '../pages/HomePage'
import { getFeatures, upvoteFeature } from '../services/api'

vi.mock('../services/api', () => ({
  getFeatures: vi.fn(),
  createFeature: vi.fn(),
  upvoteFeature: vi.fn(),
  deleteFeature: vi.fn(),
}))

const mockedGetFeatures = vi.mocked(getFeatures)
const mockedUpvoteFeature = vi.mocked(upvoteFeature)

describe('HomePage', () => {
  beforeEach(() => {
    mockedGetFeatures.mockResolvedValue([
      {
        id: 1,
        title: 'Dark mode',
        description: 'Improve readability for night usage.',
        votes: 3,
        created_at: '2026-04-16T12:00:00Z',
        created_by_username: 'admin',
      },
      {
        id: 2,
        title: 'Search',
        description: 'Filter ideas faster.',
        votes: 1,
        created_at: '2026-04-16T11:00:00Z',
        created_by_username: 'user',
      },
    ])
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the feature list returned by the API', async () => {
    render(<HomePage />)

    expect(await screen.findByText('Dark mode')).toBeInTheDocument()
    expect(screen.getByText('Search')).toBeInTheDocument()
    expect(screen.getByText('3 votes')).toBeInTheDocument()
  })

  it('calls the upvote API when a user clicks the button', async () => {
    mockedUpvoteFeature.mockResolvedValue({
      id: 1,
      title: 'Dark mode',
      description: 'Improve readability for night usage.',
      votes: 4,
      created_at: '2026-04-16T12:00:00Z',
      created_by_username: 'admin',
    })

    render(<HomePage />)

    const user = userEvent.setup()
    const upvoteButton = await screen.findAllByRole('button', { name: 'Upvote' })

    await user.click(upvoteButton[0])

    expect(mockedUpvoteFeature).toHaveBeenCalledWith(1)
    await waitFor(() => {
      expect(screen.getByText('4 votes')).toBeInTheDocument()
    })
  })
})
