"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Camera, MapPin, Calendar, Phone, Mail, MessageCircle, Brain, Sparkles, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ImageAnalyzer } from "@/components/image-analyzer"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth/auth-guard"

interface ReportForm {
  status: "perdido" | "encontrado" | ""
  animalType: "perro" | "gato" | "otro" | ""
  customAnimalType?: string
  name: string
  breed: string
  color: string
  size: "pequeño" | "mediano" | "grande" | ""
  description: string
  location: string
  date: string
  contactName: string
  contactPhone: string
  contactWhatsapp: string
  contactEmail: string
  images: File[]
  aiFeatures?: any // Added AI analysis results
}

function ReportarPageContent() {
  const [form, setForm] = useState<ReportForm>({
    status: "",
    animalType: "",
    name: "",
    breed: "",
    color: "",
    size: "",
    description: "",
    location: "",
    date: "",
    contactName: "",
    contactPhone: "",
    contactWhatsapp: "",
    contactEmail: "",
    images: [],
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [aiMatches, setAiMatches] = useState<any[]>([]) // Added AI matches state
  const [showAiMatches, setShowAiMatches] = useState(false) // Added AI matches display state
  const totalSteps = 4
  const router = useRouter()

  const handleInputChange = (field: keyof ReportForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)
      setForm((prev) => ({ ...prev, images: [...prev.images, ...newImages] }))
    }
  }

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleAiAnalysisComplete = (features: any) => {
    console.log("[v0] AI analysis completed:", features)

    // Auto-fill form fields based on AI analysis
    if (features.breed && !form.breed) {
      setForm((prev) => ({ ...prev, breed: features.breed }))
    }
    if (features.color && !form.color) {
      setForm((prev) => ({ ...prev, color: features.color }))
    }
    if (features.size && !form.size) {
      setForm((prev) => ({ ...prev, size: features.size }))
    }

    // Store AI features for matching
    setForm((prev) => ({ ...prev, aiFeatures: features }))

    // Search for potential matches
    searchForMatches(features)
  }

  const searchForMatches = async (features: any) => {
    try {
      console.log("[v0] Searching for AI matches...")

      // Create a mock pet ID for the search (in real app, this would be the actual pet being reported)
      const mockPetId = form.status === "perdido" ? "1" : "4"

      const response = await fetch(`/api/matches?petId=${mockPetId}&minSimilarity=70`)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Found AI matches:", data.matches?.length || 0)
        setAiMatches(data.matches || [])

        if (data.matches && data.matches.length > 0) {
          setShowAiMatches(true)
        }
      }
    } catch (error) {
      console.error("[v0] Error searching for matches:", error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

    if (!isAuthenticated) {
      // Save form data temporarily
      localStorage.setItem("pendingReport", JSON.stringify(form))
      localStorage.setItem("returnTo", "/reportar?step=publish")

      // Redirect to authentication
      router.push("/auth")
      return
    }

    // User is authenticated, proceed with publishing
    publishReport()
  }

  const publishReport = () => {
    console.log("Formulario enviado:", form)

    // Clear any pending report data
    localStorage.removeItem("pendingReport")
    localStorage.removeItem("returnTo")

    setShowSuccessMessage(true)
    setTimeout(() => {
      setShowSuccessMessage(false)
      router.push("/")
    }, 3000)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tipo = urlParams.get("tipo")
    const step = urlParams.get("step")

    if (tipo && (tipo === "perdido" || tipo === "encontrado")) {
      setForm((prev) => ({ ...prev, status: tipo }))
    }

    if (step === "publish") {
      // User returned from authentication, check if they're authenticated
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
      const pendingReport = localStorage.getItem("pendingReport")

      if (isAuthenticated && pendingReport) {
        // Restore form data and publish
        const savedForm = JSON.parse(pendingReport)
        setForm(savedForm)
        setCurrentStep(4) // Go to final step

        // Auto-publish after a brief moment
        setTimeout(() => {
          publishReport()
        }, 500)
      }
    }
  }, [])

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return form.status && form.animalType && (form.animalType !== "otro" || form.customAnimalType)
      case 2:
        return form.name && form.breed && form.color && form.size
      case 3:
        return form.location && form.date && form.description
      case 4:
        return form.contactName && form.contactPhone
      default:
        return false
    }
  }

  if (showSuccessMessage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-sm w-full">
          <CardContent className="p-6 text-center">
            <div className="mb-6">
              <Image
                src="/context-happy-reunion.jpeg"
                alt="¡Reporte creado exitosamente!"
                width={250}
                height={180}
                className="rounded-lg mx-auto"
              />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">¡Reporte Publicado!</h2>
            <p className="text-muted-foreground mb-6">
              Tu reporte ha sido creado exitosamente. La comunidad DogCat ya puede ver la información y ayudar en la
              búsqueda.
            </p>
            <Link href="/">
              <Button className="w-full bg-primary text-primary-foreground">Volver al inicio</Button>
            </Link>
          </CardContent>
        </Card>
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
            <Image src="/dogcat-logo.png" alt="DogCat Logo" width={32} height={32} className="rounded-lg" />
            <h1 className="text-xl font-bold text-foreground">Reportar Mascota</h1>
          </div>
        </div>
      </header>

      {showAiMatches && aiMatches.length > 0 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full max-h-[80vh] overflow-y-auto bg-card">
            <CardHeader className="bg-card">
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Brain className="h-5 w-5 text-primary" />
                ¡Posibles Coincidencias Encontradas!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-card">
              <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm text-card-foreground">
                  La IA encontró {aiMatches.length} posibles coincidencias basadas en la imagen.
                </p>
              </div>

              <div className="space-y-3">
                {aiMatches.slice(0, 3).map((match, index) => (
                  <div key={index} className="border border-border rounded-lg p-3 bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-green-500 text-white">{match.similarity}% similitud</Badge>
                      <Badge variant="outline">Confianza {match.confidence}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <Badge className="bg-destructive text-destructive-foreground text-xs mb-1">PERDIDO</Badge>
                        <Image
                          src={match.lostPet.images[0] || "/placeholder.svg"}
                          alt={match.lostPet.name}
                          width={80}
                          height={60}
                          className="w-full h-12 object-cover rounded"
                        />
                        <p className="text-xs font-medium mt-1 text-card-foreground">{match.lostPet.name}</p>
                      </div>
                      <div>
                        <Badge className="bg-primary text-primary-foreground text-xs mb-1">ENCONTRADO</Badge>
                        <Image
                          src={match.foundPet.images[0] || "/placeholder.svg"}
                          alt={match.foundPet.name}
                          width={80}
                          height={60}
                          className="w-full h-12 object-cover rounded"
                        />
                        <p className="text-xs font-medium mt-1 text-card-foreground">{match.foundPet.name}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {match.matchedFeatures.slice(0, 2).map((feature: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-card text-card-foreground border-border hover:bg-muted"
                  onClick={() => setShowAiMatches(false)}
                >
                  Continuar reportando
                </Button>
                <Link href="/ai-matching" className="flex-1">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver todos los matches
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contextual Hero Image */}
      <div className="max-w-md mx-auto p-4">
        <div className="mb-6 text-center">
          {currentStep === 1 && (
            <div>
              <Image
                src="/context-lost-pets-rain.jpeg"
                alt="Ayuda a las mascotas perdidas"
                width={200}
                height={120}
                className="rounded-lg mx-auto mb-3"
              />
              <p className="text-sm text-muted-foreground">Cada reporte cuenta. Ayuda a reunir familias.</p>
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <Image
                src="/context-pets-playing.jpeg"
                alt="Detalles de la mascota"
                width={200}
                height={120}
                className="rounded-lg mx-auto mb-3"
              />
              <p className="text-sm text-muted-foreground">
                Cuéntanos sobre la mascota para ayudar en la identificación.
              </p>
            </div>
          )}
          {currentStep === 3 && (
            <div>
              <Image
                src="/context-adoption-interface.jpeg"
                alt="Ubicación y detalles"
                width={200}
                height={120}
                className="rounded-lg mx-auto mb-3"
              />
              <p className="text-sm text-muted-foreground">La ubicación y fotos son clave para el reconocimiento.</p>
            </div>
          )}
          {currentStep === 4 && (
            <div>
              <Image
                src="/context-couple-found-cat.jpeg"
                alt="Información de contacto"
                width={200}
                height={120}
                className="rounded-lg mx-auto mb-3"
              />
              <p className="text-sm text-muted-foreground">Facilita el contacto para una reunión exitosa.</p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-6">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i + 1 <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div className={`w-12 h-1 mx-2 ${i + 1 < currentStep ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {currentStep === 1 && "Información Básica"}
                {currentStep === 2 && "Detalles de la Mascota"}
                {currentStep === 3 && "Ubicación y Descripción"}
                {currentStep === 4 && "Información de Contacto"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <>
                  <div className="space-y-3">
                    <Label className="text-base font-medium">¿Qué tipo de reporte es?</Label>
                    <RadioGroup value={form.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50">
                        <RadioGroupItem value="perdido" id="perdido" />
                        <Label htmlFor="perdido" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">😢</span>
                            </div>
                            <span className="text-foreground font-medium">Mi mascota está perdida</span>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50">
                        <RadioGroupItem value="encontrado" id="encontrado" />
                        <Label htmlFor="encontrado" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">🏠</span>
                            </div>
                            <span className="text-foreground font-medium">Encontré una mascota</span>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-medium">Tipo de animal</Label>
                    <RadioGroup
                      value={form.animalType}
                      onValueChange={(value) => handleInputChange("animalType", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="perro" id="perro" />
                        <Label htmlFor="perro">Perro</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="gato" id="gato" />
                        <Label htmlFor="gato">Gato</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="otro" id="otro" />
                        <Label htmlFor="otro">Otro</Label>
                      </div>
                    </RadioGroup>

                    {form.animalType === "otro" && (
                      <Input
                        placeholder="Especifica el tipo de animal"
                        value={form.customAnimalType || ""}
                        onChange={(e) => handleInputChange("customAnimalType", e.target.value)}
                      />
                    )}
                  </div>
                </>
              )}

              {/* Step 2: Pet Details */}
              {currentStep === 2 && (
                <>
                  <div className="space-y-3">
                    <Label htmlFor="name">Nombre de la mascota</Label>
                    <Input
                      id="name"
                      placeholder="Si no conoces el nombre, escribe 'Desconocido'"
                      value={form.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="breed">Raza</Label>
                    <Input
                      id="breed"
                      placeholder="Ej: Golden Retriever, Siamés, Mestizo..."
                      value={form.breed}
                      onChange={(e) => handleInputChange("breed", e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      placeholder="Ej: Dorado, Negro y blanco, Gris..."
                      value={form.color}
                      onChange={(e) => handleInputChange("color", e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Tamaño</Label>
                    <Select value={form.size} onValueChange={(value) => handleInputChange("size", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tamaño" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pequeño">Pequeño (hasta 10kg)</SelectItem>
                        <SelectItem value="mediano">Mediano (10-25kg)</SelectItem>
                        <SelectItem value="grande">Grande (más de 25kg)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Step 3: Location and Description */}
              {currentStep === 3 && (
                <>
                  <div className="space-y-3">
                    <Label htmlFor="location">Ubicación</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="Ej: Parque Central, Calle Mayor 123..."
                        className="pl-10"
                        value={form.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="date">Fecha</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        className="pl-10"
                        value={form.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="description">Descripción y señas particulares</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe características especiales, comportamiento, collar, etc."
                      rows={4}
                      value={form.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Fotos con Análisis IA</Label>
                    <ImageAnalyzer onAnalysisComplete={handleAiAnalysisComplete} className="mb-4" />

                    {/* Keep existing image upload for additional photos */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Camera className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Agregar más fotos</p>
                            <p className="text-xs text-muted-foreground mt-1">Las fotos claras ayudan mucho</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>

                      {form.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {form.images.map((image, index) => (
                            <div key={index} className="relative">
                              <Image
                                src={URL.createObjectURL(image) || "/placeholder.svg"}
                                alt={`Foto ${index + 1}`}
                                width={100}
                                height={100}
                                className="w-full h-20 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                onClick={() => removeImage(index)}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Step 4: Contact Information */}
              {currentStep === 4 && (
                <>
                  <div className="space-y-3">
                    <Label htmlFor="contactName">Tu nombre</Label>
                    <Input
                      id="contactName"
                      placeholder="Nombre completo"
                      value={form.contactName}
                      onChange={(e) => handleInputChange("contactName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="contactPhone">Teléfono *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="contactPhone"
                        placeholder="+34 666 123 456"
                        className="pl-10"
                        value={form.contactPhone}
                        onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="contactWhatsapp">WhatsApp (opcional)</Label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="contactWhatsapp"
                        placeholder="+34 666 123 456"
                        className="pl-10"
                        value={form.contactWhatsapp}
                        onChange={(e) => handleInputChange("contactWhatsapp", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="contactEmail">Email (opcional)</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="tu@email.com"
                        className="pl-10"
                        value={form.contactEmail}
                        onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={prevStep} className="flex-1 bg-transparent">
                Anterior
              </Button>
            )}

            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex-1 bg-primary text-primary-foreground"
              >
                Siguiente
              </Button>
            ) : (
              <Button type="submit" disabled={!canProceed()} className="flex-1 bg-primary text-primary-foreground">
                Publicar Reporte
              </Button>
            )}
          </div>
        </form>

        {/* Motivational Footer Image */}
        <div className="mt-8 text-center">
          <Image
            src="/context-happy-pets.jpeg"
            alt="Mascotas felices"
            width={150}
            height={100}
            className="rounded-lg mx-auto opacity-60"
          />
          <p className="text-xs text-muted-foreground mt-2">Juntos podemos ayudar a que más mascotas regresen a casa</p>
        </div>
      </div>
    </div>
  )
}

export default function ReportarPage() {
  return (
    <AuthGuard>
      <ReportarPageContent />
    </AuthGuard>
  )
}
