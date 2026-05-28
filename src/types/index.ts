export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string; // references Category.id
  stock: number;
  featured: boolean;
  rating: number;
  createdAt: string;
}

export interface Personalization {
  customImage?: string; // base64 string
  customMessage?: string; // Engraving text or card greeting
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  personalization?: Personalization;
}

export type OrderStatus = "Pending" | "Designing" | "Packing" | "Shipped" | "Delivered" | "Cancelled";

export interface TrackingHistoryItem {
  status: OrderStatus;
  timestamp: string;
  notes: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: "CreditCard" | "PayPal" | "CashOnDelivery";
  createdAt: string;
  trackingHistory: TrackingHistoryItem[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: "admin" | "customer";
}
