import { BadRequestError } from "../errors/HTTPErrors.js";

export function validateUsername(username: string) {
  if (!username){ 
    throw new BadRequestError("Username is required", "username");
  }

  if (username.length < 3){
    throw new BadRequestError("Username must be at least 3 characters", "username");
  }

  if (username.length > 36){
    throw new BadRequestError("Username must be less than 36 characters", "username");
  }

  if (!/^[a-z][a-z0-9_]*$/.test(username)) {
    throw new BadRequestError("Only letters, numbers, and underscores are allowed", "username");
  }
}

export function validateEmail(email: string) {

  if(!email) {
    throw new BadRequestError("Email is required", "email");
  }
  
  if(email.length > 254) {
    throw new BadRequestError("Email must be less than 254 Characters", "email");
  }
  
  const regex: RegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if(!regex.test(email)) {
    throw new BadRequestError("Enter valid Email. Eg: you@domain.com", "email")
  }
}

export function validatePassword(password: string) {

  if(!password) {
    throw new BadRequestError("Password is required", "password");
  }

  if(password.length < 10) {
    throw new BadRequestError("Password must be atleast 10 characters", "password")
  }

  const regex: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

  if(!regex.test(password)) {
    throw new BadRequestError("Password must contain a least one small letter, capital letter, number and special character", "password")
  }
}