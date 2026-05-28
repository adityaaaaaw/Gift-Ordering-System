# 🎁 Giftly - Refined Gift Ordering & Customization System

Giftly is an ultra-premium, full-stack, SaaS-style **Gift Hamper Customization & Fulfillment** web application built using **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS v4**.

It is engineered with a **Universal Database Abstraction Layer** allowing it to seamlessly run in **Production Mode** (connected directly to a live Firebase cloud database) or in **Simulated Sandbox Mode** (using a fully interactive, reactive local database pre-seeded with 10 gorgeous hampers).

---

## 🌟 Key Features

### 👤 Customer Experience
1. **Glassmorphic Landing Page (`/`)**: Immerse users in beautiful HSL gradient back-glows, bestseller product grids, and step-by-step bespoke guides.
2. **Filterable Hamper Catalog (`/products`)**: Real-time search matching names/descriptions, dynamic category-tag filters, and price/rating sorting. Fully wrapped in dynamic React `<Suspense>` boundaries.
3. **Bespoke Customization Center (`/product/[id]`)**: 
   - **Engraving**: Customizable text area with a 250-character limit for special notes or engraving foils.
   - **Keepsake Dropzone**: Upload personal keepsake photos transformed into high-fidelity **Base64 data buffers** stored directly in the Firestore order payload.
4. **Zustand Hashed Shopping Cart (`/cart`)**: Distinct custom engravings of the *same* hamper box remain separated in the cart using unique state hashing keys.
5. **Secure Confetti Checkout (`/checkout`)**: Pre-filled customer cards, integrated shipping details, total order calculations, and celebratory canvas-confetti bursts on completion.
6. **Live Timeline tracker (`/orders?id=ORDER_ID`)**: Real-time multi-node vertical/horizontal status tracking (Placed ➜ Designing ➜ Packing ➜ Shipped ➜ Delivered).

---

### 👑 Admin SaaS Portal (`/admin`)
1. **Analytics Dashboard Index (`/admin`)**: Display critical business telemetry: **Sales Revenue**, **Total Orders**, **Customization Queue**, and **Low Inventory Warnings** alongside modern visual CSS dispatch charts.
2. **Catalog CRUD Manager (`/admin/products`)**: Seamlessly add, edit, or delete product hampers, increment/decrement stocks, tag category collections, and toggle featured bestsellers.
3. **Fulfillment Pipeline Dispatch Queue (`/admin/orders`)**: View shipping info, inspect bespoke engraving requests, click to review custom Base64 photos, and toggle status dispatch keys that update the customer's timeline tracking stepper in real-time.

---

## 🛠️ Technology Stack

- **Core**: Next.js 14 (App Router), React 19, TypeScript, Tailwind CSS v4 (with PostCSS integration)
- **Database & Auth**: Firebase SDK (Firestore, Auth), LocalStorage Fallback Reactive Engine
- **State Management**: Zustand (with Persist local rehydration)
- **Forms**: React Hook Form (with structured client validations)
- **Animations**: Framer Motion (for premium transitions)
- **Icons**: Lucide React
- **Celebrations**: Canvas Confetti

---

## 🔑 Demo Sandbox Credentials

If you're running the application without Firebase configured (Interactive Sandbox Mode), you can click the **Demo Admin Quick Login** button in the sign-in portal or enter these credentials manually:

- **Admin Portal URL**: `/login` (or click *Admin Portal* in the header navigation)
- **Email**: `admin@gift.com`
- **Password**: `admin123`
*(Note: Normal customers can Register via `/signup` using any valid email format!)*

---

## 🚀 Local Setup Instructions

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
If you wish to run on a real cloud database, create a `.env.local` file at the root:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDNSQcqY9Sk-IayBm_1m-onpp8o7PZSelg
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gift-ordering-system.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=gift-ordering-system
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gift-ordering-system.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=386415832054
NEXT_PUBLIC_FIREBASE_APP_ID=1:386415832054:web:bca5a711c2ecdc5409f5d7
```

### 3. Spin Up Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to experience the application.

---

## 📦 Production Build & Vercel Deployment

This project compiles flawlessly using Next.js Turbopack compilers. To build the production bundle locally:
```bash
npm run build
```

### Deploying to Vercel
1. Go to the [Vercel Project Creator](https://vercel.com/new).
2. Connect your GitHub/GitLab repository.
3. If connecting to Firebase, configure your environment variables (from `.env.local`) inside Vercel's **Environment Variables** panel.
4. Click **Deploy**. Vercel will instantly optimize static assets and serve your serverless routes globally.

---

## 📐 System Architecture Diagram

```mermaid
graph TD
    A[Client User Interface] --> B[Cart Store & Auth Provider Context]
    B --> C[dbService Wrapper Controller]
    C -->|Has Environment Keys| D[Firestore Database / Firebase Auth]
    C -->|No Environment Keys| E[Reactive LocalStorage Sandbox Engine]
    E --> F[Seed Data Products 10 Hampers]
    E --> G[Timeline Order Subscribers]
```

---
*Crafted with 💝 by the Giftly Development Team.*
