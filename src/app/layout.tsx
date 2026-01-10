import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
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
      <body className="min-h-screen">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
          <Navbar user={user} />
        </header>
        <main className="pt-16">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}