"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Calendar, Phone, MessageCircle, Mail, Share2, Heart, AlertTriangle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"

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
  lastSeen?: string
  reward?: string
  microchip?: boolean
  vaccinated?: boolean
  sterilized?: boolean
}

// Mock data - in a real app this would come from an API
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
    description:
      "Muy cariñosa, lleva collar azul con placa. Responde a su nombre. Es muy sociable con otros perros y niños.",
    contact: {
      name: "María García",
      phone: "+34 666 123 456",
      whatsapp: "+34 666 123 456",
      email: "maria.garcia@email.com",
    },
    images: ["/golden-retriever.png"],
    distance: "0.5 km",
    lastSeen: "Cerca del lago del parque, jugando con otros perros",
    reward: "200€",
    microchip: true,
    vaccinated: true,
    sterilized: false,
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
    description: "Gato muy tranquilo, ojos azules. Encontrado cerca del mercado. Parece estar bien cuidado.",
    contact: {
      name: "Carlos López",
      phone: "+34 677 987 654",
      email: "carlos.lopez@email.com",
    },
    images: ["/siamese-cat-gray-white.png"],
    distance: "1.2 km",
    microchip: false,
    vaccinated: true,
    sterilized: true,
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
    description: "Muy juguetón, tiene una mancha blanca en el pecho. Le gusta perseguir pelotas.",
    contact: {
      name: "Ana Martín",
      phone: "+34 655 444 333",
      whatsapp: "+34 655 444 333",
    },
    images: ["/french-bulldog-black-white-chest.png"],
    distance: "2.1 km",
    lastSeen: "Corriendo hacia la fuente de la plaza",
    reward: "150€",
    microchip: true,
    vaccinated: true,
    sterilized: true,
  },
]

export default function PetDetailsPage() {
  const params = useParams()
  const petId = params.id as string
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const pet = mockPets.find((p) => p.id === petId)

  if (!pet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Mascota no encontrada</h2>
          <Link href="/">
            <Button className="bg-primary text-primary-foreground">Volver al inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleContact = (method: "phone" | "whatsapp" | "email") => {
    if (method === "phone") {
      window.open(`tel:${pet.contact.phone}`)
    } else if (method === "whatsapp" && pet.contact.whatsapp) {
      const message = encodeURIComponent(`Hola, vi tu publicación sobre ${pet.name} en DogCat. ¿Podemos hablar?`)
      window.open(`https://wa.me/${pet.contact.whatsapp.replace(/[^0-9]/g, "")}?text=${message}`)
    } else if (method === "email" && pet.contact.email) {
      const subject = encodeURIComponent(`Sobre ${pet.name} - DogCat`)
      const body = encodeURIComponent(
        `Hola ${pet.contact.name},\n\nVi tu publicación sobre ${pet.name} en DogCat. Me gustaría ponerme en contacto contigo.\n\nSaludos`,
      )
      window.open(`mailto:${pet.contact.email}?subject=${subject}&body=${body}`)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${pet.name} - ${pet.status === "perdido" ? "Perdido" : "Encontrado"}`,
        text: `Ayuda a encontrar a ${pet.name}, ${pet.breed} ${pet.status} en ${pet.location}`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Enlace copiado al portapapeles")
    }
  }

  const handleInterested = () => {
    // This would typically send a notification to the pet owner
    alert(`Se ha enviado una notificación a ${pet.contact.name} indicando tu interés en ayudar.`)
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
            <h1 className="text-xl font-bold text-foreground">Detalles</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto">
        {/* Pet Images */}
        <div className="relative">
          <Image
            src={pet.images[currentImageIndex] || "/placeholder.svg"}
            alt={pet.name}
            width={400}
            height={400}
            className="w-full h-80 object-cover"
          />
          <Badge
            className={`absolute top-4 right-4 ${
              pet.status === "perdido"
                ? "bg-destructive text-destructive-foreground"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {pet.status === "perdido" ? "PERDIDO" : "ENCONTRADO"}
          </Badge>

          {pet.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {pet.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-4 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{pet.name}</h1>
                  <p className="text-lg text-muted-foreground">{pet.breed}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {pet.type} • {pet.size}
                  </p>
                </div>
                {pet.reward && (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                    Recompensa: {pet.reward}
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{pet.location}</span>
                  <span className="text-muted-foreground">• {pet.distance}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {pet.status === "perdido" ? "Perdido el" : "Encontrado el"}{" "}
                    {new Date(pet.date).toLocaleDateString("es-ES")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-3">Descripción</h3>
              <p className="text-muted-foreground leading-relaxed">{pet.description}</p>

              {pet.lastSeen && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-foreground mb-1">Última vez visto</h4>
                  <p className="text-sm text-muted-foreground">{pet.lastSeen}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pet Details */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Características</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-foreground">Color</span>
                  <p className="text-muted-foreground">{pet.color}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">Tamaño</span>
                  <p className="text-muted-foreground capitalize">{pet.size}</p>
                </div>
              </div>

              {/* Health Info */}
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-foreground">Información médica</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={pet.microchip ? "default" : "secondary"}>
                    {pet.microchip ? "Con microchip" : "Sin microchip"}
                  </Badge>
                  <Badge variant={pet.vaccinated ? "default" : "secondary"}>
                    {pet.vaccinated ? "Vacunado" : "Sin vacunar"}
                  </Badge>
                  <Badge variant={pet.sterilized ? "default" : "secondary"}>
                    {pet.sterilized ? "Esterilizado" : "No esterilizado"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Contacto</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-foreground">{pet.contact.name}</p>
                  <p className="text-sm text-muted-foreground">Publicado hace 2 días</p>
                </div>

                <div className="space-y-2">
                  <Button onClick={() => handleContact("phone")} className="w-full bg-primary text-primary-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    Llamar ahora
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    {pet.contact.whatsapp && (
                      <Button
                        variant="outline"
                        onClick={() => handleContact("whatsapp")}
                        className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                    )}
                    {pet.contact.email && (
                      <Button
                        variant="outline"
                        onClick={() => handleContact("email")}
                        className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3 pb-6">
            <Button onClick={handleInterested} className="w-full bg-primary text-primary-foreground" size="lg">
              <Heart className="h-5 w-5 mr-2" />
              {pet.status === "perdido" ? "Quiero ayudar a encontrarlo" : "Me interesa adoptarlo"}
            </Button>

            <Button
              variant="outline"
              className="w-full text-muted-foreground border-muted-foreground bg-transparent"
              size="lg"
            >
              <AlertTriangle className="h-5 w-5 mr-2" />
              Reportar problema
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
