"use client"

import { Navbar1 } from "./shadcnblocks-com-navbar1"

interface NavbarProps {
  user: {
    userId: number
    username: string
    role: string
  } | null
}

export function Navbar({ user }: NavbarProps) {
  const menuItems = [
    { title: "Beranda", url: "/" },
    { title: "Profil Desa", url: "/profile" },
    { title: "Galeri", url: "/gallery" },
    { title: "Event", url: "/events" },
    { title: "Wisata", url: "/wisata" },
    { title: "UMKM", url: "/business" },
  ]

  const authConfig = user
    ? {
      login: {
        text: user.role === "ADMIN" ? "Dashboard" : user.username,
        url: user.role === "ADMIN" ? "/dashboard" : "#",
      },
      signup: { text: "Keluar", url: "/api/auth/signout" },
    }
    : {
      login: { text: "Masuk", url: "/auth/signin" },
      signup: { text: "Daftar", url: "/auth/signup" },
    }

  return (
    <Navbar1
      logo={{
        url: "/",
        src: "/logo_bantaeng.webp",
        alt: "Logo Desa",
        title: "Desa Bonto Lojong",
      }}
      menu={menuItems}
      auth={authConfig}
      isAdmin={user?.role === "ADMIN"}
      mobileExtraLinks={[
        { name: "Tentang", url: "/about" },
        { name: "Kontak", url: "/contact" },
      ]}
    />
  )
}