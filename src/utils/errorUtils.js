/**
 * Helper function to extract a clean, human-readable error message from an API response,
 * error object, or response JSON payload.
 *
 * @param {any} error - The caught error object or API JSON response.
 * @param {string} defaultMsg - Fallback message if no detailed error string is found.
 * @return {string} Extracted error message.
 */
export const extractErrorMessage = (error, defaultMsg = 'An unexpected error occurred. Please try again.') => {
  if (!error) return defaultMsg

  // String error
  if (typeof error === 'string') {
    const trimmed = error.trim()
    return trimmed ? trimmed.replace(/[{}"]/g, '') : defaultMsg
  }

  // Object error
  if (typeof error === 'object') {
    // 1. FastAPI detail field (string or array of validation errors)
    if (typeof error.detail === 'string' && error.detail.trim()) {
      return error.detail.trim()
    }
    if (Array.isArray(error.detail) && error.detail.length > 0) {
      return error.detail
        .map((d) => (typeof d === 'string' ? d : d.msg || d.message || JSON.stringify(d)))
        .join(', ')
    }

    // 2. Generic message field
    if (typeof error.message === 'string' && error.message.trim() && !error.message.includes('[object Object]')) {
      return error.message.trim()
    }

    // 3. Generic error field
    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error.trim()
    }

    // 4. Generic errors array or string
    if (typeof error.errors === 'string' && error.errors.trim()) {
      return error.errors.trim()
    }
    if (Array.isArray(error.errors) && error.errors.length > 0) {
      return error.errors
        .map((e) => (typeof e === 'string' ? e : e.msg || e.message || JSON.stringify(e)))
        .join(', ')
    }
  }

  // Standard Error instance
  if (error instanceof Error && error.message) {
    return error.message
  }

  return defaultMsg
}

/**
 * Helper to safely extract error message from a fetch Response object.
 * Reads response JSON or text payload.
 *
 * @param {Response} response - Fetch API Response
 * @param {string} fallbackMsg - Fallback error message
 * @return {Promise<string>}
 */
export const getResponseErrorMessage = async (response, fallbackMsg = 'Server processing failed.') => {
  if (!response) return fallbackMsg

  try {
    const data = await response.json()
    const extracted = extractErrorMessage(data, null)
    if (extracted) return extracted
  } catch (e) {
    // Not JSON, try plain text
    try {
      const text = await response.text()
      if (text && text.trim() && !text.startsWith('<')) {
        return text.trim()
      }
    } catch (err) {
      /* ignore */
    }
  }

  if (response.statusText) {
    return `Server Error (${response.status} ${response.statusText})`
  }

  return `${fallbackMsg} (Status: ${response.status})`
}
