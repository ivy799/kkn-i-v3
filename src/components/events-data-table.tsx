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
import { AddEventDialog } from "./add-event-dialog"
import { EditEventDialog } from "./edit-event-dialog"
import { PlusIcon, Pencil, Trash2 } from "lucide-react"
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

import { getEventStatus, getEventStatusLabel } from "@/lib/eventUtils"

interface Event {
  id: number
  title: string
  description: string
  location: string
  startDate: string
  endDate: string | null
  image: string | null
}

interface EventsDataTableProps {
  data: Event[]
  loading: boolean
  onRefresh: () => void
}

export function EventsDataTable({ data, loading, onRefresh }: EventsDataTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [eventToDelete, setEventToDelete] = React.useState<number | null>(null)
  const [deleting, setDeleting] = React.useState(false)
  const [isOperating, setIsOperating] = React.useState(false)

  const handleDelete = async () => {
    if (!eventToDelete) return

    try {
      setDeleting(true)
      setIsOperating(true)
      const response = await fetch(`/api/event/${eventToDelete}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onRefresh()
        setDeleteDialogOpen(false)
        setEventToDelete(null)
      }
    } catch (error) {
      console.error('Error deleting event:', error)
    } finally {
      setDeleting(false)
      setIsOperating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusBadge = (event: Event) => {
    const status = getEventStatus(event.startDate, event.endDate)
    const label = getEventStatusLabel(status)

    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      UPCOMING: "default",
      ONGOING: "secondary",
      COMPLETED: "destructive"
    }
    return <Badge variant={variants[status] || "default"}>{label}</Badge>
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Acara</h2>
          <p className="text-muted-foreground">Kelola data acara desa</p>
        </div>
        <AddEventDialog onSuccess={onRefresh} onOperatingChange={setIsOperating}>
          <Button disabled={isOperating || loading}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Tambah Event
          </Button>
        </AddEventDialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Tanggal Mulai</TableHead>
              <TableHead>Tanggal Selesai</TableHead>
              <TableHead>Status</TableHead>
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
              data.map((event, index) => (
                <TableRow key={event.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{formatDate(event.startDate)}</TableCell>
                  <TableCell>
                    {event.endDate ? formatDate(event.endDate) : '-'}
                  </TableCell>
                  <TableCell>{getStatusBadge(event)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <EditEventDialog event={event} onSuccess={onRefresh} onOperatingChange={setIsOperating}>
                        <Button variant="ghost" size="icon" disabled={isOperating || loading}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </EditEventDialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isOperating || loading}
                        onClick={() => {
                          setEventToDelete(event.id)
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
            <AlertDialogTitle>Hapus Acara</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus acara ini? Tindakan ini tidak dapat dibatalkan.
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