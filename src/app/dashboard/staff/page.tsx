"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { 
  Users, 
  Star, 
  Calendar, 
  Mail, 
  Phone, 
  Settings2, 
  ChevronRight,
  TrendingUp,
  Plus,
  Trash2
} from "lucide-react"
import Image from "next/image"
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking, setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase"
import { collection, doc, serverTimestamp } from "firebase/firestore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

export default function StaffPage() {
  const db = useFirestore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<any>(null)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "",
    bio: "",
    email: "",
    phone: "",
    performanceScore: "85"
  })

  const staffQuery = useMemoFirebase(() => collection(db, "staffMembers"), [db])
  const { data: staff, isLoading } = useCollection(staffQuery)

  const syncToPublic = (member: any, isActiveOverride?: boolean) => {
    const isActive = isActiveOverride !== undefined ? isActiveOverride : member.isActive
    const publicProfileRef = doc(db, "public_staff_profiles", member.id)

    if (isActive) {
      setDocumentNonBlocking(publicProfileRef, {
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        role: member.role,
        bio: member.bio || "",
        profileImageUrl: member.profileImageUrl || `https://picsum.photos/seed/${member.id}/400/400`,
        performanceScore: Number(member.performanceScore) || 0,
        updatedAt: serverTimestamp()
      }, { merge: true })
    } else {
      deleteDocumentNonBlocking(publicProfileRef)
    }
  }

  const handleAddMember = () => {
    if (!formData.firstName || !formData.lastName || !formData.role) {
      toast({ variant: "destructive", title: "Missing fields", description: "Name and role are required." })
      return
    }

    const memberId = `staff-${Date.now()}`
    const memberData = {
      id: memberId,
      ...formData,
      performanceScore: Number(formData.performanceScore),
      isActive: false,
      createdAt: serverTimestamp()
    }

    setDocumentNonBlocking(doc(db, "staffMembers", memberId), memberData, { merge: true })
    setIsAddDialogOpen(false)
    resetForm()
    toast({ title: "Staff Member Added", description: `${formData.firstName} has joined the team.` })
  }

  const handleEditMember = () => {
    if (!editingMember) return

    const updatedData = {
      ...formData,
      performanceScore: Number(formData.performanceScore),
      updatedAt: serverTimestamp()
    }

    updateDocumentNonBlocking(doc(db, "staffMembers", editingMember.id), updatedData)

    if (editingMember.isActive) {
      syncToPublic({ ...editingMember, ...updatedData })
    }

    setIsEditDialogOpen(false)
    setEditingMember(null)
    resetForm()
    toast({ title: "Profile Updated", description: "Staff details saved successfully." })
  }

  const handleDeleteMember = (member: any) => {
    if (confirm(`Are you sure you want to remove ${member.firstName} ${member.lastName}?`)) {
      deleteDocumentNonBlocking(doc(db, "staffMembers", member.id))
      deleteDocumentNonBlocking(doc(db, "public_staff_profiles", member.id))
      toast({ title: "Member Removed", description: "Staff member has been deleted." })
    }
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      role: "",
      bio: "",
      email: "",
      phone: "",
      performanceScore: "85"
    })
  }

  const startEdit = (member: any) => {
    setEditingMember(member)
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      role: member.role,
      bio: member.bio || "",
      email: member.email || "",
      phone: member.phone || "",
      performanceScore: String(member.performanceScore || 85)
    })
    setIsEditDialogOpen(true)
  }

  const toggleActive = (member: any) => {
    const newActive = !member.isActive
    const memberRef = doc(db, "staffMembers", member.id)

    updateDocumentNonBlocking(memberRef, { 
      isActive: newActive,
      updatedAt: serverTimestamp()
    })

    syncToPublic(member, newActive)
  }

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading team...</div>
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Staff Management</h2>
          <p className="text-muted-foreground">Manage your team, track performance, and assign roles.</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Recruit New Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Recruit Staff Member</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} placeholder="e.g. Master Stylist" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddMember}>Create Profile</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-firstName">First Name</Label>
                <Input id="edit-firstName" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-lastName">Last Name</Label>
                <Input id="edit-lastName" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <Input id="edit-role" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-bio">Bio</Label>
              <Textarea id="edit-bio" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-score">Performance Score (%)</Label>
              <Input id="edit-score" type="number" value={formData.performanceScore} onChange={(e) => setFormData({...formData, performanceScore: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditMember}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {staff?.map((member) => (
          <Card key={member.id} className="overflow-hidden border-border/50 group hover-lift">
            <div className="relative h-48 w-full bg-muted">
              <Image 
                src={member.profileImageUrl || `https://picsum.photos/seed/${member.id}/400/400`} 
                alt={`${member.firstName} ${member.lastName}`} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                 <Badge className="bg-background/80 text-foreground backdrop-blur-md border-none">
                  <Star className="w-3 h-3 text-primary fill-primary mr-1" /> {member.performanceScore || 'N/A'}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{member.firstName} {member.lastName}</CardTitle>
                  <CardDescription className="text-primary font-medium">{member.role}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={member.isActive} 
                    onCheckedChange={() => toggleActive(member)}
                    className="scale-75"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-1">
                {member.specialtyIds?.map((spec: string) => (
                  <Badge key={spec} variant="secondary" className="text-[10px] py-0">{spec}</Badge>
                ))}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Efficiency</span>
                  <span className="font-bold">{member.performanceScore || 0}%</span>
                </div>
                <Progress value={member.performanceScore || 0} className="h-1.5 bg-muted">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${member.performanceScore || 0}%` }} />
                </Progress>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center pt-2">
                <div className="bg-muted/30 p-2 rounded-lg">
                  <p className="text-[10px] text-muted-foreground uppercase">Status</p>
                  <p className={`text-sm font-bold ${member.isActive ? 'text-green-500' : 'text-red-400'}`}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className="bg-muted/30 p-2 rounded-lg">
                  <p className="text-[10px] text-muted-foreground uppercase">Role</p>
                  <p className="text-xs font-bold truncate">{member.role}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 gap-2">
              <Button variant="outline" size="sm" className="flex-1 group/btn" onClick={() => startEdit(member)}>
                Edit <ChevronRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteMember(member)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
        {staff?.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed rounded-xl text-muted-foreground">
            No staff members found. Start by adding your first team member.
          </div>
        )}
      </div>
    </div>
  )
}
