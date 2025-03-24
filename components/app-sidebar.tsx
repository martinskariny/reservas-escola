"use client"

import { useRouter, usePathname } from "next/navigation"
import { Home, CalendarPlus, Settings, LogOut } from "lucide-react"
import { useAuth } from "./auth-provider"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"

export function AppSidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b pb-4">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.name}</span>
            <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard"} tooltip="Dashboard">
              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/dashboard")}>
                <Home className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/reservar"} tooltip="Reservar">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/reservar")}
              >
                <CalendarPlus className="mr-2 h-4 w-4" />
                <span>Reservar</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {user?.role === "admin" && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/dashboard/gerenciar"} tooltip="Gerenciar">
                <Button
                  variant={pathname === "/dashboard/gerenciar" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => router.push("/dashboard/gerenciar")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Gerenciar</span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t pt-4">
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

