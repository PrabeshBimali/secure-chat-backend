import { Pool } from 'pg';
import dotenv from "dotenv"

if(process.env.NODE_ENV === "development") {
  const dotenvResult = dotenv.config()

  if(dotenvResult.error) {
    console.error(dotenvResult.error)
    process.exit(-1)
  }
}

const connectionString = process.env.DATABASE_URL

const pool: Pool = new Pool({
  connectionString
})

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1); // Exit the process if a critical error occurs
});

export default pool