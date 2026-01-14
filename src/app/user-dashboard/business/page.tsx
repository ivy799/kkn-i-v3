"use client"

import { UserSidebar } from "@/components/user-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { IconPlus, IconTrash, IconAlertCircle } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Image from "next/image"

interface Business {
    id: number
    type: string | null
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    name: string | null
    ownerName: string | null
    phoneNumber: string | null
    description: string | null
    minimumPrice: number | null
    maximumPrice: number | null
    address: string | null
    rejectionReason: string | null
    createdAt: string
    BusinessGallery: {
        id: number
        media: string | null
    }[]
}

export default function UserBusinessPage() {
    const [businesses, setBusinesses] = useState<Business[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        fetchBusinesses()
    }, [])

    const fetchBusinesses = async () => {
        try {
            const response = await fetch('/api/user/business')
            const data = await response.json()
            if (data.success) {
                setBusinesses(data.data)
            }
        } catch (error) {
            toast.error('Gagal memuat data bisnis')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return

        setIsDeleting(true)
        try {
            const response = await fetch(`/api/user/business/${deleteId}`, {
                method: 'DELETE',
            })
            const data = await response.json()

            if (data.success) {
                toast.success('Bisnis berhasil dihapus')
                setBusinesses(prev => prev.filter(b => b.id !== deleteId))
            } else {
                toast.error(data.message || 'Gagal menghapus bisnis')
            }
        } catch (error) {
            toast.error('Terjadi kesalahan')
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Menunggu</Badge>
            case 'APPROVED':
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Disetujui</Badge>
            case 'REJECTED':
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Ditolak</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const formatPrice = (min: number | null, max: number | null) => {
        if (!min && !max) return '-'
        if (min && max) return `Rp ${min.toLocaleString('id-ID')} - Rp ${max.toLocaleString('id-ID')}`
        if (min) return `Mulai Rp ${min.toLocaleString('id-ID')}`
        if (max) return `Hingga Rp ${max.toLocaleString('id-ID')}`
        return '-'
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <UserSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold">Bisnis Saya</h1>
                                    <p className="text-muted-foreground">Kelola pengajuan bisnis Anda</p>
                                </div>
                                <a href="/user-dashboard/business/new">
                                    <Button className="gap-2">
                                        <IconPlus className="h-4 w-4" />
                                        Ajukan Bisnis Baru
                                    </Button>
                                </a>
                            </div>

                            {/* Business List */}
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : businesses.length === 0 ? (
                                <div className="rounded-xl border bg-card p-12 text-center">
                                    <p className="text-muted-foreground mb-4">Anda belum memiliki pengajuan bisnis</p>
                                    <a href="/user-dashboard/business/new">
                                        <Button>Ajukan Bisnis Pertama Anda</Button>
                                    </a>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {businesses.map((business) => (
                                        <div key={business.id} className="rounded-xl border bg-card p-6">
                                            <div className="flex gap-4">
                                                {/* Image */}
                                                <div className="flex-shrink-0">
                                                    {business.BusinessGallery[0]?.media ? (
                                                        <Image
                                                            src={business.BusinessGallery[0].media}
                                                            alt={business.name || 'Business'}
                                                            width={120}
                                                            height={120}
                                                            className="rounded-lg object-cover w-[120px] h-[120px]"
                                                        />
                                                    ) : (
                                                        <div className="w-[120px] h-[120px] rounded-lg bg-muted flex items-center justify-center">
                                                            <span className="text-muted-foreground text-xs">No Image</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="font-semibold text-lg truncate">{business.name || 'Tanpa Nama'}</h3>
                                                                {getStatusBadge(business.status)}
                                                            </div>
                                                            <p className="text-sm text-muted-foreground mb-2">{business.type}</p>
                                                        </div>

                                                        {/* Delete button - only for PENDING or REJECTED */}
                                                        {business.status !== 'APPROVED' && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                onClick={() => setDeleteId(business.id)}
                                                            >
                                                                <IconTrash className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>

                                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                        {business.description}
                                                    </p>

                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div>
                                                            <span className="text-muted-foreground">Pemilik: </span>
                                                            <span>{business.ownerName}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">Harga: </span>
                                                            <span>{formatPrice(business.minimumPrice, business.maximumPrice)}</span>
                                                        </div>
                                                    </div>

                                                    {/* Rejection Reason */}
                                                    {business.status === 'REJECTED' && business.rejectionReason && (
                                                        <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
                                                            <div className="flex items-start gap-2">
                                                                <IconAlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-red-700">Alasan Penolakan:</p>
                                                                    <p className="text-sm text-red-600">{business.rejectionReason}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SidebarInset>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Pengajuan Bisnis</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus pengajuan bisnis ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </SidebarProvider>
    )
}
