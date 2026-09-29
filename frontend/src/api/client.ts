/*import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: 'application/json' },
})

let accessToken: string | null = null
export const setAccessToken = (token: string | null) => {
  accessToken = token
}

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

export const getApiMessage = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { detail?: string } | undefined
    if (data?.detail) return data.detail
    if (error.response?.status === 401) return 'Your session has expired. Please sign in again.'
    if (error.response?.status === 403) return "You don't have permission to do that."
  }
  return fallback
}
*/
import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? '/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
})

let accessToken: string | null = null

export const setAccessToken = (token: string | null) => {
  accessToken = token
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

export type ApiFieldErrors = Record<string, string[]>

export interface ParsedApiError {
  message: string
  fieldErrors: ApiFieldErrors
}

/**
 * Convert a backend error into something
 * the frontend can easily understand.
 */
export const parseApiError = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): ParsedApiError => {
  if (!axios.isAxiosError(error)) {
    return {
      message: fallback,
      fieldErrors: {},
    }
  }

  const data = error.response?.data

  /*
   * DRF field errors:
   *
   * {
   *   "username": [
   *     "user with this username already exists."
   *   ]
   * }
   */
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const fieldErrors: ApiFieldErrors = {}

    for (const [field, value] of Object.entries(data)) {
      if (field === 'detail') continue

      if (Array.isArray(value)) {
        fieldErrors[field] = value.filter(
          (message): message is string =>
            typeof message === 'string',
        )
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        message:
          'Please correct the highlighted fields and try again.',
        fieldErrors,
      }
    }

    if (
      'detail' in data &&
      typeof data.detail === 'string'
    ) {
      return {
        message: data.detail,
        fieldErrors: {},
      }
    }
  }

  /*
   * Network / server unreachable.
   */
  if (!error.response) {
    return {
      message:
        'We could not reach FUTMxStore. Please check your connection and try again.',
      fieldErrors: {},
    }
  }

  /*
   * Common HTTP errors.
   */
  switch (error.response.status) {
    case 401:
      return {
        message:
          'Your session has expired or your credentials are incorrect. Please sign in again.',
        fieldErrors: {},
      }

    case 403:
      return {
        message:
          "You don't have permission to perform this action.",
        fieldErrors: {},
      }

    case 404:
      return {
        message:
          'The requested resource could not be found.',
        fieldErrors: {},
      }

    case 429:
      return {
        message:
          'Too many requests. Please wait a moment and try again.',
        fieldErrors: {},
      }

    case 500:
    case 502:
    case 503:
    case 504:
      return {
        message:
          'Something went wrong on our side. Please try again in a moment.',
        fieldErrors: {},
      }

    default:
      return {
        message: fallback,
        fieldErrors: {},
      }
  }
}

export const getApiMessage = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
) => {
  return parseApiError(error, fallback).message
}