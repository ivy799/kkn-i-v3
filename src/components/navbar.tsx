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
    { title: "Acara", url: "/events" },
    { title: "Wisata", url: "/wisata" },
    { title: "UMKM", url: "/business" },
  ]

  // Show Dashboard button for admins, User Dashboard for regular users
  const authConfig = user
    ? user.role === 'ADMIN'
      ? {
        login: {
          text: "Dashboard",
          url: "/dashboard",
        },
        signup: null,
      }
      : {
        login: {
          text: "Dashboard",
          url: "/user-dashboard",
        },
        signup: null,
      }
    : {
      login: { text: "Masuk", url: "/auth/signin" },
      signup: null,
    }

  return (
    <Navbar1
      logo={{
        url: "/",
        src: "/img/logo.png",
        alt: "Logo Desa",
        title: "Desa Bonto Lojong",
      }}
      menu={menuItems}
      auth={authConfig}
      isAdmin={user?.role === "ADMIN"}
      mobileExtraLinks={[
        { name: "Tentang", url: "/about" },
      ]}
    />
  )
}