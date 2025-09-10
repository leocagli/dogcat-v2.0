"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sparkles, Eye, MessageCircle, Phone, Zap, Brain } from "lucide-react"
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
    email?: string
  }
  images: string[]
  distance: string
  aiSimilarity?: number
  aiFeatures?: string[]
}

interface AIMatch {
  lostPet: Pet
  foundPet: Pet
  similarity: number
  matchedFeatures: string[]
  confidence: "alta" | "media" | "baja"
}

// Mock AI-powered matches
const mockAIMatches: AIMatch[] = [
  {
    lostPet: {
      id: "1",
      name: "Luna",
      type: "perro",
      breed: "Golden Retriever",
      color: "Dorado",
      size: "grande",
      status: "perdido",
      location: "Parque Central, Madrid",
      date: "2024-01-15",
      description: "Muy cariñosa, lleva collar azul con placa.",
      contact: { name: "María García", phone: "+34 666 123 456" },
      images: ["/golden-retriever.png"],
      distance: "0.5 km",
      aiSimilarity: 94,
    },
    foundPet: {
      id: "4",
      name: "Bella",
      type: "perro",
      breed: "Labrador",
      color: "Chocolate",
      size: "grande",
      status: "encontrado",
      location: "Parque del Retiro, Madrid",
      date: "2024-01-12",
      description: "Perra muy amigable, sin collar.",
      contact: { name: "Luis Fernández", phone: "+34 644 555 777" },
      images: ["/chocolate-labrador.png"],
      distance: "0.8 km",
      aiSimilarity: 94,
    },
    similarity: 94,
    matchedFeatures: ["Tamaño grande", "Raza similar (Retriever/Labrador)", "Ubicación cercana", "Fecha compatible"],
    confidence: "alta",
  },
  {
    lostPet: {
      id: "5",
      name: "Whiskers",
      type: "gato",
      breed: "Persa",
      color: "Blanco",
      size: "pequeño",
      status: "perdido",
      location: "Barrio Gótico, Barcelona",
      date: "2024-01-11",
      description: "Gato persa de pelo largo, muy tímido.",
      contact: { name: "Elena Ruiz", phone: "+34 633 888 999" },
      images: ["/white-persian-cat.png"],
      distance: "3.5 km",
      aiSimilarity: 87,
    },
    foundPet: {
      id: "2",
      name: "Michi",
      type: "gato",
      breed: "Siamés",
      color: "Gris y blanco",
      size: "mediano",
      status: "encontrado",
      location: "Calle Mayor, Barcelona",
      date: "2024-01-14",
      description: "Gato muy tranquilo, ojos azules.",
      contact: { name: "Carlos López", phone: "+34 677 987 654" },
      images: ["/siamese-cat-gray-white.png"],
      distance: "1.2 km",
      aiSimilarity: 87,
    },
    similarity: 87,
    matchedFeatures: ["Mismo tipo (gato)", "Colores compatibles", "Tamaño similar", "Misma ciudad"],
    confidence: "alta",
  },
  {
    lostPet: {
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
      contact: { name: "Ana Martín", phone: "+34 655 444 333" },
      images: ["/french-bulldog-black-white-chest.png"],
      distance: "2.1 km",
      aiSimilarity: 76,
    },
    foundPet: {
      id: "6",
      name: "Desconocido",
      type: "perro",
      breed: "Mestizo pequeño",
      color: "Negro y blanco",
      size: "pequeño",
      status: "encontrado",
      location: "Centro, Sevilla",
      date: "2024-01-14",
      description: "Perro pequeño encontrado, muy cariñoso.",
      contact: { name: "Pedro Sánchez", phone: "+34 622 111 222" },
      images: ["/placeholder.svg?height=200&width=200"],
      distance: "1.5 km",
      aiSimilarity: 76,
    },
    similarity: 76,
    matchedFeatures: ["Tamaño pequeño", "Color negro y blanco", "Misma ciudad", "Fechas cercanas"],
    confidence: "media",
  },
]

export default function AIMatchingPage() {
  const [matches, setMatches] = useState<AIMatch[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [selectedMatch, setSelectedMatch] = useState<AIMatch | null>(null)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        console.log("[v0] Fetching AI matches from API")

        // In a real app, you would get the current user's pets or a specific pet ID
        // For demo purposes, we'll use a mock pet ID
        const response = await fetch("/api/matches?petId=1&minSimilarity=70")

        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Received matches:", data.matches?.length || 0)
          setMatches(data.matches || [])
        } else {
          console.error("[v0] Failed to fetch matches:", response.statusText)
          // Fallback to mock data if API fails
          setMatches(mockAIMatches)
        }
      } catch (error) {
        console.error("[v0] Error fetching matches:", error)
        // Fallback to mock data if API fails
        setMatches(mockAIMatches)
      } finally {
        setIsAnalyzing(false)
      }
    }

    // Simulate AI analysis time
    const timer = setTimeout(fetchMatches, 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleContact = (pet: Pet, method: "phone" | "whatsapp") => {
    if (method === "phone") {
      window.open(`tel:${pet.contact.phone}`)
    } else if (method === "whatsapp" && pet.contact.whatsapp) {
      const message = encodeURIComponent(
        `Hola, la IA de DogCat sugiere que podríamos tener un match sobre ${pet.name}. ¿Podemos hablar?`,
      )
      window.open(`https://wa.me/${pet.contact.whatsapp.replace(/[^0-9]/g, "")}?text=${message}`)
    }
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "alta":
        return "bg-green-500 text-white"
      case "media":
        return "bg-yellow-500 text-white"
      case "baja":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  if (isAnalyzing) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 relative"
        style={{
          backgroundImage: "url(/context-ai-robot-match.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Background overlay for better readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        <Card className="max-w-sm w-full relative z-10 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="relative">
                <Brain className="h-16 w-16 text-primary mx-auto animate-pulse" />
                <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-4">Analizando con IA</h2>
            <p className="text-muted-foreground mb-4">
              Nuestro sistema de inteligencia artificial está comparando características visuales, ubicaciones y
              patrones para encontrar posibles coincidencias...
            </p>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: "75%" }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Procesando imágenes y datos...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (selectedMatch) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center gap-3 max-w-md mx-auto">
            <Button variant="ghost" size="icon" onClick={() => setSelectedMatch(null)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Match Detallado</h1>
            </div>
          </div>
        </header>

        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Similarity Score */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <div className="text-4xl font-bold text-primary">{selectedMatch.similarity}%</div>
                <p className="text-muted-foreground">Similitud detectada por IA</p>
              </div>
              <Badge className={getConfidenceColor(selectedMatch.confidence)}>
                Confianza {selectedMatch.confidence}
              </Badge>
            </CardContent>
          </Card>

          {/* Matched Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Características Coincidentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedMatch.matchedFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pet Comparison */}
          <div className="grid grid-cols-2 gap-4">
            {/* Lost Pet */}
            <Card>
              <CardHeader className="pb-3">
                <Badge className="bg-destructive text-destructive-foreground w-fit">PERDIDO</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <Image
                  src={selectedMatch.lostPet.images[0] || "/placeholder.svg"}
                  alt={selectedMatch.lostPet.name}
                  width={150}
                  height={120}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold">{selectedMatch.lostPet.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedMatch.lostPet.breed}</p>
                  <p className="text-xs text-muted-foreground">{selectedMatch.lostPet.location}</p>
                </div>
                <Button size="sm" className="w-full" onClick={() => handleContact(selectedMatch.lostPet, "phone")}>
                  <Phone className="h-3 w-3 mr-2" />
                  Contactar
                </Button>
              </CardContent>
            </Card>

            {/* Found Pet */}
            <Card>
              <CardHeader className="pb-3">
                <Badge className="bg-primary text-primary-foreground w-fit">ENCONTRADO</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <Image
                  src={selectedMatch.foundPet.images[0] || "/placeholder.svg"}
                  alt={selectedMatch.foundPet.name}
                  width={150}
                  height={120}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold">{selectedMatch.foundPet.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedMatch.foundPet.breed}</p>
                  <p className="text-xs text-muted-foreground">{selectedMatch.foundPet.location}</p>
                </div>
                <Button size="sm" className="w-full" onClick={() => handleContact(selectedMatch.foundPet, "phone")}>
                  <Phone className="h-3 w-3 mr-2" />
                  Contactar
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full bg-primary text-primary-foreground" size="lg">
              <MessageCircle className="h-5 w-5 mr-2" />
              Conectar a ambas personas
            </Button>
            <Button variant="outline" className="w-full bg-transparent" size="lg">
              No es el mismo animal
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Matches IA</h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Hero Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <div className="relative inline-block">
                <Brain className="h-12 w-12 text-primary" />
                <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-foreground mb-2">Reconocimiento Inteligente</h2>
            <p className="text-sm text-muted-foreground">
              Nuestra IA analiza características visuales, ubicaciones y patrones para encontrar posibles coincidencias
              entre mascotas perdidas y encontradas.
            </p>
          </CardContent>
        </Card>

        {/* Matches Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Posibles Coincidencias</h3>
            <Badge variant="outline" className="text-primary border-primary">
              {matches.length} matches
            </Badge>
          </div>

          {matches.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No hay matches disponibles</h3>
                <p className="text-muted-foreground">
                  La IA no ha encontrado coincidencias significativas en este momento. Revisa más tarde o reporta más
                  mascotas para mejorar el análisis.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {matches.map((match, index) => (
                <Card
                  key={index}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedMatch(match)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={getConfidenceColor(match.confidence)}>{match.similarity}% similitud</Badge>
                      <Badge variant="outline">Confianza {match.confidence}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {/* Lost Pet */}
                      <div className="space-y-2">
                        <Badge className="bg-destructive text-destructive-foreground text-xs">PERDIDO</Badge>
                        <Image
                          src={match.lostPet.images[0] || "/placeholder.svg"}
                          alt={match.lostPet.name}
                          width={120}
                          height={80}
                          className="w-full h-16 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-sm">{match.lostPet.name}</p>
                          <p className="text-xs text-muted-foreground">{match.lostPet.breed}</p>
                        </div>
                      </div>

                      {/* Found Pet */}
                      <div className="space-y-2">
                        <Badge className="bg-primary text-primary-foreground text-xs">ENCONTRADO</Badge>
                        <Image
                          src={match.foundPet.images[0] || "/placeholder.svg"}
                          alt={match.foundPet.name}
                          width={120}
                          height={80}
                          className="w-full h-16 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-sm">{match.foundPet.name}</p>
                          <p className="text-xs text-muted-foreground">{match.foundPet.breed}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-foreground">Características coincidentes:</p>
                      <div className="flex flex-wrap gap-1">
                        {match.matchedFeatures.slice(0, 2).map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {match.matchedFeatures.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{match.matchedFeatures.length - 2} más
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button className="w-full mt-3" size="sm">
                      <Eye className="h-3 w-3 mr-2" />
                      Ver detalles del match
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* How it works */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">¿Cómo funciona la IA?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-xs font-bold">1</span>
              </div>
              <div>
                <p className="text-sm font-medium">Análisis visual</p>
                <p className="text-xs text-muted-foreground">Reconoce raza, color, tamaño y características físicas</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-xs font-bold">2</span>
              </div>
              <div>
                <p className="text-sm font-medium">Geolocalización</p>
                <p className="text-xs text-muted-foreground">Compara ubicaciones y fechas de pérdida/encuentro</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-xs font-bold">3</span>
              </div>
              <div>
                <p className="text-sm font-medium">Puntuación de similitud</p>
                <p className="text-xs text-muted-foreground">
                  Calcula probabilidad de coincidencia basada en todos los factores
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
