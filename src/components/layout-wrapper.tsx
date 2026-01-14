"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

interface LayoutWrapperProps {
    children: React.ReactNode
    user: { userId: number; username: string; role: string } | null
}

export function LayoutWrapper({ children, user }: LayoutWrapperProps) {
    const pathname = usePathname()
    const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/user-dashboard")

    return (
        <>
            {!isDashboard && (
                <header className="fixed top-0 left-0 right-0 z-50 bg-green-900 border-b border-green-800 shadow-sm">
                    <Navbar user={user} />
                </header>
            )}
            <main className={isDashboard ? "" : "pt-16"}>
                {children}
            </main>
            {!isDashboard && <Footer />}
        </>
    )
}
