"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  X,
  MapPin,
  Calendar,
  Phone,
  MessageCircle,
  Plus,
  Filter,
  Eye,
  Map,
  ArrowLeft,
  Home,
  Clock,
  AlertTriangle,
  Brain,
  Sparkles,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Pet {
  id: string
  name: string
  type: "perro" | "gato" | "otro"
  breed: string
  color: string
  size: "pequeño" | "mediano" | "grande"
  status: "perdido" | "encontrado"
  location: string
  date: string
  description: string
  contact: {
    name: string
    phone: string
    whatsapp?: string
  }
  images: string[]
  distance: string
}

// Mock data for demonstration
const mockPets: Pet[] = [
  {
    id: "1",
    name: "Luna",
    type: "perro",
    breed: "Golden Retriever",
    color: "Dorado",
    size: "grande",
    status: "perdido",
    location: "Plaza 9 de Julio, Salta Capital",
    date: "2024-01-15",
    description: "Muy cariñosa, lleva collar azul con placa. Responde a su nombre.",
    contact: {
      name: "María García",
      phone: "+54 387 123 4567",
      whatsapp: "+54 387 123 4567",
    },
    images: ["/golden-retriever.png"],
    distance: "0.5 km",
  },
  {
    id: "2",
    name: "Michi",
    type: "gato",
    breed: "Siamés",
    color: "Gris y blanco",
    size: "mediano",
    status: "encontrado",
    location: "Parque San Martín, Salta Capital",
    date: "2024-01-14",
    description: "Gato muy tranquilo, ojos azules. Encontrado cerca del parque.",
    contact: {
      name: "Carlos López",
      phone: "+54 387 987 6543",
    },
    images: ["/siamese-cat-gray-white.png"],
    distance: "1.2 km",
  },
  {
    id: "3",
    name: "Rocky",
    type: "perro",
    breed: "Bulldog Francés",
    color: "Negro",
    size: "pequeño",
    status: "perdido",
    location: "Centro Histórico, Salta Capital",
    date: "2024-01-13",
    description: "Muy juguetón, tiene una mancha blanca en el pecho.",
    contact: {
      name: "Ana Martín",
      phone: "+54 387 444 3333",
      whatsapp: "+54 387 444 3333",
    },
    images: ["/french-bulldog-black-white-chest.png"],
    distance: "2.1 km",
  },
]

export default function DogCatApp() {
  const [showSplash, setShowSplash] = useState(true)
  const [currentPetIndex, setCurrentPetIndex] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const [pets] = useState<Pet[]>(mockPets)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showLauncher, setShowLauncher] = useState(true)
  const [showActionButtons, setShowActionButtons] = useState(false)
  const [acceptedPet, setAcceptedPet] = useState<Pet | null>(null)
  const [showContactInfo, setShowContactInfo] = useState(false)

  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const availablePets = pets.filter((pet) => pet.status === "encontrado")

  const handleActionSelect = (action: string) => {
    setShowActionButtons(false)
    setShowContactInfo(true)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0]
    setStartPos({ x: touch.clientX, y: touch.clientY })
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const touch = e.touches[0]
    const offsetX = touch.clientX - startPos.x
    setDragOffset({ x: offsetX, y: 0 })
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setIsDragging(false)
    if (dragOffset.x > 50) {
      handleSwipe("right")
    } else if (dragOffset.x < -50) {
      handleSwipe("left")
    }
    setDragOffset({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setStartPos({ x: e.clientX, y: e.clientY })
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const offsetX = e.clientX - startPos.x
    setDragOffset({ x: offsetX, y: 0 })
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setIsDragging(false)
    if (dragOffset.x > 50) {
      handleSwipe("right")
    } else if (dragOffset.x < -50) {
      handleSwipe("left")
    }
    setDragOffset({ x: 0, y: 0 })
  }

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      const currentPet = availablePets[currentPetIndex]
      setAcceptedPet(currentPet)
      if (currentPet.status === "encontrado") {
        setShowActionButtons(true)
      } else {
        setShowContactInfo(true)
      }
    } else {
      setCurrentPetIndex((prevIndex) => (prevIndex + 1) % availablePets.length)
    }
  }

  const handleContact = (method: "phone" | "whatsapp") => {
    if (method === "phone") {
      window.open(`tel:${acceptedPet?.contact.phone}`, "_blank")
    } else if (method === "whatsapp" && acceptedPet?.contact.whatsapp) {
      window.open(`https://wa.me/${acceptedPet.contact.whatsapp}`, "_blank")
    }
  }

  const handleReportClick = (tipo: string) => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
    if (isAuthenticated) {
      window.location.href = `/reportar?tipo=${tipo}`
    } else {
      window.location.href = `/auth?redirect=${encodeURIComponent(`/reportar?tipo=${tipo}`)}`
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
      setShowLauncher(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const currentPet = availablePets[currentPetIndex]

  if (showSplash) {
    return (
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/context-welcome-background.jpeg" alt="Bienvenida DogCat" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 text-center animate-pulse">
          <div className="mb-8 animate-bounce">
            <Image
              src="/dogcat-logo.png"
              alt="DogCat"
              width={300}
              height={200}
              className="mx-auto rounded-2xl shadow-2xl"
            />
          </div>
          <h1 className="text-5xl font-bold text-white animate-fade-in drop-shadow-lg">Bienvenido</h1>
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }
        `}</style>
      </div>
    )
  }

  if (showLauncher) {
    return (
      <div
        className="min-h-screen relative"
        style={{
          backgroundImage: "url(/context-pattern-background.jpeg)",
          backgroundSize: "400px 400px",
          backgroundRepeat: "repeat",
          backgroundPosition: "0 0",
        }}
      >
        <div className="absolute inset-0 bg-white/80"></div>

        <div className="relative z-10">
          <header className="bg-card/90 backdrop-blur-sm border-b border-border p-4">
            <div className="flex items-center justify-center max-w-md mx-auto">
              <Image src="/dogcat-logo.png" alt="DogCat" width={80} height={80} className="rounded-lg" />
            </div>
          </header>

          <main className="max-w-md mx-auto p-4">
            <div className="mb-8">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-foreground mb-2">Mascotas Disponibles</h2>
                <p className="text-muted-foreground text-sm">Desliza para encontrar tu compañero perfecto</p>
              </div>

              <Button
                onClick={() => setShowLauncher(false)}
                className="w-full relative overflow-hidden h-48 p-0 hover:scale-105 transition-transform mb-4"
              >
                <div className="absolute inset-0">
                  <Image src="/context-pets-playing.jpeg" alt="Ver mascotas" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </div>
                <div className="relative z-10 text-center">
                  <Heart className="h-12 w-12 text-white mb-2 mx-auto" />
                  <h3 className="text-white font-bold text-lg mb-1">Comenzar a Explorar</h3>
                  <p className="text-white/80 text-sm">Desliza ← → para encontrar mascotas</p>
                </div>
              </Button>
            </div>

            <div className="mb-8">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Inteligencia Artificial
                </h3>
                <p className="text-muted-foreground text-sm">Encuentra coincidencias automáticamente</p>
              </div>

              <Link href="/ai-matching">
                <Card className="relative overflow-hidden h-32 cursor-pointer hover:scale-105 transition-transform mb-4 border-primary/30">
                  <div className="absolute inset-0">
                    <Image src="/context-ai-robot-match.jpeg" alt="AI Robot Background" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>
                  <CardContent className="relative z-10 p-4 h-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Brain className="h-10 w-10 text-white" />
                        <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-base mb-1">Matches con IA</h3>
                        <p className="text-white/80 text-sm">Reconocimiento automático de similitudes</p>
                      </div>
                    </div>
                    <Badge className="bg-primary text-primary-foreground animate-pulse">NUEVO</Badge>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Otras Opciones</h3>
              <p className="text-muted-foreground text-sm">¿Necesitas reportar o buscar algo específico?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card
                className="relative overflow-hidden h-32 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => handleReportClick("perdido")}
              >
                <div className="absolute inset-0">
                  <Image src="/context-lost-pets-rain.jpeg" alt="Mi mascota se perdió" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50" />
                </div>
                <CardContent className="relative z-10 p-4 h-full flex flex-col justify-center items-center text-center">
                  <h3 className="text-white font-bold text-sm mb-1">Mi mascota</h3>
                  <h3 className="text-white font-bold text-sm">se perdió</h3>
                </CardContent>
              </Card>

              <Card
                className="relative overflow-hidden h-32 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => handleReportClick("encontrado")}
              >
                <div className="absolute inset-0">
                  <Image
                    src="/context-couple-found-cat.jpeg"
                    alt="Encontré una mascota"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50" />
                </div>
                <CardContent className="relative z-10 p-4 h-full flex flex-col justify-center items-center text-center">
                  <h3 className="text-white font-bold text-sm mb-1">Encontré</h3>
                  <h3 className="text-white font-bold text-sm">una mascota</h3>
                </CardContent>
              </Card>

              <Button
                onClick={() => setShowLauncher(false)}
                className="relative overflow-hidden h-32 p-0 hover:scale-105 transition-transform mb-4"
              >
                <div className="absolute inset-0">
                  <Image src="/context-pets-playing.jpeg" alt="Ver mascotas" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative z-10 text-center">
                  <h3 className="text-white font-bold text-sm mb-1">Ver mascotas</h3>
                  <h3 className="text-white font-bold text-sm">disponibles</h3>
                </div>
              </Button>

              <Link href="/buscar">
                <Card className="relative overflow-hidden h-32 cursor-pointer hover:scale-105 transition-transform">
                  <div className="absolute inset-0">
                    <Image src="/context-adoption-interface.jpeg" alt="Buscar mascotas" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/50" />
                  </div>
                  <CardContent className="relative z-10 p-4 h-full flex flex-col justify-center items-center text-center">
                    <h3 className="text-white font-bold text-sm mb-1">Buscar</h3>
                    <h3 className="text-white font-bold text-sm">mascotas</h3>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/mapa">
                <Card className="relative overflow-hidden h-32 cursor-pointer hover:scale-105 transition-transform">
                  <div className="absolute inset-0">
                    <Image src="/context-match-found.jpeg" alt="Ver mapa" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/50" />
                  </div>
                  <CardContent className="relative z-10 p-4 h-full flex flex-col justify-center items-center text-center">
                    <h3 className="text-white font-bold text-sm mb-1">Ver mapa</h3>
                    <h3 className="text-white font-bold text-sm">de mascotas</h3>
                  </CardContent>
                </Card>
              </Link>

              <Card className="relative overflow-hidden h-32 cursor-pointer hover:scale-105 transition-transform col-span-2">
                <div className="absolute inset-0">
                  <Image src="/context-happy-reunion.jpeg" alt="Historias exitosas" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50" />
                </div>
                <CardContent className="relative z-10 p-4 h-full flex flex-col justify-center items-center text-center">
                  <h3 className="text-white font-bold text-lg mb-1">Historias exitosas</h3>
                  <p className="text-white/80 text-xs">¡Más de 1,000 reuniones felices!</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 text-center">
              <div className="mb-4">
                <Image
                  src="/context-happy-pets.jpeg"
                  alt="Mascotas felices"
                  width={200}
                  height={120}
                  className="rounded-lg mx-auto opacity-80"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Cada día ayudamos a reunir familias con sus mascotas perdidas
              </p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!currentPet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-sm mx-auto">
          <div className="mb-6">
            <Image
              src="/context-happy-pets.jpeg"
              alt="Mascotas felices esperando"
              width={300}
              height={200}
              className="rounded-lg mx-auto"
            />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">¡No hay más mascotas por ahora!</h2>
          <p className="text-muted-foreground mb-6">
            Vuelve pronto para ver nuevos reportes de mascotas perdidas y encontradas.
          </p>
          <Button onClick={() => setCurrentPetIndex(0)} className="bg-primary text-primary-foreground">
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {showContactInfo && acceptedPet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-sm w-full">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="mb-4">
                  <Image
                    src={acceptedPet.images[0] || "/placeholder.svg"}
                    alt={acceptedPet.name}
                    width={120}
                    height={120}
                    className="rounded-full mx-auto object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Información de Contacto</h3>
                <p className="text-muted-foreground text-sm">
                  {acceptedPet.status === "encontrado"
                    ? "Persona que encontró a " + acceptedPet.name
                    : "Persona que busca a " + acceptedPet.name}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <Image
                    src="/context-couple-found-cat.jpeg"
                    alt="Contacto"
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{acceptedPet.contact.name}</p>
                    <p className="text-sm text-muted-foreground">{acceptedPet.contact.phone}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => handleContact("phone")}
                    className="w-full bg-primary text-primary-foreground h-12"
                  >
                    <Phone className="h-5 w-5 mr-3" />
                    Llamar ahora
                  </Button>

                  {acceptedPet.contact.whatsapp && (
                    <Button
                      onClick={() => handleContact("whatsapp")}
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground h-12"
                    >
                      <MessageCircle className="h-5 w-5 mr-3" />
                      Enviar WhatsApp
                    </Button>
                  )}
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground text-center">
                    Reportado el {new Date(acceptedPet.date).toLocaleDateString("es-ES")} en {acceptedPet.location}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => {
                  setShowContactInfo(false)
                  setAcceptedPet(null)
                }}
                variant="ghost"
                className="w-full text-muted-foreground"
              >
                Cerrar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {showActionButtons && acceptedPet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-sm w-full">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="mb-4">
                  <Image
                    src={acceptedPet.images[0] || "/placeholder.svg"}
                    alt={acceptedPet.name}
                    width={120}
                    height={120}
                    className="rounded-full mx-auto object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">¡Te interesa {acceptedPet.name}!</h3>
                <p className="text-muted-foreground text-sm">¿Qué te gustaría hacer?</p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => handleActionSelect("adopt")}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
                >
                  <Home className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Quiero adoptarlo</div>
                    <div className="text-xs opacity-80">Darle un hogar permanente</div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleActionSelect("foster")}
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground h-12"
                >
                  <Clock className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Quiero darle tránsito</div>
                    <div className="text-xs opacity-80">Cuidado temporal</div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleActionSelect("owner")}
                  variant="outline"
                  className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground h-12"
                >
                  <AlertTriangle className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Soy su dueño 🚨</div>
                    <div className="text-xs opacity-80">¡Es mi mascota perdida!</div>
                  </div>
                </Button>
              </div>

              <Button
                onClick={() => setShowActionButtons(false)}
                variant="ghost"
                className="w-full mt-4 text-muted-foreground"
              >
                Cancelar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-sm w-full">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <Image
                  src="/context-match-found.jpeg"
                  alt="¡Conexión realizada!"
                  width={200}
                  height={150}
                  className="rounded-lg mx-auto"
                />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">¡Conexión realizada!</h3>
              <p className="text-muted-foreground">
                Hemos procesado tu solicitud. ¡Te contactaremos pronto con más información!
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLauncher(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Image src="/dogcat-logo.png" alt="DogCat" width={50} height={50} className="rounded-lg" />
          </div>
          <div className="flex gap-2">
            <Link href="/ai-matching">
              <Button
                variant="outline"
                size="icon"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                <Brain className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/mapa">
              <Button variant="outline" size="icon">
                <Map className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/buscar">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/reportar">
              <Button size="icon" className="bg-primary text-primary-foreground">
                <Plus className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4">
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">Desliza ← para pasar • Desliza → si te interesa</p>
        </div>

        <div className="relative">
          <Card
            ref={cardRef}
            className="overflow-hidden shadow-lg cursor-grab active:cursor-grabbing select-none relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
              touchAction: "none",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
          >
            <div className="swipe-overlay absolute inset-0 z-10 opacity-0 transition-opacity duration-200 flex items-center justify-center">
              <div className="text-white text-4xl font-bold">
                {dragOffset.x > 50 ? "❤️" : dragOffset.x < -50 ? "✕" : ""}
              </div>
            </div>

            <div className="relative">
              {currentPet.status === "perdido" ? (
                <div className="relative">
                  <Image
                    src={currentPet.images[0] || "/placeholder.svg"}
                    alt={currentPet.name}
                    width={400}
                    height={500}
                    className="w-full h-96 object-cover pointer-events-none"
                    draggable={false}
                  />
                  <div className="absolute top-4 right-4">
                    <div
                      className="relative rounded-lg p-2"
                      style={{
                        backgroundImage: "url(/context-lost-pets-rain.jpeg)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="absolute inset-0 bg-black/60 rounded-lg"></div>
                      <Badge className="relative z-10 bg-destructive/90 text-destructive-foreground border border-white/20">
                        PERDIDO
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <Image
                    src={currentPet.images[0] || "/placeholder.svg"}
                    alt={currentPet.name}
                    width={400}
                    height={500}
                    className="w-full h-96 object-cover pointer-events-none"
                    draggable={false}
                  />
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">ENCONTRADO</Badge>
                </div>
              )}
            </div>

            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{currentPet.name}</h2>
                  <p className="text-muted-foreground">{currentPet.breed}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Detalles
                  </Button>
                  <Link href={`/mascota/${currentPet.id}`}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-primary border-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {currentPet.location} • {currentPet.distance}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(currentPet.date).toLocaleDateString("es-ES")}</span>
                </div>
              </div>

              {showDetails && (
                <div className="space-y-4 mb-6 p-4 bg-muted rounded-lg">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Descripción</h3>
                    <p className="text-sm text-muted-foreground">{currentPet.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-foreground">Color:</span>
                      <p className="text-muted-foreground">{currentPet.color}</p>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Tamaño:</span>
                      <p className="text-muted-foreground capitalize">{currentPet.size}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Contacto</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <Image
                        src="/context-couple-found-cat.jpeg"
                        alt="Contacto disponible"
                        width={50}
                        height={40}
                        className="rounded-lg"
                      />
                      <div>
                        <p className="text-sm text-muted-foreground">{currentPet.contact.name}</p>
                        <p className="text-xs text-muted-foreground">Disponible para contacto</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleContact("phone")}
                        className="flex-1 bg-primary text-primary-foreground"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Llamar
                      </Button>
                      {currentPet.contact.whatsapp && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleContact("whatsapp")}
                          className="flex-1 text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          WhatsApp
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleSwipe("left")}
                  className="flex-1 border-muted-foreground text-muted-foreground hover:bg-muted"
                >
                  <X className="h-6 w-6 mr-2" />
                  Pasar
                </Button>
                <Button
                  size="lg"
                  onClick={() => handleSwipe("right")}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Heart className="h-6 w-6 mr-2" />
                  Me interesa
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              {currentPetIndex + 1} de {availablePets.length} mascotas
            </p>
            <div className="mt-4">
              <Image
                src="/context-happy-reunion.jpeg"
                alt="Reuniones exitosas"
                width={200}
                height={120}
                className="rounded-lg mx-auto opacity-60"
              />
              <p className="text-xs text-muted-foreground mt-2">¡Cada swipe puede ser una reunión exitosa!</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Otras Opciones</h3>
            <p className="text-muted-foreground text-sm">¿Necesitas reportar o buscar algo específico?</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card
              className="relative overflow-hidden h-32 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => handleReportClick("perdido")}
            >
              <div className="absolute inset-0">
                <Image src="/context-lost-pets-rain.jpeg" alt="Mi mascota se perdió" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/50" />
              </div>
              <CardContent className="relative z-10 p-4 h-full flex flex-col justify-center items-center text-center">
                <h3 className="text-white font-bold text-sm mb-1">Mi mascota</h3>
                <h3 className="text-white font-bold text-sm">se perdió</h3>
              </CardContent>
            </Card>

            <Card
              className="relative overflow-hidden h-32 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => handleReportClick("encontrado")}
            >
              <div className="absolute inset-0">
                <Image src="/context-couple-found-cat.jpeg" alt="Encontré una mascota" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/50" />
              </div>
              <CardContent className="relative z-10 p-4 h-full flex flex-col justify-center items-center text-center">
                <h3 className="text-white font-bold text-sm mb-1">Encontré</h3>
                <h3 className="text-white font-bold text-sm">una mascota</h3>
              </CardContent>
            </Card>

            <Link href="/ai-matching">
              <Card className="relative overflow-hidden h-32 cursor-pointer hover:scale-105 transition-transform border-primary/30">
                <div className="absolute inset-0">
                  <Image src="/context-ai-robot-match.jpeg" alt="AI Robot Background" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
                <CardContent className="relative z-10 p-4 h-full flex flex-col justify-center items-center text-center">
                  <div className="relative mb-2">
                    <Brain className="h-6 w-6 text-white" />
                    <Sparkles className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1" />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1">Matches IA</h3>
                  <p className="text-white/80 text-xs">Reconocimiento automático</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/buscar">
              <Card className="relative overflow-hidden h-32 cursor-pointer hover:scale-105 transition-transform">
                <div className="absolute inset-0">
                  <Image src="/context-adoption-interface.jpeg" alt="Buscar mascotas" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50" />
                </div>
                <CardContent className="relative z-10 p-4 h-full flex flex-col justify-center items-center text-center">
                  <h3 className="text-white font-bold text-sm mb-1">Buscar</h3>
                  <h3 className="text-white font-bold text-sm">mascotas</h3>
                </CardContent>
              </Card>
            </Link>

            <Link href="/mapa">
              <Card className="relative overflow-hidden h-32 cursor-pointer hover:scale-105 transition-transform">
                <div className="absolute inset-0">
                  <Image src="/context-match-found.jpeg" alt="Ver mapa" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50" />
                </div>
                <CardContent className="relative z-10 p-4 h-full flex flex-col justify-center items-center text-center">
                  <h3 className="text-white font-bold text-sm mb-1">Ver mapa</h3>
                  <h3 className="text-white font-bold text-sm">de mascotas</h3>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="mt-6">
            <Card className="relative overflow-hidden h-24 cursor-pointer hover:scale-105 transition-transform">
              <div className="absolute inset-0">
                <Image src="/context-happy-reunion.jpeg" alt="Historias exitosas" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/50" />
              </div>
              <CardContent className="relative z-10 p-4 h-full flex flex-col justify-center items-center text-center">
                <h3 className="text-white font-bold text-base mb-1">Historias exitosas</h3>
                <p className="text-white/80 text-xs">¡Más de 1,000 reuniones felices!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
