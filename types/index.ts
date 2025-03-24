export interface User {
  id: string
  name: string
  email: string
  password: string
  role: "admin" | "teacher"
}

export interface Equipment {
  id: string
  name: string
  type: string
  description: string
  location: string
  available: boolean
}

export interface Reservation {
  id: string
  userId: string
  equipmentId: string
  startDate: string
  endDate: string
  purpose: string
  status: "active" | "returned" | "canceled"
}

