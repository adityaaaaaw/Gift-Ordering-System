import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { Product, Order, OrderItem, Category, OrderStatus, TrackingHistoryItem } from "@/types";

// ==========================================
// 1. Mock Seed Data (Premium Products & Categories)
// ==========================================

const SEED_CATEGORIES: Category[] = [
  {
    id: "personalized",
    name: "Personalized",
    description: "Bespoke handcrafted items carrying hot-stamped custom foils and metal plate engravings.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "anniversary",
    name: "Anniversary",
    description: "Deeply romantic Ecuadorian rose boxes and deluxe chocolate congratulate hampers.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tech",
    name: "Tech",
    description: " bedside ambient wellness sound systems and Qi charging hubs.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Refined charcoal vegan leather blotters and bronze desk sets.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "flowers-bath",
    name: "Flowers & Bath",
    description: "Organic spa lavender clay bath treats and custom pine slid-top box sets.",
    createdAt: new Date().toISOString(),
  }
];

const SEED_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Enchanted Forever Rose in Glass Dome",
    description: "A premium, hand-preserved Ecuadorian rose encased inside a luxurious handblown glass dome. Embedded with ambient micro-fairy LED lights on a refined walnut wooden base. Designed to last up to 3 years without water, making it a perfect symbol of everlasting affection.",
    price: 59.99,
    imageUrl: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop&q=80",
    category: "anniversary",
    stock: 25,
    featured: true,
    rating: 4.9,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-2",
    name: "Personalized Classic Saffiano Leather Wallet",
    description: "Handcrafted from 100% full-grain Saffiano leather, this premium bi-fold wallet merges sleek minimalism with high utility. Features a velvet-lined bill compartment, 6 RFID-blocking card slots, and hot-stamped golden foil personalization. Custom engravings are handcrafted by our master artisans.",
    price: 45.00,
    imageUrl: "https://images.unsplash.com/photo-1627124718515-552fd011309b?w=600&auto=format&fit=crop&q=80",
    category: "personalized",
    stock: 14,
    featured: true,
    rating: 4.8,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-3",
    name: "Luxury Wooden Wellness & Bath Gift Set",
    description: "An ultra-premium spa treatment at home. Includes organic French lavender bubble bath, dead sea mineral salt scrub, an artisanal charcoal clay bar, a natural sisal scrubbing mitt, and a slow-burning handpoured soy candle. Arranged in a reusable solid pine slide-top container.",
    price: 75.00,
    imageUrl: "https://images.unsplash.com/photo-1615396899839-c99c121888b0?w=600&auto=format&fit=crop&q=80",
    category: "flowers-bath",
    stock: 8,
    featured: true,
    rating: 4.7,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-4",
    name: "Aura Ambient Bluetooth Speaker & Wireless Charger",
    description: "A state-of-the-art bedside companion. Blends a powerful 360-degree wireless speaker, a fast-charging Qi inductive dock, and a gorgeous dynamic sunrise alarm lamp with customizable gradient colors. High-quality custom wood veneer housing.",
    price: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1608248597481-496100c80836?w=600&auto=format&fit=crop&q=80",
    category: "tech",
    stock: 12,
    featured: false,
    rating: 4.6,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-5",
    name: "Executive Leather & Metal Desk Accessories Set",
    description: "An elegant, corporate-class desk organizing suite. Crafted in matching charcoal premium vegan leather and aluminum bronze accents. Includes a dual-slot letter tray, a pen holder cups, a magnetic paperclip bowl, and a double-sided writing blotter.",
    price: 110.00,
    imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80",
    category: "corporate",
    stock: 20,
    featured: false,
    rating: 4.5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-6",
    name: "Deluxe Chocolate & Champagne Congratulatory Trunk",
    description: "Mark your golden milestones in style. Packed in a vintage leather-strapped travel trunk, featuring a classic bottle of Moët & Chandon Brut, a golden box of dark chocolate truffles, and gourmet honey-glazed almonds.",
    price: 135.00,
    imageUrl: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500&auto=format&fit=crop&q=80",
    category: "anniversary",
    stock: 5,
    featured: true,
    rating: 5.0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-7",
    name: "Bespoke Cherry Wood Carved Couple Keepsakes Chest",
    description: "A breathtaking, hand-carved cherry wood keepsakes chest customizable with your shared anniversary date or engraved calligraphy. Crafted with velvet linings inside.",
    price: 65.00,
    imageUrl: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=600&auto=format&fit=crop&q=80",
    category: "personalized",
    stock: 10,
    featured: true,
    rating: 4.9,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-8",
    name: "Smart Ambient Sleep & Wakeup Therapy Light",
    description: "A sleek bedside therapy dome that emits clinically proven light frequencies to help you fall asleep and wake up naturally. Features built-in white noise.",
    price: 120.00,
    imageUrl: "https://images.unsplash.com/photo-1518331647614-7a1f04db3437?w=600&auto=format&fit=crop&q=80",
    category: "tech",
    stock: 15,
    featured: false,
    rating: 4.7,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-9",
    name: "Organic Premium Lavender Chamomile Tea Hamper",
    description: "Delight in total tranquility. Features two hand-crafted ceramic mugs, organic lavender chamomile loose tea, a bronze leaf tea strainer, and premium honeycomb jars.",
    price: 42.50,
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    category: "flowers-bath",
    stock: 18,
    featured: false,
    rating: 4.8,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-10",
    name: "Artisanal Vegan Leather Passport & Luggage Set",
    description: "The ultimate luxury travel companion. Features a bespoke vegan leather passport sleeve and matching luggage tags personalized with brushed brass lettering.",
    price: 85.00,
    imageUrl: "https://images.unsplash.com/photo-1524850301259-77298c48b499?w=600&auto=format&fit=crop&q=80",
    category: "corporate",
    stock: 22,
    featured: false,
    rating: 4.6,
    createdAt: new Date().toISOString(),
  }
];

// ==========================================
// 2. Local Mock Database Engine
// ==========================================

const LOCAL_STORAGE_KEYS = {
  CATEGORIES: "giftly_mock_categories_refined",
  PRODUCTS: "giftly_mock_products_refined",
  ORDERS: "giftly_mock_orders_refined",
};

let mockCategories: Category[] = [];
let mockProducts: Product[] = [];
let mockOrders: Order[] = [];
const orderSubscribers: Map<string, Array<(order: Order) => void>> = new Map();

const initializeMockDB = () => {
  if (typeof window === "undefined") return;

  const savedCategories = localStorage.getItem(LOCAL_STORAGE_KEYS.CATEGORIES);
  if (!savedCategories) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
    mockCategories = [...SEED_CATEGORIES];
  } else {
    mockCategories = JSON.parse(savedCategories);
  }

  const savedProducts = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
  if (!savedProducts) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    mockProducts = [...SEED_PRODUCTS];
  } else {
    mockProducts = JSON.parse(savedProducts);
  }

  const savedOrders = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
  if (!savedOrders) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify([]));
    mockOrders = [];
  } else {
    mockOrders = JSON.parse(savedOrders);
  }
};

if (typeof window !== "undefined") {
  initializeMockDB();
}

const saveMockCategories = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(mockCategories));
  }
};

const saveMockProducts = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(mockProducts));
  }
};

const saveMockOrders = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(mockOrders));
  }
};

const notifyOrderSubscribers = (order: Order) => {
  const list = orderSubscribers.get(order.id);
  if (list) {
    list.forEach((callback) => callback(order));
  }
};

// ==========================================
// 3. Refined dbService Implementation
// ==========================================

export const dbService = {
  // --- Categories DB Services ---

  async getCategories(): Promise<Category[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "categories"), orderBy("name", "asc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Category));
      } catch (error) {
        console.error("Firestore getCategories failed, using mock:", error);
      }
    }
    return [...mockCategories];
  },

  async addCategory(catData: Omit<Category, "id" | "createdAt">): Promise<Category> {
    const newCat: Category = {
      ...catData,
      id: catData.name.toLowerCase().replace(/\s+/g, "-"),
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, "categories"), {
          name: newCat.name,
          description: newCat.description,
          createdAt: newCat.createdAt,
        });
        return newCat;
      } catch (error) {
        console.error("Firestore addCategory failed, saving mock:", error);
      }
    }

    mockCategories.push(newCat);
    saveMockCategories();
    return newCat;
  },

  // --- Products DB Services ---
  
  async getProducts(): Promise<Product[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
      } catch (error) {
        console.error("Firestore getProducts failed, using mock:", error);
      }
    }
    return [...mockProducts];
  },

  async getProductById(id: string): Promise<Product | null> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDoc(doc(db, "products", id));
        if (snap.exists()) {
          return { id: snap.id, ...snap.data() } as Product;
        }
      } catch (error) {
        console.error("Firestore getProductById failed, using mock:", error);
      }
    }
    return mockProducts.find((p) => p.id === id) || null;
  },

  async addProduct(productData: Omit<Product, "id" | "createdAt" | "rating">): Promise<Product> {
    const newProduct: Product = {
      ...productData,
      id: "prod-" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      rating: 4.5,
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: newProduct.createdAt,
          rating: newProduct.rating,
        });
        return { ...newProduct, id: docRef.id };
      } catch (error) {
        console.error("Firestore addProduct failed, saving locally:", error);
      }
    }

    mockProducts.unshift(newProduct);
    saveMockProducts();
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, "products", id), updates);
        const updated = await this.getProductById(id);
        if (updated) return updated;
      } catch (error) {
        console.error("Firestore updateProduct failed, editing locally:", error);
      }
    }

    mockProducts = mockProducts.map((p) => (p.id === id ? { ...p, ...updates } : p));
    saveMockProducts();
    const updated = mockProducts.find((p) => p.id === id);
    if (!updated) throw new Error("Product not found");
    return updated;
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "products", id));
        return true;
      } catch (error) {
        console.error("Firestore deleteProduct failed, deleting locally:", error);
      }
    }

    mockProducts = mockProducts.filter((p) => p.id !== id);
    saveMockProducts();
    return true;
  },

  // --- Orders DB Services ---

  async createOrder(orderData: Omit<Order, "id" | "createdAt" | "trackingHistory">): Promise<Order> {
    const newOrder: Order = {
      ...orderData,
      id: "order-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      createdAt: new Date().toISOString(),
      trackingHistory: [
        {
          status: "Pending",
          timestamp: new Date().toISOString(),
          notes: "Your gift order has been successfully placed. Designing phase will start soon.",
        },
      ],
    };

    // Firebase storage calls are COMPLETELY EXCLUDED.
    // The photo base64 string is stored directly as a simple Firestore string attribute!
    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, "orders"), {
          ...newOrder,
          createdAt: newOrder.createdAt,
        });
        const finishedOrder = { ...newOrder, id: docRef.id };
        
        // Deduct stocks
        await Promise.all(
          finishedOrder.items.map(async (item) => {
            const product = await this.getProductById(item.productId);
            if (product) {
              const newStock = Math.max(0, product.stock - item.quantity);
              await this.updateProduct(item.productId, { stock: newStock });
            }
          })
        );

        return finishedOrder;
      } catch (error) {
        console.error("Firestore createOrder failed, saving locally:", error);
      }
    }

    // Mock Fallback
    mockOrders.unshift(newOrder);
    saveMockOrders();

    // Deduct stock in mock
    newOrder.items.forEach((item) => {
      mockProducts = mockProducts.map((p) => {
        if (p.id === item.productId) {
          return { ...p, stock: Math.max(0, p.stock - item.quantity) };
        }
        return p;
      });
    });
    saveMockProducts();

    return newOrder;
  },

  async getOrders(): Promise<Order[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
      } catch (error) {
        console.error("Firestore getOrders failed, using mock:", error);
      }
    }
    return [...mockOrders];
  },

  async getOrdersByEmail(email: string): Promise<Order[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(
          collection(db, "orders"),
          where("customerEmail", "==", email),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
      } catch (error) {
        console.error("Firestore getOrdersByEmail failed, using mock:", error);
      }
    }
    return mockOrders.filter((o) => o.customerEmail.toLowerCase() === email.toLowerCase());
  },

  async getOrderById(id: string): Promise<Order | null> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDoc(doc(db, "orders", id));
        if (snap.exists()) {
          return { id: snap.id, ...snap.data() } as Order;
        }
      } catch (error) {
        console.error("Firestore getOrderById failed, using mock:", error);
      }
    }
    return mockOrders.find((o) => o.id === id) || null;
  },

  async updateOrderStatus(
    orderId: string,
    status: Order["status"],
    notes?: string
  ): Promise<Order> {
    const timestamp = new Date().toISOString();
    const defaultNotes = {
      Pending: "Your gift order has been successfully placed.",
      Designing: "Our visual designers are creating your custom engraving templates.",
      Packing: "Designing complete! Hamper items are being wrapped in custom pine slides.",
      Shipped: "Dispatched! Handed over to Express Cargo.",
      Delivered: "Safe hand-delivery complete. Enjoy your special celebration!",
      Cancelled: "Your order has been cancelled and invoice refunded.",
    }[status];

    const newHistoryItem: TrackingHistoryItem = {
      status,
      timestamp,
      notes: notes || defaultNotes,
    };

    if (isFirebaseConfigured && db) {
      try {
        const orderDocRef = doc(db, "orders", orderId);
        const currentOrder = await this.getOrderById(orderId);
        if (currentOrder) {
          const updatedHistory = [...currentOrder.trackingHistory, newHistoryItem];
          await updateDoc(orderDocRef, {
            status,
            trackingHistory: updatedHistory,
          });
          const finished = await this.getOrderById(orderId);
          if (finished) return finished;
        }
      } catch (error) {
        console.error("Firestore updateOrderStatus failed, using mock:", error);
      }
    }

    // Mock Fallback
    mockOrders = mockOrders.map((o) => {
      if (o.id === orderId) {
        const trackingHistory = [...o.trackingHistory];
        trackingHistory.push(newHistoryItem);
        const updatedOrder = { ...o, status, trackingHistory };
        setTimeout(() => notifyOrderSubscribers(updatedOrder), 50);
        return updatedOrder;
      }
      return o;
    });
    saveMockOrders();

    const order = mockOrders.find((o) => o.id === orderId);
    if (!order) throw new Error("Order not found");
    return order;
  },

  // --- Real-time Order Tracker Subscriptions ---
  
  subscribeToOrder(orderId: string, callback: (order: Order) => void): () => void {
    if (isFirebaseConfigured && db) {
      try {
        const unsub = onSnapshot(doc(db, "orders", orderId), (docSnap) => {
          if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() } as Order);
          }
        });
        return unsub;
      } catch (error) {
        console.error("Firestore live onSnapshot failed, using Mock Subscription:", error);
      }
    }

    if (!orderSubscribers.has(orderId)) {
      orderSubscribers.set(orderId, []);
    }
    orderSubscribers.get(orderId)!.push(callback);

    const current = mockOrders.find((o) => o.id === orderId);
    if (current) {
      callback(current);
    }

    return () => {
      const list = orderSubscribers.get(orderId);
      if (list) {
        const index = list.indexOf(callback);
        if (index > -1) {
          list.splice(index, 1);
        }
        if (list.length === 0) {
          orderSubscribers.delete(orderId);
        }
      }
    };
  },
};
