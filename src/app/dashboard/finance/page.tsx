"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from "recharts"
import { 
  Download, 
  Calendar as CalendarIcon, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  CreditCard,
  DollarSign
} from "lucide-react"

const monthlyData = [
  { name: "Jan", revenue: 4500, profit: 2400 },
  { name: "Feb", revenue: 5200, profit: 2800 },
  { name: "Mar", revenue: 4800, profit: 2100 },
  { name: "Apr", revenue: 6100, profit: 3400 },
  { name: "May", revenue: 5900, profit: 3100 },
  { name: "Jun", revenue: 7200, profit: 4500 },
  { name: "Jul", revenue: 8500, profit: 5800 },
]

export default function FinancePage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Financial Analytics</h2>
          <p className="text-muted-foreground">Detailed breakdown of your studio's financial performance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <CalendarIcon className="mr-2 h-4 w-4" /> Last 6 Months
          </Button>
          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Download className="mr-2 h-4 w-4" /> Export Data
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Net Profit", value: "$24,580", change: "+18%", trend: "up", icon: DollarSign, color: "text-primary" },
          { title: "Outstanding", value: "$1,240", change: "-5%", trend: "down", icon: CreditCard, color: "text-red-400" },
          { title: "Average Ticket", value: "$145", change: "+12%", trend: "up", icon: TrendingUp, color: "text-secondary" },
        ].map((metric) => (
          <Card key={metric.title} className="bg-card/30 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
              <div className={`p-2 rounded-lg bg-background border border-border`}>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metric.value}</div>
              <p className={`text-xs mt-1 flex items-center gap-1 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {metric.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {metric.change} from previous period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-headline">Revenue vs Profit</CardTitle>
            <CardDescription>Monthly comparison of income and net gains.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="profit" stroke="hsl(var(--secondary))" fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-headline">Service Distribution</CardTitle>
            <CardDescription>Revenue share by service category.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] w-full mt-4">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { category: "Color", amount: 4500 },
                { category: "Haircuts", amount: 3200 },
                { category: "Makeup", amount: 1800 },
                { category: "Retail", amount: 2400 },
                { category: "Scalp", amount: 1200 },
              ]}>
                <XAxis dataKey="category" stroke="#888888" tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
                />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}