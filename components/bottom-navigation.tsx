"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/reportar?tipo=perdido",
      icon: "⚠️",
      label: "Mi mascota se perdió",
      shortLabel: "Perdido",
      bgImage: "/context-lost-pets-rain.jpeg",
    },
    {
      href: "/reportar?tipo=encontrado",
      icon: "❤️",
      label: "Encontré una mascota",
      shortLabel: "Encontré",
      bgImage: "/context-couple-found-cat.jpeg",
    },
    {
      href: "/ai-matching",
      icon: "🧠",
      label: "Matches IA",
      shortLabel: "Matches IA",
      bgImage: "/context-ai-robot-match.jpeg",
    },
    {
      href: "/buscar",
      icon: "🔍",
      label: "Buscar mascotas",
      shortLabel: "Buscar",
      bgImage: "/context-adoption-interface.jpeg",
    },
    {
      href: "/mapa",
      icon: "🗺️",
      label: "Ver mapa",
      shortLabel: "Mapa",
      bgImage: "/context-match-found.jpeg",
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-md mx-auto flex">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href.includes("reportar") && pathname.includes("reportar"))

          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <Button
                variant="ghost"
                className={`w-full h-16 flex flex-col items-center justify-center gap-1 rounded-none relative overflow-hidden ${
                  isActive ? "text-white" : "text-white hover:text-white"
                }`}
              >
                <div className="absolute inset-0">
                  <Image src={item.bgImage || "/placeholder.svg"} alt={item.label} fill className="object-cover" />
                  <div className={`absolute inset-0 ${isActive ? "bg-primary/70" : "bg-black/60 hover:bg-black/50"}`} />
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center gap-1">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs font-medium text-center">{item.shortLabel}</span>
                </div>
              </Button>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
