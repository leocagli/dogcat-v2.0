"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Locate, List, Navigation } from "lucide-react"
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
  coordinates: {
    lat: number
    lng: number
  }
}

// Mock data with coordinates for demonstration
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
    coordinates: { lat: -24.7859, lng: -65.4117 }, // Plaza 9 de Julio, Salta
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
    coordinates: { lat: -24.7947, lng: -65.4089 }, // Parque San Martín, Salta
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
    coordinates: { lat: -24.7821, lng: -65.4232 }, // Centro Histórico, Salta
  },
]

export default function MapaPage() {
  const [pets] = useState<Pet[]>(mockPets)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [viewMode, setViewMode] = useState<"map" | "list">("map")
  const [filter, setFilter] = useState<"todos" | "perdidos" | "encontrados">("todos")

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.log("Error getting location:", error)
          // Default to Salta Capital if location access is denied
          setUserLocation({ lat: -24.7859, lng: -65.4117 })
        },
      )
    } else {
      // Default to Salta Capital if geolocation is not supported
      setUserLocation({ lat: -24.7859, lng: -65.4117 })
    }
  }, [])

  const filteredPets = pets.filter((pet) => {
    if (filter === "todos") return true
    return pet.status === filter.slice(0, -1) // Remove 's' from 'perdidos'/'encontrados'
  })

  const handlePetClick = (pet: Pet) => {
    setSelectedPet(pet)
  }

  const handleGetDirections = (pet: Pet) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${pet.coordinates.lat},${pet.coordinates.lng}`
      window.open(url, "_blank")
    } else {
      const url = `https://www.google.com/maps/search/${encodeURIComponent(pet.location)}`
      window.open(url, "_blank")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Image src="/dogcat-logo.png" alt="DogCat Logo" width={32} height={32} className="rounded-lg" />
              <h1 className="text-xl font-bold text-foreground">Mapa</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode(viewMode === "map" ? "list" : "map")}
            >
              {viewMode === "map" ? <List className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-md mx-auto p-4">
        <div className="flex gap-2 mb-4">
          <Button
            variant={filter === "todos" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("todos")}
            className={filter === "todos" ? "bg-primary text-primary-foreground" : ""}
          >
            Todos ({pets.length})
          </Button>
          <Button
            variant={filter === "perdidos" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("perdidos")}
            className={filter === "perdidos" ? "bg-destructive text-destructive-foreground" : ""}
          >
            Perdidos ({pets.filter((p) => p.status === "perdido").length})
          </Button>
          <Button
            variant={filter === "encontrados" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("encontrados")}
            className={filter === "encontrados" ? "bg-primary text-primary-foreground" : ""}
          >
            Encontrados ({pets.filter((p) => p.status === "encontrado").length})
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4">
        {viewMode === "map" ? (
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="relative bg-muted h-80">
                {userLocation ? (
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${userLocation.lng - 0.01},${userLocation.lat - 0.01},${userLocation.lng + 0.01},${userLocation.lat + 0.01}&layer=mapnik&marker=${userLocation.lat},${userLocation.lng}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    className="rounded-lg"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground mb-4">Cargando mapa...</p>
                      <p className="text-sm text-muted-foreground">Ubicación: Salta Capital, Argentina</p>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 pointer-events-none">
                  {filteredPets.map((pet, index) => (
                    <button
                      key={pet.id}
                      onClick={() => handlePetClick(pet)}
                      className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg pointer-events-auto border-2 border-white transition-transform hover:scale-110 ${
                        pet.status === "perdido" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                      }`}
                      style={{
                        left: `${20 + ((index * 25) % 60)}%`,
                        top: `${15 + ((index * 20) % 70)}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      title={`${pet.name} - ${pet.status}`}
                    >
                      {pet.type === "perro" ? "🐕" : pet.type === "gato" ? "🐱" : "🐾"}
                    </button>
                  ))}

                  {userLocation && (
                    <div
                      className="absolute w-6 h-6 bg-blue-500 rounded-full border-3 border-white shadow-lg animate-pulse"
                      style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
                      title="Tu ubicación"
                    />
                  )}
                </div>
              </div>
            </Card>

            {/* Location Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm">
                  <Locate className="h-4 w-4 text-primary" />
                  <span className="text-foreground">
                    {userLocation
                      ? "Salta Capital, Argentina - Ubicación detectada"
                      : "Activar ubicación para mejores resultados"}
                  </span>
                </div>
                {!userLocation && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-primary border-primary bg-transparent"
                    onClick={() => window.location.reload()}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Activar ubicación
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* List View */
          <div className="space-y-4 pb-6">
            {filteredPets.map((pet) => (
              <Card key={pet.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="relative w-24 h-24">
                      <Image src={pet.images[0] || "/placeholder.svg"} alt={pet.name} fill className="object-cover" />
                      <Badge
                        className={`absolute top-1 right-1 text-xs ${
                          pet.status === "perdido"
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {pet.status === "perdido" ? "P" : "E"}
                      </Badge>
                    </div>

                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{pet.name}</h3>
                          <p className="text-sm text-muted-foreground">{pet.breed}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{pet.distance}</span>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                        <MapPin className="h-3 w-3" />
                        <span>{pet.location}</span>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/mascota/${pet.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
                            Ver detalles
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGetDirections(pet)}
                          className="text-xs text-primary border-primary"
                        >
                          <Navigation className="h-3 w-3 mr-1" />
                          Ir
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredPets.length === 0 && (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No hay mascotas {filter === "todos" ? "" : filter}
                </h3>
                <p className="text-muted-foreground">Intenta cambiar los filtros o revisa más tarde</p>
              </div>
            )}
          </div>
        )}

        {/* Selected Pet Modal */}
        {selectedPet && (
          <div className="fixed inset-0 bg-black/50 flex items-end z-50" onClick={() => setSelectedPet(null)}>
            <Card
              className="w-full max-w-md mx-auto mb-0 rounded-t-lg rounded-b-none"
              onClick={(e) => e.stopPropagation()}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Image
                    src={selectedPet.images[0] || "/placeholder.svg"}
                    alt={selectedPet.name}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{selectedPet.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedPet.breed}</p>
                      </div>
                      <Badge
                        className={
                          selectedPet.status === "perdido"
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-primary text-primary-foreground"
                        }
                      >
                        {selectedPet.status === "perdido" ? "PERDIDO" : "ENCONTRADO"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {selectedPet.location} • {selectedPet.distance}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/mascota/${selectedPet.id}`} className="flex-1">
                        <Button size="sm" className="w-full bg-primary text-primary-foreground">
                          Ver detalles
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGetDirections(selectedPet)}
                        className="text-primary border-primary"
                      >
                        <Navigation className="h-4 w-4 mr-1" />
                        Cómo llegar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
