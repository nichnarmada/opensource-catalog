import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Open Source Catalog",
  description: "Discover and track open source projects",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body
        className={`${inter.variable} min-h-screen bg-background text-foreground font-sans`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
