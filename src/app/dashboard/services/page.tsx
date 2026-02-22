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
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Scissors, 
  Sparkles,
  Zap,
  Eye,
  Clock,
  DollarSign
} from "lucide-react"
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking, setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase"
import { collection, doc, serverTimestamp } from "firebase/firestore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

export default function ServicesPage() {
  const db = useFirestore()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    durationMinutes: "60",
    category: "General"
  })

  const servicesQuery = useMemoFirebase(() => collection(db, "services"), [db])
  const { data: services, isLoading } = useCollection(servicesQuery)

  const syncToPublic = (service: any, isVisibleOverride?: boolean) => {
    const isVisible = isVisibleOverride !== undefined ? isVisibleOverride : service.isVisible
    const publicServiceRef = doc(db, "public_services", service.id)

    if (isVisible) {
      setDocumentNonBlocking(publicServiceRef, {
        id: service.id,
        name: service.name,
        description: service.description || "",
        basePrice: Number(service.basePrice) || 0,
        durationMinutes: Number(service.durationMinutes) || 60,
        category: service.category || "General",
        isFeatured: service.isFeatured || false,
        updatedAt: serverTimestamp()
      }, { merge: true })
    } else {
      deleteDocumentNonBlocking(publicServiceRef)
    }
  }

  const handleAddService = () => {
    if (!formData.name || !formData.basePrice) {
      toast({ variant: "destructive", title: "Missing fields", description: "Name and price are required." })
      return
    }

    const serviceId = `svc-${Date.now()}`
    const serviceData = {
      id: serviceId,
      ...formData,
      basePrice: Number(formData.basePrice),
      durationMinutes: Number(formData.durationMinutes),
      isVisible: false,
      isFeatured: false,
      createdAt: serverTimestamp()
    }

    setDocumentNonBlocking(doc(db, "services", serviceId), serviceData, { merge: true })
    setIsAddDialogOpen(false)
    resetForm()
    toast({ title: "Service Created", description: `${formData.name} has been added to your menu.` })
  }

  const handleEditService = () => {
    if (!editingService) return

    const updatedData = {
      ...formData,
      basePrice: Number(formData.basePrice),
      durationMinutes: Number(formData.durationMinutes),
      updatedAt: serverTimestamp()
    }

    updateDocumentNonBlocking(doc(db, "services", editingService.id), updatedData)

    // Update public record if visible
    if (editingService.isVisible) {
      syncToPublic({ ...editingService, ...updatedData })
    }

    setIsEditDialogOpen(false)
    setEditingService(null)
    resetForm()
    toast({ title: "Service Updated", description: "Changes saved successfully." })
  }

  const handleDeleteService = (service: any) => {
    if (confirm(`Are you sure you want to delete ${service.name}?`)) {
      deleteDocumentNonBlocking(doc(db, "services", service.id))
      deleteDocumentNonBlocking(doc(db, "public_services", service.id))
      toast({ title: "Service Deleted", description: "Service has been removed from your menu." })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      basePrice: "",
      durationMinutes: "60",
      category: "General"
    })
  }

  const startEdit = (service: any) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description || "",
      basePrice: String(service.basePrice || service.price || ""),
      durationMinutes: String(service.durationMinutes || 60),
      category: service.category || "General"
    })
    setIsEditDialogOpen(true)
  }

  const toggleVisibility = (service: any) => {
    const newVisibility = !service.isVisible
    const serviceRef = doc(db, "services", service.id)

    updateDocumentNonBlocking(serviceRef, { 
      isVisible: newVisibility,
      updatedAt: serverTimestamp()
    })

    syncToPublic(service, newVisibility)
  }

  const toggleFeatured = (service: any) => {
    const newFeatured = !service.isFeatured
    const serviceRef = doc(db, "services", service.id)
    
    updateDocumentNonBlocking(serviceRef, { 
      isFeatured: newFeatured,
      updatedAt: serverTimestamp()
    })

    if (service.isVisible) {
      syncToPublic({ ...service, isFeatured: newFeatured })
    }
  }

  const filteredServices = services?.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.category && s.category.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || []

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading services...</div>
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Service Menu</h2>
          <p className="text-muted-foreground">Manage your menu, visibility, and homepage highlights.</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Create Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Service</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Service Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Signature Haircut" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Base Price ($)</Label>
                  <Input id="price" type="number" value={formData.basePrice} onChange={(e) => setFormData({...formData, basePrice: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input id="duration" type="number" value={formData.durationMinutes} onChange={(e) => setFormData({...formData, durationMinutes: e.target.value})} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe the service..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddService}>Create Service</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Service Name</Label>
              <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Base Price ($)</Label>
                <Input id="edit-price" type="number" value={formData.basePrice} onChange={(e) => setFormData({...formData, basePrice: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-duration">Duration (min)</Label>
                <Input id="edit-duration" type="number" value={formData.durationMinutes} onChange={(e) => setFormData({...formData, durationMinutes: e.target.value})} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input id="edit-category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea id="edit-description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditService}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Total Services", value: services?.length || 0, icon: Scissors, color: "text-primary" },
          { title: "Featured Items", value: services?.filter(s => s.isFeatured).length || 0, icon: Sparkles, color: "text-secondary" },
          { title: "Publicly Visible", value: services?.filter(s => s.isVisible).length || 0, icon: Eye, color: "text-blue-400" },
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
                    {service.category || "General"}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-primary font-bold">
                  ${service.basePrice || service.price || 0}
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={service.isVisible} 
                    onCheckedChange={() => toggleVisibility(service)}
                  />
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={service.isFeatured} 
                    onCheckedChange={() => toggleFeatured(service)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(service)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteService(service)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredServices.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground italic">
                  No services found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
