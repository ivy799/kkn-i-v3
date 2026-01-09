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

interface EditBusinessDialogProps {
  children: React.ReactNode
  business: Business
  onSuccess: () => void
}

export function EditBusinessDialog({ children, business, onSuccess }: EditBusinessDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    type: business.type || "",
    name: business.name || "",
    ownerName: business.ownerName || "",
    phoneNumber: business.phoneNumber || "",
    description: business.description || "",
    minimumPrice: business.minimumPrice?.toString() || "",
    maximumPrice: business.maximumPrice?.toString() || "",
    address: business.address || "",
    status: business.status,
    rejectionReason: business.rejectionReason || "",
  })

  React.useEffect(() => {
    if (open) {
      setFormData({
        type: business.type || "",
        name: business.name || "",
        ownerName: business.ownerName || "",
        phoneNumber: business.phoneNumber || "",
        description: business.description || "",
        minimumPrice: business.minimumPrice?.toString() || "",
        maximumPrice: business.maximumPrice?.toString() || "",
        address: business.address || "",
        status: business.status,
        rejectionReason: business.rejectionReason || "",
      })
    }
  }, [open, business])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/business/${business.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          minimumPrice: parseInt(formData.minimumPrice),
          maximumPrice: parseInt(formData.maximumPrice),
        }),
      })

      if (response.ok) {
        setOpen(false)
        onSuccess()
      }
    } catch (error) {
      console.error('Error updating business:', error)
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
          <DialogTitle>Edit Bisnis</DialogTitle>
          <DialogDescription>
            Ubah informasi bisnis
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Tipe Bisnis *</Label>
              <Input
                id="type"
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

            {formData.status === "REJECTED" && (
              <div className="grid gap-2">
                <Label htmlFor="rejectionReason">Alasan Penolakan</Label>
                <Textarea
                  id="rejectionReason"
                  value={formData.rejectionReason}
                  onChange={(e) => setFormData({ ...formData, rejectionReason: e.target.value })}
                  rows={3}
                />
              </div>
            )}
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
    </Dialog>
  )
}