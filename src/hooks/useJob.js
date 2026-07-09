import { useState, useCallback, useRef } from 'react'

// Standardizes the run/progress/error/result lifecycle every operation shares.
// The worker/async function receives a `setProgress(0..1, message?)` callback.
export function useJob() {
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(null) // { value, message } | null
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const runId = useRef(0)

  const run = useCallback(async (fn) => {
    const id = ++runId.current
    setRunning(true)
    setError(null)
    setResult(null)
    setProgress({ value: null, message: 'Starting…' })
    const onProgress = (value, message) => {
      if (runId.current === id) setProgress({ value, message })
    }
    try {
      const out = await fn(onProgress)
      if (runId.current === id) setResult(out)
      return out
    } catch (err) {
      if (runId.current === id) {
        console.error(err)
        setError(err?.message || String(err) || 'Something went wrong.')
      }
      return null
    } finally {
      if (runId.current === id) {
        setRunning(false)
        setProgress(null)
      }
    }
  }, [])

  const reset = useCallback(() => {
    runId.current++
    setRunning(false)
    setProgress(null)
    setError(null)
    setResult(null)
  }, [])

  return { running, progress, error, result, run, reset, setError }
}
