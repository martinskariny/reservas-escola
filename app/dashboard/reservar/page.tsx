"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ReservationForm } from "@/components/reservation-form"
import { equipmentService } from "@/services/equipment-service"
import { reservationService } from "@/services/reservation-service"
import type { Equipment, Reservation } from "@/types"
import { useAuth } from "@/components/auth-provider"

export default function ReservarPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        setIsLoading(true)
        const data = await equipmentService.getAll()
        // Filter only available equipment
        setEquipment(data.filter((item) => item.available))
      } catch (error) {
        toast({
          title: "Erro ao carregar equipamentos",
          description: "Não foi possível carregar a lista de equipamentos disponíveis.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadEquipment()
  }, [toast])

  const handleSubmit = async (data: Omit<Reservation, "id" | "status" | "userId">) => {
    if (!user) return

    try {
      setIsSubmitting(true)

      // Create the reservation
      await reservationService.create({
        ...data,
        userId: user.id,
        status: "active",
      })

      // Update equipment availability
      await equipmentService.updateAvailability(data.equipmentId, false)

      toast({
        title: "Reserva realizada com sucesso",
        description: "Sua reserva foi confirmada.",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Erro ao fazer reserva",
        description: "Não foi possível completar sua reserva. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reservar Equipamento</h1>
        <p className="text-muted-foreground">Preencha o formulário para reservar um equipamento.</p>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Formulário de Reserva</CardTitle>
          <CardDescription>Selecione o equipamento, data e horário para sua reserva.</CardDescription>
        </CardHeader>
        <CardContent>
          <ReservationForm
            equipment={equipment}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  )
}

