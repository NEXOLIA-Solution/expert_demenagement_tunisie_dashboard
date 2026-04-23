"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" // useSearchParams supprimé
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Clock } from "lucide-react"
import axios from "axios"
import Image from "next/image"
import logoala from "@/public/logo/logo1-removebg-preview.png"

export default function VerifyCodePage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState(180)

  // Récupération manuelle de l'email depuis l'URL (équivalent à useSearchParams)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const emailFromUrl = params.get("email") || ""
      setEmail(emailFromUrl)
      if (!emailFromUrl) {
        router.push("/login")
      }
    }
  }, [router])

  useEffect(() => {
    if (!email) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/login")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [email, router])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!email) {
      setError("Email manquant. Veuillez reconnecter.")
      setIsLoading(false)
      router.push("/login")
      return
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE
      const response = await axios.post(
        `${baseUrl}/user/api/verify-code`,
        { email, code },
        { headers: { "Content-Type": "application/json" } }
      )

      const { token, _id, name } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user_id", _id)
      localStorage.setItem("user_name", name)

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la vérification du code")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-3 text-center relative">
          <div className="mx-auto relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-primary/60 border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full bg-primary/10 animate-pulse"></div>
            <Image src={logoala} alt="Logo Ala" width={80} height={80} className="object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold">Vérification du code</CardTitle>
          <CardDescription>Un code de vérification a été envoyé à votre email</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Temps restant: {formatTime(timeLeft)}</p>
                <p className="text-xs text-blue-700">Le code expirera après 3 minutes</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code de vérification</Label>
              <Input
                id="code"
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                className="text-center text-2xl tracking-widest font-mono"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Vérification en cours...
                </>
              ) : (
                "Vérifier le code"
              )}
            </Button>

            <div className="text-center">
              <Button type="button" variant="link" onClick={() => router.push("/login")} className="text-sm">
                Retour à la connexion
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}