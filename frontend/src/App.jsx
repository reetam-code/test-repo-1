import { useEffect, useState } from 'react'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  async function load() {
    try {
      const res = await fetch('/api/tasks')
      if (!res.ok) throw new Error()
      setTasks(await res.json())
      setError('')
    } catch {
      setError('Could not reach the API.')
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function add(e) {
    e.preventDefault()
    if (!title.trim()) return
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    setTitle('')
    load()
  }

  async function toggle(id) {
    await fetch(`/api/tasks/${id}`, { method: 'PATCH' })
    load()
  }

  return (
    <main className="container">
      <h1>Tasks</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={add} className="add">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task"
        />
        <button>Add</button>
      </form>
      <ul className="tasks">
        {tasks.map((t) => (
          <li key={t.id} className={t.done ? 'done' : ''}>
            <label>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
              {t.title}
            </label>
          </li>
        ))}
      </ul>
    </main>
  )
}
