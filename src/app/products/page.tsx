
import { PublicNav } from "@/components/public-nav"
import { initialProducts } from "@/lib/data"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Star } from "lucide-react"

export default function PublicProductsPage() {
  const visibleProducts = initialProducts.filter(p => p.isVisible)

  return (
    <div className="min-h-screen bg-background pb-20">
      <PublicNav />
      <div className="pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Professional Products</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Premium care for your hair and skin, curated by our master stylists for salon-quality results at home.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {visibleProducts.map((product) => (
            <div key={product.id} className="group relative bg-card/20 border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {product.isFeatured && (
                    <Badge className="bg-background/90 text-primary border-none shadow-lg backdrop-blur-md">
                      <Star className="w-3 h-3 fill-primary mr-1" /> Best Seller
                    </Badge>
                  )}
                  {product.discount > 0 && (
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                      {product.discount}% OFF
                    </Badge>
                  )}
                </div>
              </div>
              <div className="p-6">
                <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">{product.brand}</p>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    {product.discount > 0 && (
                      <span className="text-xs text-muted-foreground line-through">
                        ${(product.price * (1 + product.discount/100)).toFixed(2)}
                      </span>
                    )}
                    <span className="text-xl font-bold">${product.price}</span>
                  </div>
                  <Button size="icon" variant="outline" className="rounded-full hover:bg-primary hover:text-primary-foreground">
                    <ShoppingBag className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
