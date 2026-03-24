import type { Metadata } from "next";
import { Inter, Koulen } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import MobileMenu from "@/components/MobileMenu";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const koulen = Koulen({ weight: "400", subsets: ["latin"], variable: "--font-koulen" });

export const metadata: Metadata = {
  title: "Triepe | Redefining Conventional Streetwear",
  description: "E-commerce platform for Triepe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <html lang="en">
      <body className={`${inter.variable} ${koulen.variable} min-h-screen bg-black text-white overflow-x-hidden selection:bg-gray-400 selection:text-black relative`}>
        <Navbar />
        <MobileMenu />
        <CartDrawer />
        
        <div className="flex-1">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}