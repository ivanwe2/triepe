import type { Metadata } from "next";
import { Inter, Koulen } from "next/font/google";
import "./globals.css";
import StoreWrapper from "@/components/StoreWrapper";
import { Toaster } from "sonner";

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
      <body className={`${inter.variable} ${koulen.variable} min-h-screen bg-black text-white overflow-x-hidden selection:bg-gray-400 selection:text-black relative flex flex-col`}>
        <StoreWrapper>
          {children}
        </StoreWrapper>

        {/* Brutalist styled toasts */}
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: '#000',
              color: '#fff',
              border: '1px solid #333',
              borderRadius: '0px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 'bold',
            },
            className: 'font-sans'
          }} 
        />
      </body>
    </html>
  );
}