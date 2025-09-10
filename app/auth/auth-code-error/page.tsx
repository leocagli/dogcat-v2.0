import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AuthCodeError() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Error de autenticación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Hubo un problema al verificar tu cuenta. Por favor, intenta nuevamente.
            </p>
            <Button asChild className="w-full">
              <Link href="/auth">Intentar de nuevo</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
