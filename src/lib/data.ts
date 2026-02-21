
export interface Service {
  id: number;
  name: string;
  category: string;
  duration: string;
  price: number;
  status: "Active" | "Inactive";
  isVisible: boolean; // Show on /services page
  isFeatured: boolean; // Show on / (home) page
  description: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  stock: number;
  price: number;
  discount: number;
  isVisible: boolean; // Show on /products page
  isFeatured: boolean; // Show on / (home) page
  image: string;
  description: string;
}

export const initialServices: Service[] = [
  { id: 1, name: "Signature Balayage", category: "Color", duration: "180 min", price: 250, status: "Active", isVisible: true, isFeatured: true, description: "Our most popular coloring technique for a natural, sun-kissed look." },
  { id: 2, name: "Precision Haircut", category: "Haircuts", duration: "60 min", price: 85, status: "Active", isVisible: true, isFeatured: false, description: "Masterfully crafted cuts tailored to your face shape and hair type." },
  { id: 3, name: "Full Glam Makeup", category: "Makeup", duration: "75 min", price: 120, status: "Active", isVisible: true, isFeatured: true, description: "Red-carpet ready makeup for your most special occasions." },
  { id: 4, name: "Keratin Treatment", category: "Scalp", duration: "150 min", price: 300, status: "Active", isVisible: true, isFeatured: false, description: "Smoothing treatment to eliminate frizz and add brilliant shine." },
];

export const initialProducts: Product[] = [
  { id: 1, name: "Moroccanoil Shampoo", brand: "Moroccanoil", stock: 15, price: 34.00, discount: 0, isVisible: true, isFeatured: true, image: "https://picsum.photos/seed/shampoo/400/400", description: "Hydrating shampoo infused with antioxidant-rich argan oil." },
  { id: 2, name: "Olaplex No. 3", brand: "Olaplex", stock: 3, price: 28.00, discount: 10, isVisible: true, isFeatured: true, image: "https://picsum.photos/seed/olaplex/400/400", description: "A global bestseller that repairs and strengthens all hair types." },
  { id: 3, name: "Dyson Airwrap", brand: "Dyson", stock: 2, price: 599.00, discount: 0, isVisible: true, isFeatured: false, image: "https://picsum.photos/seed/dyson/400/400", description: "The ultimate styling tool for professional results at home." },
];
