"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Event {
  id: number
  title: string
  description: string
  location: string
  startDate: string
  endDate: string | null
  image: string | null
  status: string
}

interface EditEventDialogProps {
  children: React.ReactNode
  event: Event
  onSuccess: () => void
}

export function EditEventDialog({ children, event, onSuccess }: EditEventDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    title: event.title,
    description: event.description,
    location: event.location,
    startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : "",
    endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
    status: event.status,
  })

  React.useEffect(() => {
    if (open) {
      setFormData({
        title: event.title,
        description: event.description,
        location: event.location,
        startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : "",
        endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
        status: event.status,
      })
    }
  }, [open, event])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setConfirmDialogOpen(true)
  }

  const handleConfirmSubmit = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/event/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        }),
      })

      if (response.ok) {
        setConfirmDialogOpen(false)
        setOpen(false)
        onSuccess()
      }
    } catch (error) {
      console.error('Error updating event:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Acara</DialogTitle>
          <DialogDescription>
            Ubah informasi acara
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Judul Acara *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Lokasi *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Tanggal Mulai *</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endDate">Tanggal Selesai</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPCOMING">Akan Datang</SelectItem>
                  <SelectItem value="ONGOING">Sedang Berlangsung</SelectItem>
                  <SelectItem value="COMPLETED">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Edit Acara</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin mengubah data acara ini? Pastikan semua data sudah benar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit} disabled={loading}>
              {loading ? 'Menyimpan...' : 'Ya, Simpan'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
}