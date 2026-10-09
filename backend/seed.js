import { pool, ensureSchema } from './db.js'

await ensureSchema()
await pool.query('TRUNCATE TABLE tasks')
await pool.query('INSERT INTO tasks (title, done) VALUES ?', [[
  ['Set up Vite + React', 1],
  ['Add Express API', 1],
  ['Connect MySQL', 0],
  ['Ship it', 0],
]])
console.log('Seeded 4 tasks')
await pool.end()
