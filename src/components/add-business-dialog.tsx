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

interface AddBusinessDialogProps {
  children: React.ReactNode
  onSuccess: () => void
  onOperatingChange?: (operating: boolean) => void
}

export function AddBusinessDialog({ children, onSuccess, onOperatingChange }: AddBusinessDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false)
  const [images, setImages] = React.useState<File[]>([])
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([])
  const [formData, setFormData] = React.useState({
    type: "",
    name: "",
    ownerName: "",
    phoneNumber: "",
    description: "",
    minimumPrice: "",
    maximumPrice: "",
    address: "",
    status: "PENDING",
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
    onOperatingChange?.(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('type', formData.type)
      formDataToSend.append('name', formData.name)
      formDataToSend.append('ownerName', formData.ownerName)
      formDataToSend.append('phoneNumber', formData.phoneNumber)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('minimumPrice', formData.minimumPrice)
      formDataToSend.append('maximumPrice', formData.maximumPrice)
      formDataToSend.append('address', formData.address)
      formDataToSend.append('status', formData.status)

      images.forEach((image) => {
        formDataToSend.append('images', image)
      })

      const response = await fetch('/api/business', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        setConfirmDialogOpen(false)
        setOpen(false)
        setFormData({
          type: "",
          name: "",
          ownerName: "",
          phoneNumber: "",
          description: "",
          minimumPrice: "",
          maximumPrice: "",
          address: "",
          status: "PENDING",
        })
        setImages([])
        setImagePreviews([])
        onSuccess()
      }
    } catch (error) {
      console.error('Error creating business:', error)
    } finally {
      setLoading(false)
      onOperatingChange?.(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Bisnis</DialogTitle>
          <DialogDescription>
            Isi form di bawah untuk menambahkan bisnis baru
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Tipe Bisnis *</Label>
              <Input
                id="type"
                placeholder="Contoh: Kuliner, Jasa, Retail"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Nama Bisnis *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ownerName">Nama Pemilik *</Label>
                <Input
                  id="ownerName"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">No. Telepon *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                />
              </div>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="minimumPrice">Harga Minimum *</Label>
                <Input
                  id="minimumPrice"
                  type="number"
                  value={formData.minimumPrice}
                  onChange={(e) => setFormData({ ...formData, minimumPrice: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="maximumPrice">Harga Maximum *</Label>
                <Input
                  id="maximumPrice"
                  type="number"
                  value={formData.maximumPrice}
                  onChange={(e) => setFormData({ ...formData, maximumPrice: e.target.value })}
                  required
                />
              </div>
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
              <Label htmlFor="images">Gambar Bisnis (Multiple)</Label>
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
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Disetujui</SelectItem>
                  <SelectItem value="REJECTED">Ditolak</SelectItem>
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
            <AlertDialogTitle>Konfirmasi Tambah Bisnis</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menambahkan bisnis ini? Pastikan semua data sudah benar.
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