
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Scissors,
  Database
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip as ChartTooltip,
  Cell
} from "recharts"
import { useCollection, useFirestore, useMemoFirebase, setDocumentNonBlocking } from "@/firebase"
import { collection, doc, serverTimestamp } from "firebase/firestore"
import { toast } from "@/hooks/use-toast"

const data = [
  { name: "Mon", total: 1200 },
  { name: "Tue", total: 1800 },
  { name: "Wed", total: 1100 },
  { name: "Thu", total: 2400 },
  { name: "Fri", total: 3200 },
  { name: "Sat", total: 4100 },
  { name: "Sun", total: 1500 },
]

export default function DashboardPage() {
  const db = useFirestore()

  const formatTime = (dateTime: any) => {
    if (!dateTime) return "N/A"
    try {
      const date = typeof dateTime.toDate === 'function' ? dateTime.toDate() : new Date(dateTime)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch (e) {
      return "N/A"
    }
  }
  
  const productsQuery = useMemoFirebase(() => collection(db, "products"), [db])
  const servicesQuery = useMemoFirebase(() => collection(db, "services"), [db])
  const staffQuery = useMemoFirebase(() => collection(db, "staffMembers"), [db])
  const bookingsQuery = useMemoFirebase(() => collection(db, "bookings"), [db])

  const { data: products } = useCollection(productsQuery)
  const { data: services } = useCollection(servicesQuery)
  const { data: staff } = useCollection(staffQuery)
  const { data: bookings } = useCollection(bookingsQuery)

  const handleSeedData = () => {
    // Seed Sample Services
    const sampleServices = [
      { id: "ser-1", name: "Master Color Transformation", description: "Bespoke coloring using premium Italian pigments.", basePrice: 280, durationMinutes: 180, isVisible: true, isFeatured: true, category: "Color" },
      { id: "ser-2", name: "Sculpted Precision Cut", description: "Architectural hair design tailored to your silhouette.", basePrice: 120, durationMinutes: 60, isVisible: true, isFeatured: false, category: "Haircuts" },
      { id: "ser-3", name: "Luxury Scalp Therapy", description: "Ozone-infused scalp treatment with organic oils.", basePrice: 95, durationMinutes: 45, isVisible: true, isFeatured: true, category: "Scalp" }
    ]

    // Seed Sample Products
    const sampleProducts = [
      { id: "prod-1", name: "Elixir No. 9", description: "Rare argan oil infusion for instant radiance.", price: 65, stockQuantity: 24, isVisible: true, isFeatured: true, brand: "Studio Royale" },
      { id: "prod-2", name: "Silk Repair Masque", description: "Deep conditioning with hydrolyzed silk proteins.", price: 48, stockQuantity: 12, isVisible: true, isFeatured: true, brand: "Studio Royale" }
    ]

    // Seed Sample Staff
    const sampleStaff = [
      { id: "staff-1", firstName: "Julien", lastName: "Vane", role: "Creative Director", isActive: true, performanceScore: 98, bio: "Master of color and light with 15 years in luxury hair design." }
    ]

    sampleServices.forEach(s => setDocumentNonBlocking(doc(db, "services", s.id), { ...s, createdAt: serverTimestamp() }, { merge: true }))
    sampleProducts.forEach(p => setDocumentNonBlocking(doc(db, "products", p.id), { ...p, createdAt: serverTimestamp() }, { merge: true }))
    sampleStaff.forEach(st => setDocumentNonBlocking(doc(db, "staffMembers", st.id), { ...st, createdAt: serverTimestamp() }, { merge: true }))

    toast({ title: "Studio Seeded", description: "Sample luxury data has been added to your collections." })
  }

  const stats = [
    { title: "Total Services", value: services?.length || 0, change: "Available Menu", trend: "neutral", icon: Scissors, color: "text-primary" },
    { title: "Active Bookings", value: bookings?.length || 0, change: "Scheduled", trend: "up", icon: Calendar, color: "text-secondary" },
    { title: "Studio Team", value: staff?.length || 0, change: "Active Members", trend: "neutral", icon: Users, color: "text-blue-400" },
    { title: "Product Stock", value: products?.length || 0, change: "Total Items", trend: "up", icon: Package, color: "text-emerald-400" }
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Welcome back, Admin</h2>
          <p className="text-muted-foreground">Here's a real-time overview of your studio's operations.</p>
        </div>
        <div className="flex gap-2">
          {(!products || products.length === 0) && (
            <Button variant="outline" onClick={handleSeedData} className="border-primary/50 text-primary">
              <Database className="mr-2 h-4 w-4" /> Seed Sample Data
            </Button>
          )}
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">New Booking</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover-lift border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-headline">Revenue Overview</CardTitle>
            <CardDescription>Daily revenue performance for the current week.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <ChartTooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-popover border border-border p-2 rounded-lg shadow-xl text-xs">
                          <p className="font-bold">${payload[0].value}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                   {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.total > 3000 ? "hsl(var(--primary))" : "hsl(var(--secondary))"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-headline">Upcoming Bookings</CardTitle>
            <CardDescription>Real-time view of your upcoming schedule.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {bookings && bookings.length > 0 ? (
                bookings.slice(0, 4).map((booking: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors group">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Booking #{booking.id.substring(0, 5)}</p>
                      <p className="text-xs text-muted-foreground">{booking.status} • {booking.totalPrice}$</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{formatTime(booking.bookingDateTime)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground italic text-sm">
                  No upcoming bookings found.
                </div>
              )}
            </div>
            <Button variant="link" className="w-full mt-4 text-primary hover:text-primary/80 no-underline">
              View all bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
