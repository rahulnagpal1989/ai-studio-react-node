import { renderHook, act, waitFor } from '@testing-library/react'
import { useGenerate } from '../app/hooks/useGenerate'
import { useRetry } from '../app/hooks/useRetry'
import axios from 'axios'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('useGenerate Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('mock-token')
  })

  describe('generate function', () => {
    it('should successfully generate an image', async () => {
      const mockResponse = {
        data: {
          imageUrl: 'https://example.com/image.jpg',
          id: '123',
        },
      }
      mockedAxios.post.mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useGenerate())

      let generatedData: any
      await act(async () => {
        generatedData = await result.current.generate({
          prompt: 'test prompt',
          style: 'Classic',
          image: 'base64image',
        })
      })

      expect(generatedData).toEqual(mockResponse.data)
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/generations`,
        {
          prompt: 'test prompt',
          style: 'Classic',
          image: 'base64image',
        },
        {
          signal: expect.any(AbortSignal),
          headers: { Authorization: 'Bearer mock-token' },
        }
      )
    })

    it('should handle loading state correctly', async () => {
      const mockResponse = {
        data: { imageUrl: 'https://example.com/image.jpg' },
      }
      mockedAxios.post.mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useGenerate())

      expect(result.current.loading).toBe(false)

      let generatePromise: Promise<any>
      act(() => {
        generatePromise = result.current.generate({
          prompt: 'test',
          style: 'Classic',
          image: 'base64',
        })
      })

      expect(result.current.loading).toBe(true)

      await act(async () => {
        await generatePromise!
      })

      expect(result.current.loading).toBe(false)
    })

    it('should clear retry message on successful generation', async () => {
      const mockResponse = {
        data: { imageUrl: 'https://example.com/image.jpg' },
      }
      mockedAxios.post.mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useGenerate())

      await act(async () => {
        await result.current.generate({
          prompt: 'test',
          style: 'Classic',
          image: 'base64',
        })
      })

      expect(result.current.retryMessage).toBe('')
    })

    it('should handle API errors and clear retry message', async () => {
      const mockError = new Error('API Error')
      mockedAxios.post.mockRejectedValueOnce(mockError)

      const { result } = renderHook(() => useGenerate())

      await act(async () => {
        try {
          await result.current.generate({
            prompt: 'test',
            style: 'Classic',
            image: 'base64',
          })
        } catch (error) {
          // Expected to throw
        }
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.retryMessage).toBe('')
    })

    it('should handle abort signal correctly', async () => {
      const mockError = new Error('Request aborted')
      mockError.name = 'AbortError'
      mockedAxios.isCancel.mockReturnValue(true)
      mockedAxios.post.mockRejectedValueOnce(mockError)

      const { result } = renderHook(() => useGenerate())

      await act(async () => {
        try {
          await result.current.generate({
            prompt: 'test',
            style: 'Classic',
            image: 'base64',
          })
        } catch (error: any) {
          expect(error.message).toBe('aborted')
        }
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.retryMessage).toBe('')
    })
  })

  describe('abort function', () => {
    it('should abort the request and clear retry message', () => {
      const { result } = renderHook(() => useGenerate())

      act(() => {
        result.current.abort()
      })

      expect(result.current.retryMessage).toBe('')
    })
  })

  describe('retry message state', () => {
    it('should initialize with empty retry message', () => {
      const { result } = renderHook(() => useGenerate())
      expect(result.current.retryMessage).toBe('')
    })
  })
})

describe('useRetry Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should succeed on first attempt', async () => {
    const mockFn = jest.fn().mockResolvedValue('success')
    const onRetry = jest.fn()

    const result = await useRetry(mockFn, 3, 100, onRetry)

    expect(result).toBe('success')
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(onRetry).not.toHaveBeenCalled()
  })

  it('should retry on failure and eventually succeed', async () => {
    const mockFn = jest.fn()
      .mockRejectedValueOnce(new Error('First attempt failed'))
      .mockRejectedValueOnce(new Error('Second attempt failed'))
      .mockResolvedValueOnce('success')
    
    const onRetry = jest.fn()

    const result = await useRetry(mockFn, 3, 100, onRetry)

    expect(result).toBe('success')
    expect(mockFn).toHaveBeenCalledTimes(3)
    expect(onRetry).toHaveBeenCalledTimes(2)
    expect(onRetry).toHaveBeenNthCalledWith(1, 1, 3)
    expect(onRetry).toHaveBeenNthCalledWith(2, 2, 3)
  })

  it('should throw error after max retries exceeded', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('Always fails'))
    const onRetry = jest.fn()

    await expect(useRetry(mockFn, 2, 10, onRetry)).rejects.toThrow('Always fails')
    
    expect(mockFn).toHaveBeenCalledTimes(3) // Initial + 2 retries
    expect(onRetry).toHaveBeenCalledTimes(2)
    expect(onRetry).toHaveBeenNthCalledWith(1, 1, 2)
    expect(onRetry).toHaveBeenNthCalledWith(2, 2, 2)
  })

  it('should use exponential backoff delay', async () => {
    const mockFn = jest.fn()
      .mockRejectedValueOnce(new Error('First attempt failed'))
      .mockRejectedValueOnce(new Error('Second attempt failed'))
      .mockResolvedValueOnce('success')
    
    const onRetry = jest.fn()
    const startTime = Date.now()

    await useRetry(mockFn, 3, 100, onRetry)

    const endTime = Date.now()
    const totalTime = endTime - startTime

    // Should take at least 100ms + 200ms = 300ms (with some tolerance)
    expect(totalTime).toBeGreaterThanOrEqual(250)
    expect(totalTime).toBeLessThan(500) // Should not take too long
  })

  it('should work without onRetry callback', async () => {
    const mockFn = jest.fn()
      .mockRejectedValueOnce(new Error('First attempt failed'))
      .mockResolvedValueOnce('success')

    const result = await useRetry(mockFn, 2, 10)

    expect(result).toBe('success')
    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  it('should handle immediate success with onRetry callback', async () => {
    const mockFn = jest.fn().mockResolvedValue('immediate success')
    const onRetry = jest.fn()

    const result = await useRetry(mockFn, 3, 100, onRetry)

    expect(result).toBe('immediate success')
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(onRetry).not.toHaveBeenCalled()
  })
})
