"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { EquipmentGrid } from "@/components/equipment-grid"
import { ReservationList } from "@/components/reservation-list"
import { equipmentService } from "@/services/equipment-service"
import { reservationService } from "@/services/reservation-service"
import type { Equipment, Reservation } from "@/types"
import { Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const equipmentData = await equipmentService.getAll()
        setEquipment(equipmentData)

        const reservationData = await reservationService.getAll()
        // Filter reservations for regular users, show all for admins
        const filteredReservations =
          user?.role === "admin" ? reservationData : reservationData.filter((r) => r.userId === user?.id)

        setReservations(filteredReservations)
      } catch (error) {
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os equipamentos e reservas.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [toast, user])

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo ao sistema de reserva de equipamentos audiovisuais.</p>
        </div>
        {user?.role === "admin" && (
          <Button onClick={() => router.push("/dashboard/gerenciar")} className="sm:self-start">
            <Settings className="mr-2 h-4 w-4" />
            Gerenciar Sistema
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Equipamentos Disponíveis</CardTitle>
            <CardDescription>Total de equipamentos disponíveis para reserva.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-muted"></div>
              ) : (
                equipment.filter((e) => e.available).length
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Minhas Reservas</CardTitle>
            <CardDescription>Total de reservas ativas.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-muted"></div>
              ) : (
                reservations.filter((r) => r.status === "active").length
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Próxima Devolução</CardTitle>
            <CardDescription>Data da próxima devolução agendada.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {isLoading ? (
                <div className="h-8 w-32 animate-pulse rounded bg-muted"></div>
              ) : (
                (() => {
                  const activeReservations = reservations.filter((r) => r.status === "active")
                  if (activeReservations.length === 0) return "Nenhuma"

                  const nextReturn = activeReservations.reduce((earliest, current) => {
                    return new Date(current.endDate) < new Date(earliest.endDate) ? current : earliest
                  }, activeReservations[0])

                  return new Date(nextReturn.endDate).toLocaleDateString("pt-BR")
                })()
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="equipment" className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="equipment" className="flex-1 sm:flex-initial">
            Equipamentos
          </TabsTrigger>
          <TabsTrigger value="reservations" className="flex-1 sm:flex-initial">
            Reservas Ativas
          </TabsTrigger>
        </TabsList>
        <TabsContent value="equipment" className="mt-6">
          <EquipmentGrid equipment={equipment} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="reservations" className="mt-6">
          <ReservationList
            reservations={reservations.filter((r) => r.status === "active")}
            equipment={equipment}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

