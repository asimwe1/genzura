import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthGuard } from "@/components/AuthGuard"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import AIChatGlobalWidget from "@/components/AIChatGlobalWidget"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Genzura - Portal Management System",
  description: "A comprehensive portal management system for products and services",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        <AuthGuard>{children}</AuthGuard>
        <AIChatGlobalWidget />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
