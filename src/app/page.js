'use client'
import { useState } from 'react'

export default function Home() {
  const [countries, setCountries] = useState([])
  const [timeTaken, setTimeTaken] = useState('')
  const [source, setSource] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchCountries = async () => {
    setLoading(true)
    const res = await fetch('/api/countries')
    const data = await res.json()
    setCountries(data.countries || [])
    setTimeTaken(data.timeTaken)
    setSource(data.source)
    setLoading(false)
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🌍 Country Data Viewer</h1>
      <button
        onClick={fetchCountries}
        style={{
          padding: '0.5rem 1rem',
          background: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Loading...' : 'Get Countries'}
      </button>

      {countries.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <p>⏱️ Time Taken: {timeTaken}ms</p>
          <p>📦 Data Source: {source}</p>
          <ul>
            {countries.map((country, i) => (
              <li key={i}>{country.name.common}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
