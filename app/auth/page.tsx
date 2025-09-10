"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthOptions } from "@/components/auth/auth-options"
import { EmailForm } from "@/components/auth/email-form"
import { OtpForm } from "@/components/auth/otp-form"
import { createClient } from "@/lib/supabase/client"

type AuthStep = "options" | "email" | "otp"

export default function AuthPage() {
  const [step, setStep] = useState<AuthStep>("options")
  const [email, setEmail] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/"

  // Check if user is already authenticated with Supabase
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        router.push(redirectTo)
        return
      }

      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
      if (isAuthenticated) {
        router.push(redirectTo)
      }
    }

    checkAuth()
  }, [router, redirectTo])

  const handleEmailSubmitted = (submittedEmail: string) => {
    setEmail(submittedEmail)
    setStep("otp")
  }

  const handleVerified = () => {
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userEmail", email)

    // Redirect to the intended page
    router.push(redirectTo)
  }

  const handleBack = () => {
    if (step === "otp") {
      setStep("email")
    } else if (step === "email") {
      setStep("options")
    } else {
      router.push("/")
    }
  }

  const handleEmailSelected = () => {
    setStep("email")
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        {step === "options" && <AuthOptions onBack={handleBack} onEmailSelected={handleEmailSelected} />}
        {step === "email" && <EmailForm onBack={handleBack} onEmailSubmitted={handleEmailSubmitted} />}
        {step === "otp" && <OtpForm email={email} onBack={handleBack} onVerified={handleVerified} />}
      </div>
    </div>
  )
}
