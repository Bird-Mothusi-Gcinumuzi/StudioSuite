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
  Scissors
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
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection } from "firebase/firestore"

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
  
  // Real-time counts for stats
  const productsQuery = useMemoFirebase(() => collection(db, "products"), [db])
  const servicesQuery = useMemoFirebase(() => collection(db, "services"), [db])
  const staffQuery = useMemoFirebase(() => collection(db, "staffMembers"), [db])
  const bookingsQuery = useMemoFirebase(() => collection(db, "bookings"), [db])

  const { data: products } = useCollection(productsQuery)
  const { data: services } = useCollection(servicesQuery)
  const { data: staff } = useCollection(staffQuery)
  const { data: bookings } = useCollection(bookingsQuery)

  const stats = [
    {
      title: "Total Services",
      value: services?.length || 0,
      change: "Available Menu",
      trend: "neutral",
      icon: Scissors,
      color: "text-primary"
    },
    {
      title: "Active Bookings",
      value: bookings?.length || 0,
      change: "Scheduled",
      trend: "up",
      icon: Calendar,
      color: "text-secondary"
    },
    {
      title: "Studio Team",
      value: staff?.length || 0,
      change: "Active Members",
      trend: "neutral",
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Product Stock",
      value: products?.length || 0,
      change: "Total Items",
      trend: "up",
      icon: Package,
      color: "text-emerald-400"
    }
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Welcome back, Admin</h2>
          <p className="text-muted-foreground">Here's a real-time overview of your studio's operations.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Download Report</Button>
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
                <XAxis 
                  dataKey="name" 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
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
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.total > 3000 ? "hsl(var(--primary))" : "hsl(var(--secondary))"} 
                    />
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
                      <p className="text-sm font-bold text-primary">{new Date(booking.bookingDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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