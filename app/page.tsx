"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/AuthGuard"
import { Toaster } from "@/components/ui/sonner"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page
    router.replace("/product")
  }, [router])

  return (
    <AuthGuard>
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      <Toaster />
    </AuthGuard>
  )
}
