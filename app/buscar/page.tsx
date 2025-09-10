"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Search, MapPin, Calendar, X, SlidersHorizontal, Eye } from "lucide-react"
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

interface SearchFilters {
  query: string
  animalTypes: string[]
  status: string[]
  sizes: string[]
  dateRange: string
  location: string
}

// Extended mock data for better search demonstration
const mockPets: Pet[] = [
  {
    id: "1",
    name: "Luna",
    type: "perro",
    breed: "Golden Retriever",
    color: "Dorado",
    size: "grande",
    status: "perdido",
    location: "Parque Central, Madrid",
    date: "2024-01-15",
    description: "Muy cariñosa, lleva collar azul con placa. Responde a su nombre.",
    contact: {
      name: "María García",
      phone: "+34 666 123 456",
      whatsapp: "+34 666 123 456",
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
    location: "Calle Mayor, Barcelona",
    date: "2024-01-14",
    description: "Gato muy tranquilo, ojos azules. Encontrado cerca del mercado.",
    contact: {
      name: "Carlos López",
      phone: "+34 677 987 654",
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
    location: "Plaza España, Sevilla",
    date: "2024-01-13",
    description: "Muy juguetón, tiene una mancha blanca en el pecho.",
    contact: {
      name: "Ana Martín",
      phone: "+34 655 444 333",
      whatsapp: "+34 655 444 333",
    },
    images: ["/french-bulldog-black-white-chest.png"],
    distance: "2.1 km",
  },
  {
    id: "4",
    name: "Bella",
    type: "perro",
    breed: "Labrador",
    color: "Chocolate",
    size: "grande",
    status: "encontrado",
    location: "Parque del Retiro, Madrid",
    date: "2024-01-12",
    description: "Perra muy amigable, sin collar. Parece estar bien cuidada.",
    contact: {
      name: "Luis Fernández",
      phone: "+34 644 555 777",
    },
    images: ["/chocolate-labrador.png"],
    distance: "0.8 km",
  },
  {
    id: "5",
    name: "Whiskers",
    type: "gato",
    breed: "Persa",
    color: "Blanco",
    size: "pequeño",
    status: "perdido",
    location: "Barrio Gótico, Barcelona",
    date: "2024-01-11",
    description: "Gato persa de pelo largo, muy tímido. Lleva collar rosa.",
    contact: {
      name: "Elena Ruiz",
      phone: "+34 633 888 999",
      whatsapp: "+34 633 888 999",
    },
    images: ["/white-persian-cat.png"],
    distance: "3.5 km",
  },
]

export default function BuscarPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    animalTypes: [],
    status: [],
    sizes: [],
    dateRange: "",
    location: "",
  })
  const [showFilters, setShowFilters] = useState(false)

  const filteredPets = useMemo(() => {
    return mockPets.filter((pet) => {
      // Text search
      if (filters.query) {
        const query = filters.query.toLowerCase()
        const searchableText = `${pet.name} ${pet.breed} ${pet.color} ${pet.location} ${pet.description}`.toLowerCase()
        if (!searchableText.includes(query)) return false
      }

      // Animal type filter
      if (filters.animalTypes.length > 0 && !filters.animalTypes.includes(pet.type)) {
        return false
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(pet.status)) {
        return false
      }

      // Size filter
      if (filters.sizes.length > 0 && !filters.sizes.includes(pet.size)) {
        return false
      }

      // Location filter
      if (filters.location) {
        const locationQuery = filters.location.toLowerCase()
        if (!pet.location.toLowerCase().includes(locationQuery)) return false
      }

      // Date range filter
      if (filters.dateRange) {
        const petDate = new Date(pet.date)
        const now = new Date()
        const daysDiff = Math.floor((now.getTime() - petDate.getTime()) / (1000 * 60 * 60 * 24))

        switch (filters.dateRange) {
          case "today":
            if (daysDiff > 0) return false
            break
          case "week":
            if (daysDiff > 7) return false
            break
          case "month":
            if (daysDiff > 30) return false
            break
        }
      }

      return true
    })
  }, [filters])

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const toggleArrayFilter = (key: "animalTypes" | "status" | "sizes", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((item) => item !== value) : [...prev[key], value],
    }))
  }

  const clearFilters = () => {
    setFilters({
      query: "",
      animalTypes: [],
      status: [],
      sizes: [],
      dateRange: "",
      location: "",
    })
  }

  const hasActiveFilters =
    filters.query ||
    filters.animalTypes.length > 0 ||
    filters.status.length > 0 ||
    filters.sizes.length > 0 ||
    filters.dateRange ||
    filters.location

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
              <h1 className="text-xl font-bold text-foreground">Buscar</h1>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-primary text-primary-foreground" : ""}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, raza, color, ubicación..."
            value={filters.query}
            onChange={(e) => updateFilter("query", e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filters.status.includes("perdido") ? "default" : "outline"}
            size="sm"
            onClick={() => toggleArrayFilter("status", "perdido")}
            className={filters.status.includes("perdido") ? "bg-destructive text-destructive-foreground" : ""}
          >
            Perdidos
          </Button>
          <Button
            variant={filters.status.includes("encontrado") ? "default" : "outline"}
            size="sm"
            onClick={() => toggleArrayFilter("status", "encontrado")}
            className={filters.status.includes("encontrado") ? "bg-primary text-primary-foreground" : ""}
          >
            Encontrados
          </Button>
          <Button
            variant={filters.animalTypes.includes("perro") ? "default" : "outline"}
            size="sm"
            onClick={() => toggleArrayFilter("animalTypes", "perro")}
          >
            Perros
          </Button>
          <Button
            variant={filters.animalTypes.includes("gato") ? "default" : "outline"}
            size="sm"
            onClick={() => toggleArrayFilter("animalTypes", "gato")}
          >
            Gatos
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Filtros avanzados
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Limpiar
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Location Filter */}
              <div className="space-y-2">
                <Label>Ubicación</Label>
                <Input
                  placeholder="Ciudad, barrio, calle..."
                  value={filters.location}
                  onChange={(e) => updateFilter("location", e.target.value)}
                />
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label>Fecha</Label>
                <Select value={filters.dateRange} onValueChange={(value) => updateFilter("dateRange", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Cualquier fecha</SelectItem>
                    <SelectItem value="today">Hoy</SelectItem>
                    <SelectItem value="week">Última semana</SelectItem>
                    <SelectItem value="month">Último mes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Size Filter */}
              <div className="space-y-2">
                <Label>Tamaño</Label>
                <div className="flex gap-2 flex-wrap">
                  {["pequeño", "mediano", "grande"].map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={size}
                        checked={filters.sizes.includes(size)}
                        onCheckedChange={() => toggleArrayFilter("sizes", size)}
                      />
                      <Label htmlFor={size} className="capitalize text-sm">
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Resultados ({filteredPets.length})</h2>
            {hasActiveFilters && (
              <Badge variant="outline" className="text-primary border-primary">
                Filtros activos
              </Badge>
            )}
          </div>

          {filteredPets.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron resultados</h3>
                <p className="text-muted-foreground mb-4">
                  Intenta ajustar los filtros o cambiar los términos de búsqueda
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Limpiar filtros
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
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
                            <p className="text-xs text-muted-foreground capitalize">
                              {pet.type} • {pet.size} • {pet.color}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">{pet.distance}</span>
                        </div>

                        <div className="space-y-1 mb-3">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{pet.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(pet.date).toLocaleDateString("es-ES")}</span>
                          </div>
                        </div>

                        <Link href={`/mascota/${pet.id}`}>
                          <Button size="sm" className="w-full bg-primary text-primary-foreground">
                            <Eye className="h-3 w-3 mr-2" />
                            Ver detalles
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
