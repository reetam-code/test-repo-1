import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="container">
      <h1>Hello, World!</h1>
      <p>
        {count === 0
          ? 'Click the button to test the JavaScript.'
          : 'JavaScript is working!'}
      </p>
      <button onClick={() => setCount((c) => c + 1)}>Click me</button>
      <p>Clicks: <span>{count}</span></p>
    </main>
  )
}
