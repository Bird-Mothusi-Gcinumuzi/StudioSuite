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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  MoreHorizontal
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const initialServices = [
  { id: 1, name: "Signature Balayage", category: "Color", duration: "180 min", price: 250, status: "Active" },
  { id: 2, name: "Precision Haircut", category: "Haircuts", duration: "60 min", price: 85, status: "Active" },
  { id: 3, name: "Full Glam Makeup", category: "Makeup", duration: "75 min", price: 120, status: "Active" },
  { id: 4, name: "Keratin Treatment", category: "Scalp", duration: "150 min", price: 300, status: "Active" },
  { id: 5, name: "Express Blowout", category: "Styling", duration: "45 min", price: 55, status: "Active" },
  { id: 6, name: "Root Touch-up", category: "Color", duration: "90 min", price: 95, status: "Active" },
  { id: 7, name: "Bridal Trial", category: "Makeup", duration: "120 min", price: 150, status: "Inactive" },
]

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredServices = initialServices.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Service Menu</h2>
          <p className="text-muted-foreground">Define your offerings, durations, and premium pricing tiers.</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Create Service
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Total Services", value: "24", icon: Scissors, color: "text-primary" },
          { title: "Avg. Price", value: "$132", icon: DollarSign, color: "text-secondary" },
          { title: "Active Promos", value: "3", icon: Sparkles, color: "text-blue-400" },
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
          <Input 
            placeholder="Filter by service name or category..." 
            className="pl-10 bg-background/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            All Categories
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            Active Only
          </Button>
        </div>
      </div>

      <Card className="border-border/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[300px]">Service Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((service) => (
              <TableRow key={service.id} className="group hover:bg-muted/20">
                <TableCell className="font-semibold text-foreground">
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
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {service.duration}
                  </div>
                </TableCell>
                <TableCell className="font-mono font-medium text-primary">
                  ${service.price}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={service.status === "Active" ? "default" : "secondary"}
                    className={service.status === "Active" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}
                  >
                    {service.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" /> Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Sparkles className="mr-2 h-4 w-4" /> Add Promo
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
