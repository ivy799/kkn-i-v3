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

interface AddTourismDialogProps {
  children: React.ReactNode
  onSuccess: () => void
}

export function AddTourismDialog({ children, onSuccess }: AddTourismDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false)
  const [images, setImages] = React.useState<File[]>([])
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([])
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    address: "",
    mapUrl: "",
    ticketPrice: "",
    openingHours: "",
    closingHours: "",
    contactPerson: "",
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setImages(files)

      const previews: string[] = []
      files.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          previews.push(reader.result as string)
          if (previews.length === files.length) {
            setImagePreviews(previews)
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setConfirmDialogOpen(true)
  }

  const handleConfirmSubmit = async () => {
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('address', formData.address)
      formDataToSend.append('mapUrl', formData.mapUrl)
      formDataToSend.append('ticketPrice', formData.ticketPrice)
      formDataToSend.append('openingHours', formData.openingHours)
      formDataToSend.append('closingHours', formData.closingHours)
      formDataToSend.append('contactPerson', formData.contactPerson)

      images.forEach((image) => {
        formDataToSend.append('images', image)
      })

      const response = await fetch('/api/tourism', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        setConfirmDialogOpen(false)
        setOpen(false)
        setFormData({
          name: "",
          description: "",
          address: "",
          mapUrl: "",
          ticketPrice: "",
          openingHours: "",
          closingHours: "",
          contactPerson: "",
        })
        setImages([])
        setImagePreviews([])
        onSuccess()
      }
    } catch (error) {
      console.error('Error creating tourism spot:', error)
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
          <DialogTitle>Tambah Tempat Wisata</DialogTitle>
          <DialogDescription>
            Isi form di bawah untuk menambahkan tempat wisata baru
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
                placeholder="https://maps.google.com/..."
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

            <div className="grid gap-2">
              <Label htmlFor="images">Gambar Wisata (Multiple)</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {imagePreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
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
            <AlertDialogTitle>Konfirmasi Tambah Wisata</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menambahkan tempat wisata ini? Pastikan semua data sudah benar.
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