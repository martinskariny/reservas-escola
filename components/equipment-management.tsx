"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Equipment } from "@/types"
import { MoreHorizontal, Plus, Search } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface EquipmentManagementProps {
  equipment: Equipment[]
  isLoading: boolean
  onUpdate: (equipment: Equipment) => Promise<void>
  onCreate: (equipment: Omit<Equipment, "id">) => Promise<boolean>
  onDelete: (id: string) => Promise<void>
}

const equipmentSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  type: z.string().min(1, { message: "Tipo é obrigatório" }),
  description: z.string().min(5, { message: "Descrição deve ter pelo menos 5 caracteres" }),
  location: z.string().min(1, { message: "Localização é obrigatória" }),
  available: z.boolean().default(true),
})

type EquipmentFormValues = z.infer<typeof equipmentSchema>

export function EquipmentManagement({ equipment, isLoading, onUpdate, onCreate, onDelete }: EquipmentManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
      location: "",
      available: true,
    },
  })

  // Filter equipment based on search term
  const filteredEquipment = equipment.filter((item) => {
    const name = item.name.toLowerCase()
    const type = item.type.toLowerCase()
    const location = item.location.toLowerCase()
    return (
      name.includes(searchTerm.toLowerCase()) ||
      type.includes(searchTerm.toLowerCase()) ||
      location.includes(searchTerm.toLowerCase())
    )
  })

  const handleCreateEquipment = () => {
    setIsCreating(true)
    setIsEditing(false)
    setSelectedEquipment(null)
    reset({
      name: "",
      type: "",
      description: "",
      location: "",
      available: true,
    })
    setIsDialogOpen(true)
  }

  const handleEditEquipment = (item: Equipment) => {
    setIsEditing(true)
    setIsCreating(false)
    setSelectedEquipment(item)
    reset({
      name: item.name,
      type: item.type,
      description: item.description,
      location: item.location,
      available: item.available,
    })
    setIsDialogOpen(true)
  }

  const handleFormSubmit = async (data: EquipmentFormValues) => {
    setIsSubmitting(true)

    try {
      if (isCreating) {
        const success = await onCreate(data)
        if (success) {
          setIsDialogOpen(false)
        }
      } else if (isEditing && selectedEquipment) {
        await onUpdate({
          ...selectedEquipment,
          ...data,
        })
        setIsDialogOpen(false)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar equipamentos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleCreateEquipment}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Equipamento
        </Button>
      </div>

      {filteredEquipment.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-semibold">Nenhum equipamento encontrado</h3>
          <p className="text-muted-foreground">Não há equipamentos que correspondam aos critérios de busca.</p>
        </div>
      ) : (
        <div className="rounded-md border w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>
                    <Badge variant={item.available ? "default" : "secondary"}>
                      {item.available ? "Disponível" : "Indisponível"}
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
                        <DropdownMenuItem onClick={() => handleEditEquipment(item)}>Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500" onClick={() => onDelete(item.id)}>
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isCreating ? "Criar Novo Equipamento" : "Editar Equipamento"}</DialogTitle>
            <DialogDescription>
              {isCreating
                ? "Preencha os campos para criar um novo equipamento."
                : "Edite as informações do equipamento."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                defaultValue={isEditing && selectedEquipment ? selectedEquipment.type : ""}
                onValueChange={(value) => setValue("type", value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Projetor">Projetor</SelectItem>
                  <SelectItem value="TV">TV</SelectItem>
                  <SelectItem value="Notebook">Notebook</SelectItem>
                  <SelectItem value="Microfone">Microfone</SelectItem>
                  <SelectItem value="Caixa de Som">Caixa de Som</SelectItem>
                  <SelectItem value="Câmera">Câmera</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" {...register("description")} />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input id="location" {...register("location")} />
              {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="available"
                className="h-4 w-4 rounded border-gray-300"
                {...register("available")}
              />
              <Label htmlFor="available">Disponível para reserva</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : isCreating ? "Criar" : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

