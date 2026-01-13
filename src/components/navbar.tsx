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
        text: "Dashboard",
        url: "/dashboard",
      },
      signup: null, // Remove logout from navbar
    }
    : {
      login: { text: "Masuk", url: "/auth/signin" },
      signup: null, // Remove signup from navbar
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