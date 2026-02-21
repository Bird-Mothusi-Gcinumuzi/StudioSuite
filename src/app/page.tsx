"use client"

import { PublicNav } from "@/components/public-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection, query, where, limit, orderBy } from "firebase/firestore"
import { ArrowRight, Star, Sparkles, Scissors } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  const db = useFirestore()
  
  // Query for featured items that are visible
  const publicServicesQuery = useMemoFirebase(() => 
    query(
      collection(db, "public_services"), 
      where("isFeatured", "==", true),
      limit(3)
    ), [db])

  const publicProductsQuery = useMemoFirebase(() => 
    query(
      collection(db, "public_products"), 
      where("isFeatured", "==", true),
      limit(4)
    ), [db])
  
  const { data: featuredServices } = useCollection(publicServicesQuery)
  const { data: featuredProducts } = useCollection(publicProductsQuery)

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <Sparkles className="w-3 h-3" /> LUXURY STUDIO MANAGEMENT
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-headline mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Unveiling Your <br /><span className="text-primary italic">Inner Brilliance</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10">
            Experience the pinnacle of beauty care. From bespoke color transformations 
            to precision grooming, we manage every detail of your luxury experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-14 px-8 text-lg font-bold group" asChild>
              <Link href="/dashboard">
                Book Appointment <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold" asChild>
              <Link href="/services">Explore Menu</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-24 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold font-headline mb-4">Signature Experiences</h2>
              <p className="text-muted-foreground">The treatments our clients love most.</p>
            </div>
            <Button variant="link" className="text-primary p-0 h-auto" asChild>
              <Link href="/services">View All Services <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices?.map((service) => (
              <Card key={service.id} className="bg-background/50 border-border/50 hover-lift overflow-hidden">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">${service.basePrice || service.price}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">{service.durationMinutes || 60} MIN</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!featuredServices || featuredServices.length === 0) && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                Check back soon for our featured services.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-headline mb-4">Luxury Retail</h2>
            <p className="text-muted-foreground">Take the professional experience home with you.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts?.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-muted border border-border/50">
                  <Image 
                    src={product.imageUrl || `https://picsum.photos/seed/${product.id}/400/400`} 
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  {product.discountPercentage > 0 && (
                    <div className="absolute top-4 left-4 bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-1 rounded-full">
                      {product.discountPercentage}% OFF
                    </div>
                  )}
                </div>
                <h3 className="font-bold mb-1">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-tighter">{product.brand || "Studio Exclusive"}</p>
                <p className="text-primary font-bold">${product.price}</p>
              </div>
            ))}
            {(!featuredProducts || featuredProducts.length === 0) && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                Discover our luxury product line soon.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Scissors className="w-5 h-5 text-primary" />
            <span className="text-lg font-bold">StudioSuite</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 Luxury Management Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/dashboard" className="text-xs text-muted-foreground hover:text-primary">Admin Access</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
