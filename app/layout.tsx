import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://expert-demenagement-tunisie.com"),

  title: {
    default: "Déménagement Tunisie | Expert Déménagement Professionnel",
    template: "%s | Expert Déménagement Tunisie",
  },

  description:
    "Expert en déménagement en Tunisie 🇹🇳. Service rapide, sécurisé et économique pour particuliers et entreprises. Devis gratuit.",
  icons: {
    icon: "https://expert-demenagement-tunisie.com/logo/logo1-removebg-preview.png", // ou ton logo
    shortcut: "https://expert-demenagement-tunisie.com/logo/logo1-removebg-preview.png",
    apple: "https://expert-demenagement-tunisie.com/logo/logo1-removebg-preview.png",
  },
  keywords: [
    "déménagement Tunisie",
    "déménageur Tunisie",
    "transport meubles Tunisie",
    "déménagement pas cher",
    "société déménagement Tunisie",
  ],

  authors: [{ name: "Expert Déménagement Tunisie" }],

  openGraph: {
    title: "Déménagement Tunisie | Service Professionnel",
    description:
      "Entreprise spécialisée en déménagement résidentiel et commercial partout en Tunisie.",
    url: "https://expert-demenagement-tunisie.com",
    siteName: "Expert Déménagement Tunisie",
    images: [
      {
        url: "https://expert-demenagement-tunisie.com/logo/logo1-removebg-preview.png",
        width: 1200,
        height: 630,
        alt: "Service de déménagement en Tunisie",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Déménagement Tunisie",
    description: "Service professionnel de déménagement en Tunisie",
    images: [
      "https://expert-demenagement-tunisie.com/logo/logo1-removebg-preview.png",
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}














