import type { Equipment } from "@/types"
import { v4 as uuidv4 } from "uuid"

// Mock database
const EQUIPMENT_KEY = "equipment"

// Initialize with default equipment if none exists
const initializeEquipment = () => {
  const storedEquipment = localStorage.getItem(EQUIPMENT_KEY)
  if (!storedEquipment) {
    const defaultEquipment: Equipment[] = [
      {
        id: uuidv4(),
        name: "Projetor Epson X41",
        type: "Projetor",
        description: "Projetor com 3600 lumens, resolução XGA e conectividade HDMI/VGA.",
        location: "Almoxarifado - Bloco A",
        available: true,
      },
      {
        id: uuidv4(),
        name: "Notebook Dell Inspiron",
        type: "Notebook",
        description: "Notebook com processador i5, 8GB RAM, 256GB SSD e Windows 10.",
        location: "Almoxarifado - Bloco A",
        available: true,
      },
      {
        id: uuidv4(),
        name: 'Smart TV Samsung 50"',
        type: "TV",
        description: "Smart TV 4K com conectividade Wi-Fi e Bluetooth.",
        location: "Almoxarifado - Bloco B",
        available: true,
      },
      {
        id: uuidv4(),
        name: "Microfone sem fio Shure",
        type: "Microfone",
        description: "Microfone sem fio com receptor e bateria recarregável.",
        location: "Almoxarifado - Bloco B",
        available: true,
      },
    ]
    localStorage.setItem(EQUIPMENT_KEY, JSON.stringify(defaultEquipment))
    return defaultEquipment
  }
  return JSON.parse(storedEquipment)
}

// Get all equipment
const getAll = async (): Promise<Equipment[]> => {
  const equipment = localStorage.getItem(EQUIPMENT_KEY)
  return equipment ? JSON.parse(equipment) : initializeEquipment()
}

// Get equipment by ID
const getById = async (id: string): Promise<Equipment | null> => {
  const equipment = await getAll()
  return equipment.find((item) => item.id === id) || null
}

// Create new equipment
const create = async (equipmentData: Omit<Equipment, "id">): Promise<Equipment> => {
  const equipment = await getAll()

  const newEquipment: Equipment = {
    ...equipmentData,
    id: uuidv4(),
  }

  equipment.push(newEquipment)
  localStorage.setItem(EQUIPMENT_KEY, JSON.stringify(equipment))

  return newEquipment
}

// Update equipment
const update = async (equipmentData: Equipment): Promise<Equipment> => {
  const equipment = await getAll()

  const updatedEquipment = equipment.map((item) => (item.id === equipmentData.id ? equipmentData : item))

  localStorage.setItem(EQUIPMENT_KEY, JSON.stringify(updatedEquipment))

  return equipmentData
}

// Delete equipment
const deleteEquipment = async (id: string): Promise<void> => {
  const equipment = await getAll()
  const updatedEquipment = equipment.filter((item) => item.id !== id)
  localStorage.setItem(EQUIPMENT_KEY, JSON.stringify(updatedEquipment))
}

// Update equipment availability
const updateAvailability = async (id: string, available: boolean): Promise<Equipment | null> => {
  const equipment = await getAll()
  const itemIndex = equipment.findIndex((item) => item.id === id)

  if (itemIndex === -1) {
    return null
  }

  equipment[itemIndex].available = available
  localStorage.setItem(EQUIPMENT_KEY, JSON.stringify(equipment))

  return equipment[itemIndex]
}

export const equipmentService = {
  getAll,
  getById,
  create,
  update,
  delete: deleteEquipment,
  updateAvailability,
}

