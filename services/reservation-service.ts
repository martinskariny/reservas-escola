import type { Reservation } from "@/types"
import { v4 as uuidv4 } from "uuid"

// Mock database
const RESERVATIONS_KEY = "reservations"

// Initialize with empty reservations if none exists
const initializeReservations = () => {
  const storedReservations = localStorage.getItem(RESERVATIONS_KEY)
  if (!storedReservations) {
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify([]))
    return []
  }
  return JSON.parse(storedReservations)
}

// Get all reservations
const getAll = async (): Promise<Reservation[]> => {
  const reservations = localStorage.getItem(RESERVATIONS_KEY)
  return reservations ? JSON.parse(reservations) : initializeReservations()
}

// Get reservation by ID
const getById = async (id: string): Promise<Reservation | null> => {
  const reservations = await getAll()
  return reservations.find((reservation) => reservation.id === id) || null
}

// Get reservations by user ID
const getByUserId = async (userId: string): Promise<Reservation[]> => {
  const reservations = await getAll()
  return reservations.filter((reservation) => reservation.userId === userId)
}

// Get reservations by equipment ID
const getByEquipmentId = async (equipmentId: string): Promise<Reservation[]> => {
  const reservations = await getAll()
  return reservations.filter((reservation) => reservation.equipmentId === equipmentId)
}

// Create a new reservation
const create = async (reservationData: Omit<Reservation, "id">): Promise<Reservation> => {
  const reservations = await getAll()

  const newReservation: Reservation = {
    ...reservationData,
    id: uuidv4(),
  }

  reservations.push(newReservation)
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations))

  return newReservation
}

// Update a reservation
const update = async (reservationData: Reservation): Promise<Reservation> => {
  const reservations = await getAll()

  const updatedReservations = reservations.map((reservation) =>
    reservation.id === reservationData.id ? reservationData : reservation,
  )

  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(updatedReservations))

  return reservationData
}

// Delete a reservation
const deleteReservation = async (id: string): Promise<void> => {
  const reservations = await getAll()
  const updatedReservations = reservations.filter((reservation) => reservation.id !== id)
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(updatedReservations))
}

// Update reservation status
const updateStatus = async (id: string, status: string): Promise<Reservation | null> => {
  const reservations = await getAll()
  const reservationIndex = reservations.findIndex((reservation) => reservation.id === id)

  if (reservationIndex === -1) {
    return null
  }

  reservations[reservationIndex].status = status as "active" | "returned" | "canceled"
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations))

  return reservations[reservationIndex]
}

export const reservationService = {
  getAll,
  getById,
  getByUserId,
  getByEquipmentId,
  create,
  update,
  delete: deleteReservation,
  updateStatus,
}

