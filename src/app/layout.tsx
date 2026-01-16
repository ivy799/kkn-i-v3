import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner"
import { LayoutWrapper } from "@/components/layout-wrapper";
import { getCurrentUser } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Desa Bonto Lojong",
  description: "Aplikasi KKN",
};

// Force dynamic rendering since we use cookies for auth
export const dynamic = "force-dynamic"


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser()

  return (
    <html lang="id">
      <body className="min-h-screen">
        <LayoutWrapper user={user}>
          {children}
        </LayoutWrapper>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}