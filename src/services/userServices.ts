import bcrypt from "bcrypt"
import { insertUser } from "../repositories/userRepository.js"
import { CreateUserInput } from "../models/User.js"
import { DatabaseError } from "pg"
import { BadRequestError } from "../errors/HTTPErrors.js"

export async function createNewUser(username: string, email: string, password: string) {
  try{
    const salt = await bcrypt.genSalt()
    const password_hash = await bcrypt.hash(password, salt)

    const newUser: CreateUserInput = {
      username,
      email,
      password_hash
    }

    await insertUser(newUser)
  } catch(error) {

    if(error instanceof DatabaseError) {
      if(error.constraint === "unique_email") {
        throw new BadRequestError("Email Already Exists", "email")
      }

      if(error.constraint === "unique_username") {
        throw new BadRequestError("Username Already Exists", "username")
      }
    }

    throw error
  }
}

