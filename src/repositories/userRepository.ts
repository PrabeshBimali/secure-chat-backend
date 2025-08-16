import db from "../config/db.js"
import { CreateUserInput } from "../models/User.js";

export async function insertUser(newUser: CreateUserInput) {
  const query = `INSERT INTO users(username, email, password_hash) VALUES($1, $2, $3)`
  await db.query(query, [newUser.username, newUser.email, newUser.password_hash])
}

