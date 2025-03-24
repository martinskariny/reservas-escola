"use client"

import { Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "./auth-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useRouter, usePathname } from "next/navigation"

export function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger />
      <div className="flex-1">
        <h1 className="text-lg font-semibold md:text-xl">Sistema de Reserva de Equipamentos</h1>
      </div>
      <div className="flex items-center gap-2">
        {user?.role === "admin" && pathname !== "/dashboard/gerenciar" && (
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex"
            onClick={() => router.push("/dashboard/gerenciar")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Gerenciar
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notificações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <span>Sem notificações no momento</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:inline-block">{user?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {user?.role === "admin" && (
              <DropdownMenuItem onClick={() => router.push("/dashboard/gerenciar")}>Gerenciar Sistema</DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

