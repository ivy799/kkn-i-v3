"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface AuthButtonsProps {
  isAuthenticated: boolean
  username?: string
}

export function AuthButtons({ isAuthenticated, username }: AuthButtonsProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/signout", { method: "POST" })
      if (response.ok) {
        toast.success("Berhasil logout")
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      toast.error("Gagal logout")
    }
  }

  if (isAuthenticated) {
    return (
      <>
        <Button asChild variant="outline" size="sm">
          <a href="/dashboard">{username}</a>
        </Button>
        <Button onClick={handleLogout} size="sm">
          Keluar
        </Button>
      </>
    )
  }

  return (
    <>
      <Button asChild variant="outline" size="sm">
        <a href="/auth/signin">Masuk</a>
      </Button>
      <Button asChild size="sm">
        <a href="/auth/signup">Daftar</a>
      </Button>
    </>
  )
}