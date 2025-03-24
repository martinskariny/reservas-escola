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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User } from "@/types"
import { MoreHorizontal, Plus, Search } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface UserManagementProps {
  users: User[]
  isLoading: boolean
  onUpdate: (user: User) => Promise<void>
  onCreate: (user: Omit<User, "id">) => Promise<boolean>
  onDelete: (id: string) => Promise<void>
}

const userSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  role: z.enum(["teacher", "admin"], {
    required_error: "Selecione um papel",
  }),
})

type UserFormValues = z.infer<typeof userSchema>

export function UserManagement({ users, isLoading, onUpdate, onCreate, onDelete }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "teacher",
    },
  })

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const name = user.name.toLowerCase()
    const email = user.email.toLowerCase()
    return name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase())
  })

  const handleCreateUser = () => {
    setIsCreating(true)
    setIsEditing(false)
    setSelectedUser(null)
    reset({
      name: "",
      email: "",
      password: "",
      role: "teacher",
    })
    setIsDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setIsEditing(true)
    setIsCreating(false)
    setSelectedUser(user)
    reset({
      name: user.name,
      email: user.email,
      password: "", // Don't show the password
      role: user.role,
    })
    setIsDialogOpen(true)
  }

  const handleFormSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true)

    try {
      if (isCreating) {
        const success = await onCreate(data)
        if (success) {
          setIsDialogOpen(false)
        }
      } else if (isEditing && selectedUser) {
        await onUpdate({
          ...selectedUser,
          name: data.name,
          email: data.email,
          // Only update password if provided
          ...(data.password ? { password: data.password } : {}),
          role: data.role,
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
            placeholder="Buscar usuários..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleCreateUser}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-semibold">Nenhum usuário encontrado</h3>
          <p className="text-muted-foreground">Não há usuários que correspondam aos critérios de busca.</p>
        </div>
      ) : (
        <div className="rounded-md border w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                      {user.role === "admin" ? "Administrador" : "Professor"}
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
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500" onClick={() => onDelete(user.id)}>
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
            <DialogTitle>{isCreating ? "Criar Novo Usuário" : "Editar Usuário"}</DialogTitle>
            <DialogDescription>
              {isCreating ? "Preencha os campos para criar um novo usuário." : "Edite as informações do usuário."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha {isEditing && "(deixe em branco para manter a atual)"}</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Papel</Label>
              <Select
                defaultValue={isEditing && selectedUser ? selectedUser.role : "teacher"}
                onValueChange={(value) => setValue("role", value as "teacher" | "admin")}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecione um papel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher">Professor</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
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

