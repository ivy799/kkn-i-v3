import { ReactNode } from "react"

export default function UserDashboardLayout({
    children,
}: {
    children: ReactNode
}) {
    return (
        <div className="user-dashboard-layout">
            {children}
        </div>
    )
}
