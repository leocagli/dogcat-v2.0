"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

interface AuthOptionsProps extends React.ComponentProps<"div"> {
  onBack: () => void
  onEmailSelected: () => void
}

export function AuthOptions({ className, onBack, onEmailSelected, ...props }: AuthOptionsProps) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setError("")

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect_to=${encodeURIComponent(window.location.pathname + window.location.search)}`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      setError(error.message || "Error al iniciar sesión con Google")
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
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

              <div className="grid gap-3">
                <Button
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className="w-full bg-transparent"
                  variant="outline"
                >
                  <span className="mr-2">🌐</span>
                  {isGoogleLoading ? "Conectando..." : "Continuar con Google"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">O</span>
                  </div>
                </div>

                <Button onClick={onEmailSelected} variant="outline" className="w-full bg-transparent">
                  <span className="mr-2">📧</span>
                  Continuar con Email
                </Button>
              </div>

              {error && <p className="text-sm text-destructive text-center">{error}</p>}

              <div className="text-center text-sm text-muted-foreground">
                <p>Necesitamos verificar tu identidad para mantener la seguridad de la comunidad de mascotas.</p>
              </div>
            </div>
          </div>
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
