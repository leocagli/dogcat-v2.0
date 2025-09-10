import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "DogCat - Encuentra Mascotas Perdidas",
  description: "Ayuda a encontrar mascotas perdidas y reunir familias",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="pb-16">{children}</div>
          <BottomNavigation />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
