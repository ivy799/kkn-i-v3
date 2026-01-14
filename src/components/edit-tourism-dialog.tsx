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

interface EditTourismDialogProps {
  children: React.ReactNode
  tourism: TourismSpot
  onSuccess: () => void
}

export function EditTourismDialog({ children, tourism, onSuccess }: EditTourismDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: tourism.name || "",
    description: tourism.description || "",
    address: tourism.address || "",
    mapUrl: tourism.mapUrl || "",
    ticketPrice: tourism.ticketPrice?.toString() || "",
    openingHours: tourism.openingHours || "",
    closingHours: tourism.closingHours || "",
    contactPerson: tourism.contactPerson || "",
  })

  React.useEffect(() => {
    if (open) {
      setFormData({
        name: tourism.name || "",
        description: tourism.description || "",
        address: tourism.address || "",
        mapUrl: tourism.mapUrl || "",
        ticketPrice: tourism.ticketPrice?.toString() || "",
        openingHours: tourism.openingHours || "",
        closingHours: tourism.closingHours || "",
        contactPerson: tourism.contactPerson || "",
      })
    }
  }, [open, tourism])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setConfirmDialogOpen(true)
  }

  const handleConfirmSubmit = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/tourism/${tourism.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ticketPrice: parseInt(formData.ticketPrice),
        }),
      })

      if (response.ok) {
        setConfirmDialogOpen(false)
        setOpen(false)
        onSuccess()
      }
    } catch (error) {
      console.error('Error updating tourism spot:', error)
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
          <DialogTitle>Edit Tempat Wisata</DialogTitle>
          <DialogDescription>
            Ubah informasi tempat wisata
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Tempat Wisata *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              <Label htmlFor="address">Alamat *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mapUrl">URL Peta</Label>
              <Input
                id="mapUrl"
                type="url"
                value={formData.mapUrl}
                onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ticketPrice">Harga Tiket *</Label>
              <Input
                id="ticketPrice"
                type="number"
                value={formData.ticketPrice}
                onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="openingHours">Jam Buka *</Label>
                <Input
                  id="openingHours"
                  type="time"
                  value={formData.openingHours}
                  onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="closingHours">Jam Tutup *</Label>
                <Input
                  id="closingHours"
                  type="time"
                  value={formData.closingHours}
                  onChange={(e) => setFormData({ ...formData, closingHours: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contactPerson">Kontak Person</Label>
              <Input
                id="contactPerson"
                type="tel"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              />
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
            <AlertDialogTitle>Konfirmasi Edit Wisata</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin mengubah data tempat wisata ini? Pastikan semua data sudah benar.
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