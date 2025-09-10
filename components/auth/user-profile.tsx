"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"

interface UserData {
  email: string
  name?: string
  avatar_url?: string
  isOtpUser?: boolean
}

export function UserProfile() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        // Supabase user
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        setUser({
          email: session.user.email!,
          name: profile?.display_name || session.user.user_metadata?.full_name,
          avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url,
        })
      } else {
        // OTP user fallback
        const otpEmail = localStorage.getItem("dogcat_user_email")
        if (otpEmail) {
          setUser({
            email: otpEmail,
            isOtpUser: true,
          })
        }
      }

      setIsLoading(false)
    }

    loadUser()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()

    // Also clear OTP auth
    localStorage.removeItem("dogcat_auth")
    localStorage.removeItem("dogcat_user_email")

    window.location.href = "/"
  }

  if (isLoading || !user) {
    return null
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email[0].toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name || user.email} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
