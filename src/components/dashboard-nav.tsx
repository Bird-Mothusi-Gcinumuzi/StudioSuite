"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Wallet, 
  Package, 
  Scissors, 
  CalendarCheck, 
  Users, 
  TrendingUp,
  Settings,
  ScissorsLineDashed
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Financials",
    url: "/dashboard/finance",
    icon: Wallet,
  },
  {
    title: "Inventory",
    url: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Services",
    url: "/dashboard/services",
    icon: Scissors,
  },
  {
    title: "Bookings",
    url: "/dashboard/bookings",
    icon: CalendarCheck,
  },
  {
    title: "Staff",
    url: "/dashboard/staff",
    icon: Users,
  },
  {
    title: "Performance",
    url: "/dashboard/performance",
    icon: TrendingUp,
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <ScissorsLineDashed className="w-6 h-6 text-primary-foreground" />
          </div>
          {state === "expanded" && (
            <span className="text-xl font-bold tracking-tight font-headline">
              Studio<span className="text-primary">Suite</span>
            </span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                tooltip={item.title}
                className={cn(
                  "flex items-center gap-3 py-6",
                  pathname === item.url && "bg-sidebar-accent"
                )}
              >
                <Link href={item.url}>
                  <item.icon className={cn(
                    "w-5 h-5",
                    pathname === item.url ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <SidebarMenuButton className="py-6">
          <Settings className="w-5 h-5 text-muted-foreground" />
          <span>Settings</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}