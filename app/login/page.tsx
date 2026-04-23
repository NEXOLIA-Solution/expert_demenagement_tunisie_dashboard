"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail } from "lucide-react"
import ReCAPTCHA from "react-google-recaptcha"
import logoala from "@/public/logoAla copy.png"
import Image from "next/image"
import axios from "axios"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Afficher reCAPTCHA seulement si email et password sont remplis
  useEffect(() => {
    if (email.trim() !== "" && password.trim() !== "") {
      setShowCaptcha(true)
    } else {
      setShowCaptcha(false)
      setCaptchaVerified(false)
    }
  }, [email, password])

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaVerified(!!token)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!captchaVerified) {
      setError("Veuillez vérifier le reCAPTCHA")
      return
    }

    setIsLoading(true)

    try {

       const baseUrl = process.env.NEXT_PUBLIC_API_BASE
       
      // Appel backend pour login + envoi email code
      const response = await axios.post(
      
        `${baseUrl}/user/api/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      )

      // ✅ Si backend confirme que tout est correct
      if (response.data.isEmailPasswordRecaptchaVerified === true) {
        setSuccess(true)
        // Passer l'email au verify-code via query param
        setTimeout(() => router.push(`/verify-code?email=${encodeURIComponent(email)}`), 1000)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur de connexion au serveur")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-primary/60 border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full bg-primary/10 animate-pulse"></div>
            <Image src={logoala} alt="Logo Ala" width={80} height={80} className="object-contain" />
          </div>

          <CardTitle className="text-2xl font-bold">Connexion Administrateur</CardTitle>
          <CardDescription>Accédez au tableau de bord de gestion</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Administrateur</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {showCaptcha && (
              <div className="my-4">
                <ReCAPTCHA sitekey="6LdYZsYsAAAAAA2JYZL4qcg9u63AFqZtPhYCY3kW" onChange={handleCaptchaChange} />
              </div>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200 flex items-center gap-2">
                <Mail className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Le code de connexion a été envoyé à votre email.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {captchaVerified && (
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
