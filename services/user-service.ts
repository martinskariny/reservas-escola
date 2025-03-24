import type { User } from "@/types"
import { v4 as uuidv4 } from "uuid"

// Mock database
const USERS_KEY = "users"

// Initialize with default admin user if no users exist
const initializeUsers = () => {
  const storedUsers = localStorage.getItem(USERS_KEY)
  if (!storedUsers) {
    const defaultUsers: User[] = [
      {
        id: uuidv4(),
        name: "Administrador",
        email: "admin@escola.edu.br",
        password: "admin123",
        role: "admin",
      },
      {
        id: uuidv4(),
        name: "Professor",
        email: "professor@escola.edu.br",
        password: "professor123",
        role: "teacher",
      },
    ]
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers))
    return defaultUsers
  }
  return JSON.parse(storedUsers)
}

// Get all users
const getAll = async (): Promise<User[]> => {
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : initializeUsers()
}

// Get user by ID
const getById = async (id: string): Promise<User | null> => {
  const users = await getAll()
  return users.find((user) => user.id === id) || null
}

// Create a new user
const create = async (userData: Omit<User, "id">): Promise<User> => {
  const users = await getAll()

  // Check if email already exists
  const existingUser = users.find((user) => user.email === userData.email)
  if (existingUser) {
    throw new Error("Email já está em uso")
  }

  const newUser: User = {
    ...userData,
    id: uuidv4(),
  }

  users.push(newUser)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))

  return newUser
}

// Update a user
const update = async (userData: User): Promise<User> => {
  const users = await getAll()

  // Check if email already exists (except for the current user)
  const existingUser = users.find((user) => user.email === userData.email && user.id !== userData.id)
  if (existingUser) {
    throw new Error("Email já está em uso")
  }

  const updatedUsers = users.map((user) => (user.id === userData.id ? userData : user))

  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers))

  return userData
}

// Delete a user
const deleteUser = async (id: string): Promise<void> => {
  const users = await getAll()
  const updatedUsers = users.filter((user) => user.id !== id)
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers))
}

// Authenticate a user
const authenticate = async (email: string, password: string): Promise<User | null> => {
  const users = await getAll()
  return users.find((user) => user.email === email && user.password === password) || null
}

export const userService = {
  getAll,
  getById,
  create,
  update,
  delete: deleteUser,
  authenticate,
}

