"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import MobileMenu from "@/components/MobileMenu";

/**
 * StoreWrapper conditionally renders the Store UI (Navbar, Footer, etc.)
 * only if the user is NOT on an admin page.
 */
export default function StoreWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if the current route is part of the admin panel
  // Using a safety check for pathname
  const isAdminPage = pathname?.startsWith("/admin") ?? false;

  // If it's an admin page, we return a clean main container without the shop UI
  if (isAdminPage) {
    return (
      <main className="min-h-screen w-full bg-black">
        {children}
      </main>
    );
  }

  // Otherwise, we wrap the content with the full store navigation and footer
  return (
    <>
      <Navbar />
      <MobileMenu />
      <CartDrawer />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </>
  );
}