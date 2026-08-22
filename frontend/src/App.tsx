import { useEffect, useState } from 'react'

function App() {
  const [status, setStatus] = useState<string>('checking...')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.status ?? 'unknown'))
      .catch(() => setStatus('error'))
  }, [])

  return (
    <main>
      <h1>Straddle</h1>
      <p>Backend health: {status}</p>
    </main>
  )
}

export default App
