"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Laptop, Tv, Mic, Projector } from "lucide-react"
import type { Equipment } from "@/types"
import { useRouter } from "next/navigation"

interface EquipmentGridProps {
  equipment: Equipment[]
  isLoading: boolean
}

export function EquipmentGrid({ equipment, isLoading }: EquipmentGridProps) {
  const router = useRouter()

  // Map equipment type to icon
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "notebook":
        return <Laptop className="h-8 w-8" />
      case "tv":
        return <Tv className="h-8 w-8" />
      case "microfone":
        return <Mic className="h-8 w-8" />
      case "projetor":
        return <Projector className="h-8 w-8" />
      default:
        return <Laptop className="h-8 w-8" />
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-24 bg-muted"></CardHeader>
            <CardContent className="p-4">
              <div className="h-4 w-3/4 bg-muted"></div>
              <div className="mt-2 h-4 w-1/2 bg-muted"></div>
            </CardContent>
            <CardFooter className="p-4">
              <div className="h-8 w-full bg-muted"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (equipment.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-semibold">Nenhum equipamento disponível</h3>
        <p className="text-muted-foreground">Não há equipamentos disponíveis para reserva no momento.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {equipment.map((item) => (
        <Card key={item.id}>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              {getIcon(item.type)}
            </div>
            <div>
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={item.available ? "default" : "secondary"}>
                  {item.available ? "Disponível" : "Indisponível"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">Localização: </span>
              <span className="text-xs font-medium">{item.location}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled={!item.available} onClick={() => router.push("/dashboard/reservar")}>
              Reservar
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

