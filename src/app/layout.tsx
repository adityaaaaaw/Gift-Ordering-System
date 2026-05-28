import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoBanner from "@/components/DemoBanner";
import ToastContainer from "@/components/ui/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Giftly | Modern Curated & Personalized Gift Hampers",
  description: "Discover premium handcrafted gift boxes, gourmet hampers, and custom-engraved treasures. Personalized with custom photos and heartfelt greeting notes. Fast home delivery.",
  keywords: ["personalized gifts", "gift ordering system", "wedding hampers", "corporate gift boxes", "anniversary gifts", "giftly"],
  authors: [{ name: "Giftly Systems" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased bg-background text-foreground`}>
        <AuthProvider>
          {/* Active sandbox credential alerts */}
          <DemoBanner />
          
          {/* Elegant header banner */}
          <Navbar />
          
          {/* Main workspace canvas */}
          <main className="flex-1 w-full relative">
            {children}
          </main>
          
          {/* Global toast notification system */}
          <ToastContainer />
          
          {/* Global footer details */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
