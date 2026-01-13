import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getCurrentUser } from "@/lib/auth"
import { headers } from "next/headers"

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
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || ""
  const isDashboard = pathname.startsWith("/dashboard")

  return (
    <html lang="id">
      <body className="min-h-screen">
        {!isDashboard && (
          <header className="fixed top-0 left-0 right-0 z-50 bg-green-900 border-b border-green-800 shadow-sm">
            <Navbar user={user} />
          </header>
        )}
        <main className={isDashboard ? "" : "pt-16"}>
          {children}
        </main>
        {!isDashboard && <Footer />}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}