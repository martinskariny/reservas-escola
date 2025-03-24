"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Equipment, Reservation } from "@/types"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Get tomorrow's date
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)

// Get date 30 days from now
const thirtyDaysFromNow = new Date()
thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

const reservationSchema = z
  .object({
    equipmentId: z.string({
      required_error: "Selecione um equipamento",
    }),
    startDate: z.date({
      required_error: "Selecione a data de início",
    }),
    endDate: z.date({
      required_error: "Selecione a data de devolução",
    }),
    purpose: z.string().min(5, {
      message: "O propósito deve ter pelo menos 5 caracteres",
    }),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "A data de devolução deve ser igual ou posterior à data de início",
    path: ["endDate"],
  })

type ReservationFormValues = z.infer<typeof reservationSchema>

interface ReservationFormProps {
  equipment: Equipment[]
  isLoading: boolean
  isSubmitting: boolean
  onSubmit: (data: Omit<Reservation, "id" | "status" | "userId">) => Promise<void>
}

export function ReservationForm({ equipment, isLoading, isSubmitting, onSubmit }: ReservationFormProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(tomorrow)
  const [endDate, setEndDate] = useState<Date | undefined>(tomorrow)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      equipmentId: "",
      startDate: tomorrow,
      endDate: tomorrow,
      purpose: "",
    },
  })

  // Watch the form values
  const watchStartDate = watch("startDate")
  const watchEndDate = watch("endDate")

  const handleFormSubmit = (data: ReservationFormValues) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="equipment">Equipamento</Label>
        <Select disabled={isLoading || isSubmitting} onValueChange={(value) => setValue("equipmentId", value)}>
          <SelectTrigger id="equipment">
            <SelectValue placeholder="Selecione um equipamento" />
          </SelectTrigger>
          <SelectContent>
            {equipment.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name} - {item.location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.equipmentId && <p className="text-sm text-red-500">{errors.equipmentId.message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">Data de Retirada</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="startDate"
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                disabled={isLoading || isSubmitting}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP", { locale: ptBR }) : <span>Selecione a data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date)
                  setValue("startDate", date as Date)

                  // If end date is before start date, update it
                  if (endDate && date && endDate < date) {
                    setEndDate(date)
                    setValue("endDate", date)
                  }
                }}
                disabled={(date) => date < tomorrow || date > thirtyDaysFromNow}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Data de Devolução</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="endDate"
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                disabled={isLoading || isSubmitting}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP", { locale: ptBR }) : <span>Selecione a data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  setEndDate(date)
                  setValue("endDate", date as Date)
                }}
                disabled={(date) => (startDate && date < startDate) || date < tomorrow || date > thirtyDaysFromNow}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="purpose">Propósito da Reserva</Label>
        <Textarea
          id="purpose"
          placeholder="Descreva o propósito da reserva"
          className="min-h-[100px]"
          disabled={isLoading || isSubmitting}
          {...register("purpose")}
        />
        {errors.purpose && <p className="text-sm text-red-500">{errors.purpose.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || isSubmitting}>
        {isSubmitting ? "Reservando..." : "Reservar Equipamento"}
      </Button>
    </form>
  )
}

