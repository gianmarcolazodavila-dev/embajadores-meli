import mysql from 'mysql2/promise'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}

const pool = mysql.createPool(process.env.DATABASE_URL)

export default pool
