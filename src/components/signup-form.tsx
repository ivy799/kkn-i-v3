"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Terjadi kesalahan saat registrasi")
        return
      }

      toast.success(data.message || "Registrasi berhasil")
      router.push("/") // Redirect ke homepage setelah berhasil
      router.refresh()
    } catch (error) {
      console.error("Signup error:", error)
      toast.error("Terjadi kesalahan saat registrasi")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Buat Akun Anda</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Masukkan username dan password untuk membuat akun
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isLoading}
                  minLength={3}
                />
                <FieldDescription>
                  Minimal 3 karakter
                </FieldDescription>
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      minLength={6}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">
                      Konfirmasi Password
                    </FieldLabel>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                      minLength={6}
                    />
                  </Field>
                </Field>
                <FieldDescription>
                  Minimal 6 karakter
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Mendaftar..." : "Buat Akun"}
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Sudah punya akun?{" "}
                <a href="/auth/signin" className="underline">
                  Masuk
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/img/img-02.jpeg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Dengan melanjutkan, Anda menyetujui{" "}
        <a href="#" className="underline">
          Ketentuan Layanan
        </a>{" "}
        dan{" "}
        <a href="#" className="underline">
          Kebijakan Privasi
        </a>
        .
      </FieldDescription>
    </div>
  )
}