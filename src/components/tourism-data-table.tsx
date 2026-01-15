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
import { AddTourismDialog } from "./add-tourism-dialog"
import { EditTourismDialog } from "./edit-tourism-dialog"
import { PlusIcon, Pencil, Trash2 } from "lucide-react"
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

interface TourismSpot {
  id: number
  name: string | null
  description: string | null
  address: string | null
  mapUrl: string | null
  ticketPrice: number | null
  openingHours: string | null
  closingHours: string | null
  contactPerson: string | null
}

interface TourismDataTableProps {
  data: TourismSpot[]
  loading: boolean
  onRefresh: () => void
}

export function TourismDataTable({ data, loading, onRefresh }: TourismDataTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [tourismToDelete, setTourismToDelete] = React.useState<number | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  const handleDelete = async () => {
    if (!tourismToDelete) return

    try {
      setDeleting(true)
      const response = await fetch(`/api/tourism/${tourismToDelete}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onRefresh()
        setDeleteDialogOpen(false)
        setTourismToDelete(null)
      }
    } catch (error) {
      console.error('Error deleting tourism spot:', error)
    } finally {
      setDeleting(false)
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

  return (
    <div className="px-4 lg:px-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Wisata</h2>
          <p className="text-muted-foreground">Kelola data tempat wisata desa</p>
        </div>
        <AddTourismDialog onSuccess={onRefresh}>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Tambah Wisata
          </Button>
        </AddTourismDialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Harga Tiket</TableHead>
              <TableHead>Jam Operasional</TableHead>
              <TableHead>Kontak</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Tidak ada data
                </TableCell>
              </TableRow>
            ) : (
              data.map((tourism, index) => (
                <TableRow key={tourism.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{tourism.name || '-'}</TableCell>
                  <TableCell>{tourism.address || '-'}</TableCell>
                  <TableCell>{formatPrice(tourism.ticketPrice)}</TableCell>
                  <TableCell>
                    {tourism.openingHours && tourism.closingHours
                      ? `${tourism.openingHours} - ${tourism.closingHours}`
                      : '-'
                    }
                  </TableCell>
                  <TableCell>{tourism.contactPerson || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <EditTourismDialog tourism={tourism} onSuccess={onRefresh}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </EditTourismDialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setTourismToDelete(tourism.id)
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
            <AlertDialogTitle>Hapus Tempat Wisata</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus tempat wisata ini? Tindakan ini tidak dapat dibatalkan.
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