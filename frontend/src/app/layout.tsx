import type { Metadata } from "next";
import { Inter, Koulen } from "next/font/google";
import "./globals.css";

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
      <body className={`${inter.variable} ${koulen.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}