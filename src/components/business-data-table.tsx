"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AddBusinessDialog } from "./add-business-dialog"
import { EditBusinessDialog } from "./edit-business-dialog"
import { PlusIcon, Pencil, Trash2, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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

interface Business {
  id: number
  type: string | null
  name: string | null
  ownerName: string | null
  phoneNumber: string | null
  description: string | null
  minimumPrice: number | null
  maximumPrice: number | null
  address: string | null
  status: string
  rejectionReason: string | null
}

interface BusinessDataTableProps {
  data: Business[]
  loading: boolean
  onRefresh: () => void
}

export function BusinessDataTable({ data, loading, onRefresh }: BusinessDataTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [businessToDelete, setBusinessToDelete] = React.useState<number | null>(null)
  const [deleting, setDeleting] = React.useState(false)
  const [isOperating, setIsOperating] = React.useState(false)

  const handleDelete = async () => {
    if (!businessToDelete) return

    try {
      setDeleting(true)
      setIsOperating(true)
      const response = await fetch(`/api/business/${businessToDelete}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onRefresh()
        setDeleteDialogOpen(false)
        setBusinessToDelete(null)
      }
    } catch (error) {
      console.error('Error deleting business:', error)
    } finally {
      setDeleting(false)
      setIsOperating(false)
    }
  }

  const formatPrice = (price: number | null) => {
    if (!price) return '-'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      PENDING: "default",
      APPROVED: "secondary",
      REJECTED: "destructive"
    }
    const labels: Record<string, string> = {
      PENDING: "Pending",
      APPROVED: "Disetujui",
      REJECTED: "Ditolak"
    }
    return <Badge variant={variants[status] || "default"}>{labels[status] || status}</Badge>
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bisnis</h2>
          <p className="text-muted-foreground">Kelola data bisnis desa</p>
        </div>
        <AddBusinessDialog onSuccess={onRefresh} onOperatingChange={setIsOperating}>
          <Button disabled={isOperating || loading}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Tambah Bisnis
          </Button>
        </AddBusinessDialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>Nama Bisnis</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Pemilik</TableHead>
              <TableHead>Telepon</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-muted-foreground">Memuat data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Tidak ada data
                </TableCell>
              </TableRow>
            ) : (
              data.map((business, index) => (
                <TableRow key={business.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{business.name || '-'}</TableCell>
                  <TableCell>{business.type || '-'}</TableCell>
                  <TableCell>{business.ownerName || '-'}</TableCell>
                  <TableCell>{business.phoneNumber || '-'}</TableCell>
                  <TableCell>
                    {formatPrice(business.minimumPrice)} - {formatPrice(business.maximumPrice)}
                  </TableCell>
                  <TableCell>{getStatusBadge(business.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <EditBusinessDialog business={business} onSuccess={onRefresh} onOperatingChange={setIsOperating}>
                        <Button variant="ghost" size="icon" disabled={isOperating || loading}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </EditBusinessDialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isOperating || loading}
                        onClick={() => {
                          setBusinessToDelete(business.id)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Bisnis</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus bisnis ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}