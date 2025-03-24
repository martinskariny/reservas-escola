import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Equipment, Reservation } from "@/types"

interface ReservationListProps {
  reservations: Reservation[]
  equipment: Equipment[]
  isLoading: boolean
}

export function ReservationList({ reservations, equipment, isLoading }: ReservationListProps) {
  // Helper to get equipment name by id
  const getEquipmentName = (id: string) => {
    const item = equipment.find((e) => e.id === id)
    return item ? item.name : "Equipamento não encontrado"
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-12 bg-muted"></CardHeader>
            <CardContent className="p-4">
              <div className="h-4 w-3/4 bg-muted"></div>
              <div className="mt-2 h-4 w-1/2 bg-muted"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (reservations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-semibold">Nenhuma reserva ativa</h3>
        <p className="text-muted-foreground">Você não possui reservas ativas no momento.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reservations.map((reservation) => (
        <Card key={reservation.id}>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold">{getEquipmentName(reservation.equipmentId)}</h3>
                <p className="text-sm text-muted-foreground">{reservation.purpose}</p>
              </div>
              <div className="flex flex-col gap-2 md:items-end">
                <Badge variant="outline">
                  {new Date(reservation.startDate).toLocaleDateString("pt-BR")} -{" "}
                  {new Date(reservation.endDate).toLocaleDateString("pt-BR")}
                </Badge>
                <Badge>
                  {reservation.status === "active"
                    ? "Ativo"
                    : reservation.status === "returned"
                      ? "Devolvido"
                      : "Cancelado"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

