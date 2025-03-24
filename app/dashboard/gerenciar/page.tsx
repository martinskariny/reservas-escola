"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { ReservationManagement } from "@/components/reservation-management"
import { UserManagement } from "@/components/user-management"
import { EquipmentManagement } from "@/components/equipment-management"
import { equipmentService } from "@/services/equipment-service"
import { reservationService } from "@/services/reservation-service"
import { userService } from "@/services/user-service"
import type { Equipment, Reservation, User } from "@/types"
import { redirect } from "next/navigation"

export default function GerenciarPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      redirect("/dashboard")
    }
  }, [user])

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [equipmentData, reservationData, userData] = await Promise.all([
          equipmentService.getAll(),
          reservationService.getAll(),
          userService.getAll(),
        ])

        setEquipment(equipmentData)
        setReservations(reservationData)
        setUsers(userData)
      } catch (error) {
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados para gerenciamento.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [toast])

  const handleReservationStatusChange = async (id: string, status: string) => {
    try {
      await reservationService.updateStatus(id, status)

      // If returning equipment, update availability
      const reservation = reservations.find((r) => r.id === id)
      if (status === "returned" && reservation) {
        await equipmentService.updateAvailability(reservation.equipmentId, true)
      }

      // Update local state
      setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))

      toast({
        title: "Status atualizado",
        description: `Reserva marcada como ${status === "active" ? "ativa" : status === "returned" ? "devolvida" : "cancelada"}.`,
      })
    } catch (error) {
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da reserva.",
        variant: "destructive",
      })
    }
  }

  const handleUserUpdate = async (updatedUser: User) => {
    try {
      await userService.update(updatedUser)

      // Update local state
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)))

      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao atualizar usuário",
        description: "Não foi possível atualizar as informações do usuário.",
        variant: "destructive",
      })
    }
  }

  const handleUserCreate = async (newUser: Omit<User, "id">) => {
    try {
      const createdUser = await userService.create(newUser)

      // Update local state
      setUsers((prev) => [...prev, createdUser])

      toast({
        title: "Usuário criado",
        description: "O novo usuário foi criado com sucesso.",
      })

      return true
    } catch (error) {
      toast({
        title: "Erro ao criar usuário",
        description: "Não foi possível criar o novo usuário.",
        variant: "destructive",
      })
      return false
    }
  }

  const handleUserDelete = async (id: string) => {
    try {
      await userService.delete(id)

      // Update local state
      setUsers((prev) => prev.filter((u) => u.id !== id))

      toast({
        title: "Usuário removido",
        description: "O usuário foi removido com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao remover usuário",
        description: "Não foi possível remover o usuário.",
        variant: "destructive",
      })
    }
  }

  const handleEquipmentUpdate = async (updatedEquipment: Equipment) => {
    try {
      await equipmentService.update(updatedEquipment)

      // Update local state
      setEquipment((prev) => prev.map((e) => (e.id === updatedEquipment.id ? updatedEquipment : e)))

      toast({
        title: "Equipamento atualizado",
        description: "As informações do equipamento foram atualizadas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao atualizar equipamento",
        description: "Não foi possível atualizar as informações do equipamento.",
        variant: "destructive",
      })
    }
  }

  const handleEquipmentCreate = async (newEquipment: Omit<Equipment, "id">) => {
    try {
      const createdEquipment = await equipmentService.create(newEquipment)

      // Update local state
      setEquipment((prev) => [...prev, createdEquipment])

      toast({
        title: "Equipamento criado",
        description: "O novo equipamento foi criado com sucesso.",
      })

      return true
    } catch (error) {
      toast({
        title: "Erro ao criar equipamento",
        description: "Não foi possível criar o novo equipamento.",
        variant: "destructive",
      })
      return false
    }
  }

  const handleEquipmentDelete = async (id: string) => {
    try {
      await equipmentService.delete(id)

      // Update local state
      setEquipment((prev) => prev.filter((e) => e.id !== id))

      toast({
        title: "Equipamento removido",
        description: "O equipamento foi removido com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao remover equipamento",
        description: "Não foi possível remover o equipamento.",
        variant: "destructive",
      })
    }
  }

  if (user?.role !== "admin") {
    return null
  }

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento</h1>
        <p className="text-muted-foreground">Gerencie reservas, usuários e equipamentos do sistema.</p>
      </div>

      <Tabs defaultValue="reservations" className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="reservations" className="flex-1 sm:flex-initial">
            Reservas
          </TabsTrigger>
          <TabsTrigger value="users" className="flex-1 sm:flex-initial">
            Usuários
          </TabsTrigger>
          <TabsTrigger value="equipment" className="flex-1 sm:flex-initial">
            Equipamentos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="reservations" className="mt-6 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Gerenciar Reservas</CardTitle>
              <CardDescription>Visualize e gerencie todas as reservas do sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <ReservationManagement
                reservations={reservations}
                equipment={equipment}
                users={users}
                isLoading={isLoading}
                onStatusChange={handleReservationStatusChange}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="mt-6 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Gerenciar Usuários</CardTitle>
              <CardDescription>Adicione, edite ou remova usuários do sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagement
                users={users}
                isLoading={isLoading}
                onUpdate={handleUserUpdate}
                onCreate={handleUserCreate}
                onDelete={handleUserDelete}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="equipment" className="mt-6 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Gerenciar Equipamentos</CardTitle>
              <CardDescription>Adicione, edite ou remova equipamentos do sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <EquipmentManagement
                equipment={equipment}
                isLoading={isLoading}
                onUpdate={handleEquipmentUpdate}
                onCreate={handleEquipmentCreate}
                onDelete={handleEquipmentDelete}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

