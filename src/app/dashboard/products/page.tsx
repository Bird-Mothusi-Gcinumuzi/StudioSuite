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
import { Switch } from "@/components/ui/switch"
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking, setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase"
import { collection, doc, serverTimestamp } from "firebase/firestore"

export default function ProductsPage() {
  const db = useFirestore()
  const [searchTerm, setSearchTerm] = useState("")

  const productsQuery = useMemoFirebase(() => collection(db, "products"), [db])
  const { data: products, isLoading } = useCollection(productsQuery)

  const syncToPublic = (product: any, isVisibleOverride?: boolean) => {
    const isVisible = isVisibleOverride !== undefined ? isVisibleOverride : product.isVisible
    const publicProductRef = doc(db, "public_products", product.id)

    if (isVisible) {
      setDocumentNonBlocking(publicProductRef, {
        id: product.id,
        name: product.name,
        description: product.description || "",
        price: product.price,
        discountPercentage: product.discountPercentage || 0,
        imageUrl: product.imageUrl || `https://picsum.photos/seed/${product.id}/400/400`,
        brand: product.brand || "Studio Exclusive",
        isFeatured: product.isFeatured || false,
        updatedAt: serverTimestamp()
      }, { merge: true })
    } else {
      deleteDocumentNonBlocking(publicProductRef)
    }
  }

  const toggleVisibility = (product: any) => {
    const newVisibility = !product.isVisible
    const productRef = doc(db, "products", product.id)

    updateDocumentNonBlocking(productRef, { 
      isVisible: newVisibility,
      updatedAt: serverTimestamp()
    })

    syncToPublic(product, newVisibility)
  }

  const toggleFeatured = (product: any) => {
    const newFeatured = !product.isFeatured
    const productRef = doc(db, "products", product.id)
    
    updateDocumentNonBlocking(productRef, { 
      isFeatured: newFeatured,
      updatedAt: serverTimestamp()
    })

    // Update public version too if it's currently visible
    if (product.isVisible) {
      syncToPublic({ ...product, isFeatured: newFeatured })
    }
  }

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || []

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading products...</div>
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Product Inventory</h2>
          <p className="text-muted-foreground">Manage retail products and homepage features.</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Featured Online</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products?.filter(p => p.isFeatured).length || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{products?.filter(p => p.stockQuantity < 5).length || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{products?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border/50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            placeholder="Search products..." 
            className="w-full bg-background/50 border-none rounded-md px-10 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-border/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Catalog</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} className="hover:bg-muted/20">
                <TableCell>
                  <div className="relative h-10 w-10 rounded overflow-hidden border border-border bg-muted">
                    <Image 
                      src={product.imageUrl || `https://picsum.photos/seed/${product.id}/400/400`} 
                      alt={product.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-[10px] text-muted-foreground">{product.brand || "Studio Exclusive"}</div>
                </TableCell>
                <TableCell className="font-bold text-primary">${product.price}</TableCell>
                <TableCell>
                  <Switch 
                    checked={product.isVisible} 
                    onCheckedChange={() => toggleVisibility(product)}
                  />
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={product.isFeatured} 
                    onCheckedChange={() => toggleFeatured(product)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
