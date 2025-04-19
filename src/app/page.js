'use client'

import { useState } from 'react'

export default function Home() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async () => {
    if (!query) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(`/api/country?name=${query}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Country Info Search</h1>
      <input
        type="text"
        placeholder="Enter country name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: '0.5rem', width: '300px', marginRight: '10px' }}
      />
      <button onClick={handleSearch} style={{ padding: '0.5rem 1rem' }}>
        Search
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <p><strong>Source:</strong> {result.source}</p>
          <p><strong>Time Taken:</strong> {result.timeTakenMs} ms</p>
          <h3>Result:</h3>
          <pre style={{ background: '#eee', padding: '1rem', borderRadius: '5px' }}>
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
    </main>
  )
}
