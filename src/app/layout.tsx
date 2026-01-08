import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner"
import { Navbar } from "@/components/navbar"
import { getCurrentUser } from "@/lib/auth"

export const metadata: Metadata = {
  title: "KKN App",
  description: "Aplikasi KKN",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser()

  return (
    <html lang="id">
      <body>
        <nav className="p-5 fixed top-0 left-0 right-0 bg-white z-50">
          <Navbar user={user} />
        </nav>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}