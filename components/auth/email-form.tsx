"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface EmailFormProps extends React.ComponentProps<"div"> {
  onBack: () => void
  onEmailSubmitted: (email: string) => void
}

export function EmailForm({ className, onBack, onEmailSubmitted, ...props }: EmailFormProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      setError("Por favor ingresa un email válido")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate sending OTP
    setTimeout(() => {
      onEmailSubmitted(email)
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <Button
                type="button"
                variant="ghost"
                onClick={onBack}
                className="self-start p-0 h-auto text-muted-foreground hover:text-foreground"
              >
                <span className="mr-2">←</span>
                Volver
              </Button>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-primary/10 rounded-full">
                  <span className="text-2xl">📧</span>
                </div>
                <h1 className="text-2xl font-bold">Verificación requerida</h1>
                <p className="text-balance text-muted-foreground">
                  Para reportar mascotas perdidas o encontradas, necesitamos verificar tu identidad
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Enviando código..." : "Enviar código de verificación"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span>🛡️</span>
                  <span>Verificación segura</span>
                </div>
                <p>
                  Te enviaremos un código de 6 dígitos para verificar tu identidad antes de permitir reportes de
                  mascotas.
                </p>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/context-couple-found-cat.jpeg"
              alt="Verificación de identidad"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
