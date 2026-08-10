import { Router, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import pool from '../db/connection'

const router = Router()

router.post('/magic-link', async (req: Request, res: Response) => {
  const { email } = req.body

  if (!email) {
    res.status(400).json({ message: 'Email requerido' })
    return
  }

  const [rows] = await pool.execute(
    "SELECT id FROM ambassadors WHERE email = ? AND estado = 'activo'",
    [email]
  )

  if ((rows as unknown[]).length === 0) {
    res.status(404).json({ message: 'Email no registrado en el programa' })
    return
  }

  const token = uuidv4()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

  await pool.execute(
    'INSERT INTO auth_tokens (email, token, expires_at) VALUES (?, ?, ?)',
    [email, token, expiresAt]
  )

  console.log(`Magic link: http://localhost:5173/auth/verify?token=${token}`)

  res.json({ message: 'Revisá tu email, te mandamos un link de acceso' })
})

router.get('/verify', async (req: Request, res: Response) => {
  const { token } = req.query

  if (!token || typeof token !== 'string') {
    res.status(400).json({ message: 'Token requerido' })
    return
  }

  const [rows] = await pool.execute(
    'SELECT * FROM auth_tokens WHERE token = ?',
    [token]
  )

  const record = (rows as Record<string, unknown>[])[0]

  if (!record || record.used || new Date(record.expires_at as string) <= new Date()) {
    res.status(401).json({ message: 'Link inválido o vencido' })
    return
  }

  await pool.execute('UPDATE auth_tokens SET used = true WHERE token = ?', [token])

  const [ambassadorRows] = await pool.execute(
    'SELECT id, email, nombre FROM ambassadors WHERE email = ?',
    [record.email as string]
  )

  const ambassador = (ambassadorRows as Record<string, unknown>[])[0]

  const jwtSecret = process.env.JWT_SECRET!
  const jwtToken = jwt.sign(
    { ambassadorId: ambassador.id, email: ambassador.email, role: 'ambassador' },
    jwtSecret,
    { expiresIn: '30d' }
  )

  res.json({ token: jwtToken, role: 'ambassador', nombre: ambassador.nombre })
})

export default router
