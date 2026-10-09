import express from 'express'
import { pool, ensureSchema } from './db.js'

const app = express()
app.use(express.json())

app.get('/api/tasks', async (_req, res) => {
  const [rows] = await pool.query('SELECT id, title, done FROM tasks ORDER BY id')
  res.json(rows.map((r) => ({ ...r, done: Boolean(r.done) })))
})

app.post('/api/tasks', async (req, res) => {
  const title = String(req.body?.title ?? '').trim()
  if (!title) return res.status(400).json({ error: 'title is required' })
  const [result] = await pool.query('INSERT INTO tasks (title) VALUES (?)', [title])
  res.status(201).json({ id: result.insertId, title, done: false })
})

app.patch('/api/tasks/:id', async (req, res) => {
  const [result] = await pool.query('UPDATE tasks SET done = NOT done WHERE id = ?', [req.params.id])
  if (!result.affectedRows) return res.status(404).json({ error: 'not found' })
  res.status(204).end()
})

// Express 5 forwards rejected async handlers here.
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'server error' })
})

const port = Number(process.env.PORT || 3001)
await ensureSchema()
app.listen(port, () => console.log(`API listening on http://localhost:${port}`))
