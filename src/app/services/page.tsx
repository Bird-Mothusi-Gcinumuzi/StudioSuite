
import { PublicNav } from "@/components/public-nav"
import { initialServices } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PublicServicesPage() {
  const visibleServices = initialServices.filter(s => s.isVisible && s.status === "Active")
  
  const categories = Array.from(new Set(visibleServices.map(s => s.category)))

  return (
    <div className="min-h-screen bg-background pb-20">
      <PublicNav />
      <div className="pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Service Menu</h1>
          <p className="text-muted-foreground max-w-2xl">
            Explore our curated selection of premium beauty treatments. Each service is tailored to your unique style and needs.
          </p>
        </div>

        <div className="space-y-20">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-2xl font-bold font-headline mb-8 flex items-center gap-3">
                <div className="w-1 h-8 bg-primary rounded-full" />
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleServices
                  .filter(s => s.category === category)
                  .map((service) => (
                    <Card key={service.id} className="bg-card/40 border-border/50 hover:border-primary/50 transition-colors">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-xl">{service.name}</CardTitle>
                          {service.isFeatured && (
                            <Badge className="bg-primary/20 text-primary border-none text-[10px]">
                              <Sparkles className="w-3 h-3 mr-1" /> FEATURED
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                          {service.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex flex-col">
                            <span className="text-2xl font-bold text-primary">${service.price}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" /> {service.duration}
                            </span>
                          </div>
                          <Button size="sm" asChild>
                            <Link href="/dashboard">Book</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
