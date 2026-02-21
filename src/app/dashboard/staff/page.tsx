"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  Star, 
  Calendar, 
  Mail, 
  Phone, 
  Settings2, 
  ChevronRight,
  TrendingUp
} from "lucide-react"
import Image from "next/image"

const staff = [
  {
    id: 1,
    name: "Emma Watson",
    role: "Senior Stylist",
    specialties: ["Balayage", "Color Correction", "Bridal"],
    performance: 92,
    rating: 4.9,
    bookings: 48,
    image: "https://picsum.photos/seed/emma/400/400"
  },
  {
    id: 2,
    name: "David Kim",
    role: "Master Barber",
    specialties: ["Fades", "Beard Sculpting", "Classic Cuts"],
    performance: 88,
    rating: 4.8,
    bookings: 54,
    image: "https://picsum.photos/seed/david/400/400"
  },
  {
    id: 3,
    name: "Sophie Laurent",
    role: "Makeup Artist",
    specialties: ["Editorial", "Bridal", "FX Makeup"],
    performance: 95,
    rating: 5.0,
    bookings: 32,
    image: "https://picsum.photos/seed/sophie/400/400"
  },
  {
    id: 4,
    name: "Marcus Aurelius",
    role: "Junior Stylist",
    specialties: ["Blowouts", "Scalp Treatments"],
    performance: 75,
    rating: 4.5,
    bookings: 22,
    image: "https://picsum.photos/seed/marcus/400/400"
  }
]

export default function StaffPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Staff Management</h2>
          <p className="text-muted-foreground">Manage your team, track performance, and assign roles.</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Users className="mr-2 h-4 w-4" /> Recruit New Member
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {staff.map((member) => (
          <Card key={member.id} className="overflow-hidden border-border/50 group hover-lift">
            <div className="relative h-48 w-full bg-muted">
              <Image 
                src={member.image} 
                alt={member.name} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                 <Badge className="bg-background/80 text-foreground backdrop-blur-md border-none">
                  <Star className="w-3 h-3 text-primary fill-primary mr-1" /> {member.rating}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">{member.role}</CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-1">
                {member.specialties.map(spec => (
                  <Badge key={spec} variant="secondary" className="text-[10px] py-0">{spec}</Badge>
                ))}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Efficiency</span>
                  <span className="font-bold">{member.performance}%</span>
                </div>
                <Progress value={member.performance} className="h-1.5 bg-muted">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${member.performance}%` }} />
                </Progress>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center pt-2">
                <div className="bg-muted/30 p-2 rounded-lg">
                  <p className="text-[10px] text-muted-foreground uppercase">Bookings</p>
                  <p className="text-sm font-bold">{member.bookings}</p>
                </div>
                <div className="bg-muted/30 p-2 rounded-lg">
                  <p className="text-[10px] text-muted-foreground uppercase">Efficiency</p>
                  <p className="text-sm font-bold text-green-500">
                    <TrendingUp className="inline-block h-3 w-3 mr-1" /> +12%
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full group/btn">
                View Detailed Metrics <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}