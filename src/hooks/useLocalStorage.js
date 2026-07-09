import { useState, useEffect, useCallback } from 'react'

// Persist ONLY non-sensitive UI state (theme, last tool). User file content is
// NEVER written to storage.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw != null ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage may be unavailable (private mode) — non-fatal
    }
  }, [key, value])

  const reset = useCallback(() => setValue(initialValue), [initialValue])
  return [value, setValue, reset]
}
