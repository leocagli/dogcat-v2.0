"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, MessageCircle, ArrowLeft, Heart, Home } from "lucide-react"
import Link from "next/link"

interface PetData {
  name: string
  type: string
  breed: string
  color: string
  size: string
  owner: string
  phone: string
  whatsapp?: string
  medical?: string
  notes?: string
}

export default function PetProfilePage() {
  const searchParams = useSearchParams()
  const [petData, setPetData] = useState<PetData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Extract pet data from URL parameters
    const data: PetData = {
      name: searchParams.get("name") || "Mascota",
      type: searchParams.get("type") || "perro",
      breed: searchParams.get("breed") || "",
      color: searchParams.get("color") || "",
      size: searchParams.get("size") || "",
      owner: searchParams.get("owner") || "",
      phone: searchParams.get("phone") || "",
      whatsapp: searchParams.get("whatsapp") || "",
      medical: searchParams.get("medical") || "",
      notes: searchParams.get("notes") || "",
    }

    setPetData(data)
    setLoading(false)
  }, [searchParams])

  const handleContact = (method: "phone" | "whatsapp") => {
    if (!petData) return

    if (method === "phone" && petData.phone) {
      window.open(`tel:${petData.phone}`, "_blank")
    } else if (method === "whatsapp" && petData.whatsapp) {
      const message = `Hola! Encontré a ${petData.name}. ¿Podrías confirmar si es tu mascota?`
      window.open(`https://wa.me/${petData.whatsapp}?text=${encodeURIComponent(message)}`, "_blank")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando información de la mascota...</p>
        </div>
      </div>
    )
  }

  if (!petData || !petData.name || !petData.owner || !petData.phone) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-6">
            <div className="mb-4">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❌</span>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Información incompleta</h2>
              <p className="text-muted-foreground text-sm">
                El código QR no contiene toda la información necesaria para contactar al dueño de esta mascota.
              </p>
            </div>
            <Link href="/">
              <Button className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getTypeEmoji = (type: string) => {
    switch (type.toLowerCase()) {
      case "perro":
        return "🐕"
      case "gato":
        return "🐱"
      default:
        return "🐾"
    }
  }

  const getSizeText = (size: string) => {
    switch (size.toLowerCase()) {
      case "pequeño":
        return "Pequeño"
      case "mediano":
        return "Mediano"
      case "grande":
        return "Grande"
      default:
        return size
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getTypeEmoji(petData.type)}</span>
            <h1 className="font-bold text-foreground">Información de Mascota</h1>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4">
        <div className="space-y-6">
          {/* Hero Section */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 text-center">
              <div className="text-6xl mb-4">{getTypeEmoji(petData.type)}</div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{petData.name}</h1>
              <Badge variant="secondary" className="text-sm">
                <Heart className="h-3 w-3 mr-1" />
                Mascota con familia
              </Badge>
            </div>
          </Card>

          {/* Pet Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">📋</span>
                Detalles de la mascota
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                  <p className="text-foreground capitalize">{petData.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tamaño</label>
                  <p className="text-foreground">{getSizeText(petData.size)}</p>
                </div>
              </div>

              {petData.breed && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Raza</label>
                  <p className="text-foreground">{petData.breed}</p>
                </div>
              )}

              {petData.color && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Color</label>
                  <p className="text-foreground">{petData.color}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Owner Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Información del dueño
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                <p className="text-foreground font-medium">{petData.owner}</p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => handleContact("phone")}
                  className="w-full bg-primary text-primary-foreground"
                  size="lg"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Llamar: {petData.phone}
                </Button>

                {petData.whatsapp && (
                  <Button
                    onClick={() => handleContact("whatsapp")}
                    variant="outline"
                    className="w-full text-green-600 border-green-600 hover:bg-green-50"
                    size="lg"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    WhatsApp: {petData.whatsapp}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Medical Info */}
          {petData.medical && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">🏥</span>
                  Información médica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{petData.medical}</p>
              </CardContent>
            </Card>
          )}

          {/* Special Notes */}
          {petData.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">📝</span>
                  Notas especiales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{petData.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Call to Action */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="text-center p-6">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">¡Ayuda a {petData.name} a volver a casa!</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Si encontraste a esta mascota, por favor contacta a su familia usando la información de arriba.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => handleContact("phone")} className="flex-1 bg-primary text-primary-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar ahora
                </Button>
                {petData.whatsapp && (
                  <Button onClick={() => handleContact("whatsapp")} variant="outline" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
