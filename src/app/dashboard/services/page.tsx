
"use client"

import { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  DollarSign, 
  Scissors, 
  Sparkles,
  Zap,
  MoreHorizontal,
  Eye
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { initialServices as data } from "@/lib/data"

export default function ServicesPage() {
  const [services, setServices] = useState(data)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleVisibility = (id: number) => {
    setServices(services.map(s => s.id === id ? { ...s, isVisible: !s.isVisible } : s))
  }

  const toggleFeatured = (id: number) => {
    setServices(services.map(s => s.id === id ? { ...s, isFeatured: !s.isFeatured } : s))
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Service Menu</h2>
          <p className="text-muted-foreground">Manage your menu, visibility, and homepage highlights.</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Create Service
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Total Services", value: services.length, icon: Scissors, color: "text-primary" },
          { title: "Featured Items", value: services.filter(s => s.isFeatured).length, icon: Sparkles, color: "text-secondary" },
          { title: "Publicly Visible", value: services.filter(s => s.isVisible).length, icon: Eye, color: "text-blue-400" },
        ].map((stat) => (
          <Card key={stat.title} className="bg-card/30 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-4 bg-card/50 p-4 rounded-xl border border-border/50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            placeholder="Filter by service name or category..." 
            className="w-full bg-background/50 border-none rounded-md px-10 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-border/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[250px]">Service Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Public View</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((service) => (
              <TableRow key={service.id} className="group hover:bg-muted/20">
                <TableCell className="font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    {service.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal border-border/50 bg-background/50">
                    {service.category}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-primary font-bold">
                  ${service.price}
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={service.isVisible} 
                    onCheckedChange={() => toggleVisibility(service.id)}
                  />
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={service.isFeatured} 
                    onCheckedChange={() => toggleFeatured(service.id)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
