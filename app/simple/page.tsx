"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, QrCode, Phone, MessageCircle, MapPin, Calendar, Download, Printer as Print } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import * as QRCode from "qrcode"

interface Pet {
  id: string
  name: string
  type: "perro" | "gato" | "otro"
  breed: string
  color: string
  size: "pequeño" | "mediano" | "grande"
  status: "encontrado"
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

interface PetProfile {
  name: string
  type: "perro" | "gato" | "otro"
  breed: string
  color: string
  size: "pequeño" | "mediano" | "grande"
  ownerName: string
  ownerPhone: string
  ownerWhatsapp?: string
  medicalInfo?: string
  specialNotes?: string
}

// Mock data - only found pets
const foundPets: Pet[] = [
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
    id: "4",
    name: "Chocolate",
    type: "perro",
    breed: "Labrador",
    color: "Marrón",
    size: "grande",
    status: "encontrado",
    location: "Barrio Norte, Salta Capital",
    date: "2024-01-12",
    description: "Perro muy amigable, bien cuidado. Parece tener dueño.",
    contact: {
      name: "Laura Fernández",
      phone: "+54 387 555 7777",
      whatsapp: "+54 387 555 7777",
    },
    images: ["/chocolate-labrador.png"],
    distance: "0.8 km",
  },
]

export default function SimpleModeApp() {
  const [pets, setPets] = useState<Pet[]>(foundPets)
  const [filteredPets, setFilteredPets] = useState<Pet[]>(foundPets)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [sizeFilter, setSizeFilter] = useState<string>("all")
  const [showQRGenerator, setShowQRGenerator] = useState(false)
  const [petProfile, setPetProfile] = useState<PetProfile>({
    name: "",
    type: "perro",
    breed: "",
    color: "",
    size: "mediano",
    ownerName: "",
    ownerPhone: "",
    ownerWhatsapp: "",
    medicalInfo: "",
    specialNotes: "",
  })
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")

  useEffect(() => {
    let filtered = pets

    if (searchTerm) {
      filtered = filtered.filter(
        (pet) =>
          pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((pet) => pet.type === typeFilter)
    }

    if (sizeFilter !== "all") {
      filtered = filtered.filter((pet) => pet.size === sizeFilter)
    }

    setFilteredPets(filtered)
  }, [pets, searchTerm, typeFilter, sizeFilter])

  const generateQRCode = async () => {
    const petData = {
      name: petProfile.name,
      type: petProfile.type,
      breed: petProfile.breed,
      color: petProfile.color,
      size: petProfile.size,
      owner: petProfile.ownerName,
      phone: petProfile.ownerPhone,
      whatsapp: petProfile.ownerWhatsapp,
      medical: petProfile.medicalInfo,
      notes: petProfile.specialNotes,
      url: `https://dogcat.app/pet/${petProfile.name.toLowerCase().replace(/\s+/g, "-")}`,
    }

    const qrText = `🐕 ${petData.name}
📱 ${petData.phone}
👤 ${petData.owner}
🏠 Si me encuentras, por favor contacta a mi familia
🌐 ${petData.url}`

    try {
      const qrDataUrl = await QRCode.toDataURL(qrText, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
      setQrCodeUrl(qrDataUrl)
    } catch (error) {
      console.error("Error generating QR code:", error)
    }
  }

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a")
      link.download = `qr-${petProfile.name.toLowerCase().replace(/\s+/g, "-")}.png`
      link.href = qrCodeUrl
      link.click()
    }
  }

  const printQRCode = () => {
    if (qrCodeUrl) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>QR Code - ${petProfile.name}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  text-align: center; 
                  padding: 20px;
                }
                .qr-container {
                  border: 2px solid #000;
                  padding: 20px;
                  margin: 20px auto;
                  max-width: 400px;
                }
                .pet-info {
                  margin-bottom: 20px;
                }
                img {
                  max-width: 300px;
                }
              </style>
            </head>
            <body>
              <div class="qr-container">
                <div class="pet-info">
                  <h2>${petProfile.name}</h2>
                  <p><strong>Raza:</strong> ${petProfile.breed}</p>
                  <p><strong>Dueño:</strong> ${petProfile.ownerName}</p>
                  <p><strong>Teléfono:</strong> ${petProfile.ownerPhone}</p>
                </div>
                <img src="${qrCodeUrl}" alt="QR Code" />
                <p><small>Escanea este código para contactar a mi familia</small></p>
              </div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const handleContact = (pet: Pet, method: "phone" | "whatsapp") => {
    if (method === "phone") {
      window.open(`tel:${pet.contact.phone}`, "_blank")
    } else if (method === "whatsapp" && pet.contact.whatsapp) {
      window.open(`https://wa.me/${pet.contact.whatsapp}`, "_blank")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Image src="/dogcat-logo.png" alt="DogCat" width={40} height={40} className="rounded-lg" />
            <div>
              <h1 className="font-bold text-foreground">Modo Simple</h1>
              <p className="text-xs text-muted-foreground">Mascotas encontradas</p>
            </div>
          </div>
          <Dialog open={showQRGenerator} onOpenChange={setShowQRGenerator}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">
                <QrCode className="h-4 w-4 mr-2" />
                Generar QR
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Generar QR para Collar</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nombre</label>
                    <Input
                      value={petProfile.name}
                      onChange={(e) => setPetProfile({ ...petProfile, name: e.target.value })}
                      placeholder="Nombre de la mascota"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tipo</label>
                    <Select
                      value={petProfile.type}
                      onValueChange={(value: "perro" | "gato" | "otro") =>
                        setPetProfile({ ...petProfile, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="perro">Perro</SelectItem>
                        <SelectItem value="gato">Gato</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Raza</label>
                    <Input
                      value={petProfile.breed}
                      onChange={(e) => setPetProfile({ ...petProfile, breed: e.target.value })}
                      placeholder="Raza"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Color</label>
                    <Input
                      value={petProfile.color}
                      onChange={(e) => setPetProfile({ ...petProfile, color: e.target.value })}
                      placeholder="Color"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Tamaño</label>
                  <Select
                    value={petProfile.size}
                    onValueChange={(value: "pequeño" | "mediano" | "grande") =>
                      setPetProfile({ ...petProfile, size: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pequeño">Pequeño</SelectItem>
                      <SelectItem value="mediano">Mediano</SelectItem>
                      <SelectItem value="grande">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nombre del dueño</label>
                    <Input
                      value={petProfile.ownerName}
                      onChange={(e) => setPetProfile({ ...petProfile, ownerName: e.target.value })}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Teléfono</label>
                    <Input
                      value={petProfile.ownerPhone}
                      onChange={(e) => setPetProfile({ ...petProfile, ownerPhone: e.target.value })}
                      placeholder="+54 387 123 4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">WhatsApp (opcional)</label>
                  <Input
                    value={petProfile.ownerWhatsapp}
                    onChange={(e) => setPetProfile({ ...petProfile, ownerWhatsapp: e.target.value })}
                    placeholder="+54 387 123 4567"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Información médica (opcional)</label>
                  <Input
                    value={petProfile.medicalInfo}
                    onChange={(e) => setPetProfile({ ...petProfile, medicalInfo: e.target.value })}
                    placeholder="Medicamentos, alergias, etc."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Notas especiales (opcional)</label>
                  <Input
                    value={petProfile.specialNotes}
                    onChange={(e) => setPetProfile({ ...petProfile, specialNotes: e.target.value })}
                    placeholder="Comportamiento, miedos, etc."
                  />
                </div>

                <Button onClick={generateQRCode} className="w-full bg-primary text-primary-foreground">
                  Generar Código QR
                </Button>

                {qrCodeUrl && (
                  <div className="text-center space-y-4">
                    <div className="p-4 bg-white rounded-lg inline-block">
                      <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="mx-auto" />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={downloadQRCode} variant="outline" className="flex-1 bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                      </Button>
                      <Button onClick={printQRCode} variant="outline" className="flex-1 bg-transparent">
                        <Print className="h-4 w-4 mr-2" />
                        Imprimir
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Pega este QR en el collar de tu mascota para facilitar su recuperación
                    </p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre, raza o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="perro">Perros</SelectItem>
                  <SelectItem value="gato">Gatos</SelectItem>
                  <SelectItem value="otro">Otros</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sizeFilter} onValueChange={setSizeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Tamaño" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pequeño">Pequeño</SelectItem>
                  <SelectItem value="mediano">Mediano</SelectItem>
                  <SelectItem value="grande">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-foreground mb-2">Mascotas Encontradas</h2>
            <p className="text-muted-foreground text-sm">
              {filteredPets.length} mascota{filteredPets.length !== 1 ? "s" : ""} esperando ser reunida
              {filteredPets.length !== 1 ? "s" : ""} con su familia
            </p>
          </div>
        </div>

        {filteredPets.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <Image
                src="/context-happy-pets.jpeg"
                alt="No hay mascotas"
                width={200}
                height={150}
                className="rounded-lg mx-auto opacity-60"
              />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron mascotas</h3>
            <p className="text-muted-foreground">
              Intenta ajustar los filtros o vuelve más tarde para ver nuevos reportes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet) => (
              <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={pet.images[0] || "/placeholder.svg"}
                    alt={pet.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">ENCONTRADO</Badge>
                </div>
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-foreground">{pet.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {pet.breed} • {pet.color}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{pet.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(pet.date).toLocaleDateString("es-ES")}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{pet.description}</p>

                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Encontrado por: {pet.contact.name}</div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleContact(pet, "phone")}
                        className="flex-1 bg-primary text-primary-foreground"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Llamar
                      </Button>
                      {pet.contact.whatsapp && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleContact(pet, "whatsapp")}
                          className="flex-1 text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          WhatsApp
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="mb-6">
            <Image
              src="/context-happy-reunion.jpeg"
              alt="Reuniones exitosas"
              width={300}
              height={200}
              className="rounded-lg mx-auto opacity-80"
            />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">¿Tienes una mascota?</h3>
          <p className="text-muted-foreground mb-4">
            Genera un código QR para su collar y facilita su recuperación en caso de que se pierda
          </p>
          <Button onClick={() => setShowQRGenerator(true)} className="bg-primary text-primary-foreground">
            <QrCode className="h-4 w-4 mr-2" />
            Crear QR para mi mascota
          </Button>
        </div>
      </main>
    </div>
  )
}
