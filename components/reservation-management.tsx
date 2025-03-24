"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import type { Equipment, Reservation, User } from "@/types"
import { MoreHorizontal, Search } from "lucide-react"

interface ReservationManagementProps {
  reservations: Reservation[]
  equipment: Equipment[]
  users: User[]
  isLoading: boolean
  onStatusChange: (id: string, status: string) => Promise<void>
}

export function ReservationManagement({
  reservations,
  equipment,
  users,
  isLoading,
  onStatusChange,
}: ReservationManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  // Helper to get equipment name by id
  const getEquipmentName = (id: string) => {
    const item = equipment.find((e) => e.id === id)
    return item ? item.name : "Equipamento não encontrado"
  }

  // Helper to get user name by id
  const getUserName = (id: string) => {
    const user = users.find((u) => u.id === id)
    return user ? user.name : "Usuário não encontrado"
  }

  // Filter reservations based on search term and status filter
  const filteredReservations = reservations.filter((reservation) => {
    const equipmentName = getEquipmentName(reservation.equipmentId).toLowerCase()
    const userName = getUserName(reservation.userId).toLowerCase()
    const purpose = reservation.purpose.toLowerCase()
    const searchMatch =
      equipmentName.includes(searchTerm.toLowerCase()) ||
      userName.includes(searchTerm.toLowerCase()) ||
      purpose.includes(searchTerm.toLowerCase())

    const statusMatch = statusFilter ? reservation.status === statusFilter : true

    return searchMatch && statusMatch
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full animate-pulse rounded bg-muted"></div>
        <div className="h-64 w-full animate-pulse rounded bg-muted"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar reservas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(null)}
          >
            Todos
          </Button>
          <Button
            variant={statusFilter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("active")}
          >
            Ativos
          </Button>
          <Button
            variant={statusFilter === "returned" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("returned")}
          >
            Devolvidos
          </Button>
          <Button
            variant={statusFilter === "canceled" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("canceled")}
          >
            Cancelados
          </Button>
        </div>
      </div>

      {filteredReservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-semibold">Nenhuma reserva encontrada</h3>
          <p className="text-muted-foreground">Não há reservas que correspondam aos critérios de busca.</p>
        </div>
      ) : (
        <div className="rounded-md border w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipamento</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Propósito</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-medium">{getEquipmentName(reservation.equipmentId)}</TableCell>
                  <TableCell>{getUserName(reservation.userId)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{reservation.purpose}</TableCell>
                  <TableCell>
                    {new Date(reservation.startDate).toLocaleDateString("pt-BR")} -{" "}
                    {new Date(reservation.endDate).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        reservation.status === "active"
                          ? "default"
                          : reservation.status === "returned"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {reservation.status === "active"
                        ? "Ativo"
                        : reservation.status === "returned"
                          ? "Devolvido"
                          : "Cancelado"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Ações</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {reservation.status === "active" && (
                          <>
                            <DropdownMenuItem onClick={() => onStatusChange(reservation.id, "returned")}>
                              Marcar como Devolvido
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onStatusChange(reservation.id, "canceled")}>
                              Cancelar Reserva
                            </DropdownMenuItem>
                          </>
                        )}
                        {reservation.status !== "active" && (
                          <DropdownMenuItem onClick={() => onStatusChange(reservation.id, "active")}>
                            Reativar Reserva
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

