// /src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/providers/AuthProvider";
import { SidebarProvider } from "@/contexts/SidebarContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MMS 2.0 - Media Management System",
  description: "Next generation media management system for US Media",
  icons: {
    icon: "/us-media.png",
    apple: "/us-media.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <NextAuthProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
