import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "KKN App",
  description: "Aplikasi KKN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}