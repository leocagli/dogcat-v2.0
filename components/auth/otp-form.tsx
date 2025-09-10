"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Shield } from "lucide-react"

interface OtpFormProps extends React.ComponentProps<"div"> {
  email: string
  onBack: () => void
  onVerified: () => void
}

export function OtpForm({ className, email, onBack, onVerified, ...props }: OtpFormProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState(60)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const otpCode = otp.join("")
    if (otpCode.length !== 6) {
      setError("Por favor ingresa el código completo")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate OTP verification
    setTimeout(() => {
      if (otpCode === "123456") {
        onVerified()
      } else {
        setError("Código incorrecto. Intenta nuevamente.")
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
      }
      setIsLoading(false)
    }, 1500)
  }

  const handleResend = () => {
    setTimeLeft(60)
    setOtp(["", "", "", "", "", ""])
    setError("")
    inputRefs.current[0]?.focus()
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={(e) => {
              e.preventDefault()
              handleVerify()
            }}
          >
            <div className="flex flex-col gap-6">
              <Button
                type="button"
                variant="ghost"
                onClick={onBack}
                className="self-start p-0 h-auto text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-primary/10 rounded-full">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">Verificar código</h1>
                <p className="text-balance text-muted-foreground">Enviamos un código de 6 dígitos a</p>
                <p className="text-sm font-medium text-foreground">{email}</p>
              </div>

              <div className="space-y-4">
                <Label className="text-center block">Ingresa el código de verificación</Label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-semibold"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                {error && <p className="text-sm text-destructive text-center">{error}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || otp.join("").length !== 6}>
                {isLoading ? "Verificando..." : "Verificar código"}
              </Button>

              <div className="text-center text-sm">
                {timeLeft > 0 ? (
                  <p className="text-muted-foreground">Reenviar código en {timeLeft}s</p>
                ) : (
                  <Button type="button" variant="link" onClick={handleResend} className="p-0 h-auto text-primary">
                    Reenviar código
                  </Button>
                )}
              </div>

              <div className="text-center text-xs text-muted-foreground">
                <p className="mb-2">
                  💡 <strong>Código de prueba:</strong> 123456
                </p>
                <p>Para desarrollo, usa este código para continuar</p>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/context-lost-pets-rain.jpeg"
              alt="Verificación segura"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
