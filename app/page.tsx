"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Lire le cookie "auth_token" côté client
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(";").shift()
      return null
    }

    const isAuthenticated = getCookie("auth_token")

    if (isAuthenticated) {
      router.replace("/dashboard")
    } else {
      router.replace("/login")
    }
  }, [router])

  // Optionnel : un écran de chargement pendant la vérification
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Vérification en cours...</p>
    </div>
  )
}