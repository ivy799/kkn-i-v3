"use client"

import { UserSidebar } from "@/components/user-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import { IconUpload, IconX, IconAlertTriangle } from "@tabler/icons-react"
import { useState, useRef } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Image from "next/image"

const BUSINESS_TYPES = [
    "Kuliner",
    "Kerajinan",
    "Fashion",
    "Pertanian",
    "Peternakan",
    "Jasa",
    "Perdagangan",
    "Lainnya",
]

export default function NewBusinessPage() {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [showWarning, setShowWarning] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [images, setImages] = useState<File[]>([])
    const [previewUrls, setPreviewUrls] = useState<string[]>([])

    const [formData, setFormData] = useState({
        type: '',
        name: '',
        ownerName: '',
        phoneNumber: '',
        description: '',
        minimumPrice: '',
        maximumPrice: '',
        address: '',
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleTypeChange = (value: string) => {
        setFormData(prev => ({ ...prev, type: value }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length + images.length > 5) {
            toast.error('Maksimal 5 gambar')
            return
        }

        const newPreviewUrls = files.map(file => URL.createObjectURL(file))
        setImages(prev => [...prev, ...files])
        setPreviewUrls(prev => [...prev, ...newPreviewUrls])
    }

    const removeImage = (index: number) => {
        URL.revokeObjectURL(previewUrls[index])
        setImages(prev => prev.filter((_, i) => i !== index))
        setPreviewUrls(prev => prev.filter((_, i) => i !== index))
    }

    const validateForm = () => {
        if (!formData.type) {
            toast.error('Pilih jenis bisnis')
            return false
        }
        if (!formData.name.trim()) {
            toast.error('Nama bisnis wajib diisi')
            return false
        }
        if (!formData.ownerName.trim()) {
            toast.error('Nama pemilik wajib diisi')
            return false
        }
        if (!formData.phoneNumber.trim()) {
            toast.error('Nomor telepon wajib diisi')
            return false
        }
        if (!formData.description.trim()) {
            toast.error('Deskripsi wajib diisi')
            return false
        }
        if (!formData.address.trim()) {
            toast.error('Alamat wajib diisi')
            return false
        }
        if (images.length === 0) {
            toast.error('Minimal 1 gambar diperlukan')
            return false
        }
        return true
    }

    const handleSubmitClick = () => {
        if (!validateForm()) return
        setShowWarning(true)
    }

    const handleConfirmSubmit = async () => {
        setShowWarning(false)
        setIsSubmitting(true)

        try {
            const submitData = new FormData()
            submitData.append('type', formData.type)
            submitData.append('name', formData.name)
            submitData.append('ownerName', formData.ownerName)
            submitData.append('phoneNumber', formData.phoneNumber)
            submitData.append('description', formData.description)
            submitData.append('address', formData.address)

            if (formData.minimumPrice) {
                submitData.append('minimumPrice', formData.minimumPrice)
            }
            if (formData.maximumPrice) {
                submitData.append('maximumPrice', formData.maximumPrice)
            }

            images.forEach(image => {
                submitData.append('images', image)
            })

            const response = await fetch('/api/user/business', {
                method: 'POST',
                body: submitData,
            })

            const data = await response.json()

            if (data.success) {
                toast.success('Pengajuan bisnis berhasil dikirim!')
                router.push('/user-dashboard/business')
            } else {
                toast.error(data.message || 'Gagal mengirim pengajuan')
            }
        } catch (error) {
            toast.error('Terjadi kesalahan')
        } finally {
            setIsSubmitting(false)
        }
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
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6 max-w-3xl">
                            {/* Header */}
                            <div>
                                <h1 className="text-2xl font-bold">Ajukan Bisnis Baru</h1>
                                <p className="text-muted-foreground">Isi formulir di bawah untuk mengajukan bisnis Anda</p>
                            </div>

                            {/* Warning Banner */}
                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                <div className="flex gap-3">
                                    <IconAlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-yellow-800">Perhatian!</p>
                                        <p className="text-sm text-yellow-700">
                                            Data yang sudah disubmit <strong>tidak dapat diubah</strong>. Pastikan semua informasi sudah benar sebelum mengirim.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="rounded-xl border bg-card p-6">
                                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                    {/* Business Type */}
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Jenis Bisnis *</Label>
                                        <Select value={formData.type} onValueChange={handleTypeChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih jenis bisnis" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {BUSINESS_TYPES.map(type => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Business Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nama Bisnis *</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Contoh: Warung Makan Sederhana"
                                        />
                                    </div>

                                    {/* Owner Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="ownerName">Nama Pemilik *</Label>
                                        <Input
                                            id="ownerName"
                                            name="ownerName"
                                            value={formData.ownerName}
                                            onChange={handleInputChange}
                                            placeholder="Nama lengkap pemilik bisnis"
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phoneNumber">Nomor Telepon *</Label>
                                        <Input
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            placeholder="Contoh: 081234567890"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Deskripsi *</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Jelaskan tentang bisnis Anda, produk/jasa yang ditawarkan"
                                            rows={4}
                                        />
                                    </div>

                                    {/* Price Range */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="minimumPrice">Harga Minimum (Rp)</Label>
                                            <Input
                                                id="minimumPrice"
                                                name="minimumPrice"
                                                type="number"
                                                value={formData.minimumPrice}
                                                onChange={handleInputChange}
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="maximumPrice">Harga Maksimum (Rp)</Label>
                                            <Input
                                                id="maximumPrice"
                                                name="maximumPrice"
                                                type="number"
                                                value={formData.maximumPrice}
                                                onChange={handleInputChange}
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Alamat *</Label>
                                        <Textarea
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Alamat lengkap lokasi bisnis"
                                            rows={2}
                                        />
                                    </div>

                                    {/* Images */}
                                    <div className="space-y-2">
                                        <Label>Foto Bisnis * (Maksimal 5)</Label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {previewUrls.map((url, index) => (
                                                <div key={index} className="relative aspect-square">
                                                    <Image
                                                        src={url}
                                                        alt={`Preview ${index + 1}`}
                                                        fill
                                                        className="rounded-lg object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-1 hover:bg-red-600"
                                                    >
                                                        <IconX className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            {images.length < 5 && (
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 flex flex-col items-center justify-center gap-2 transition-colors"
                                                >
                                                    <IconUpload className="h-6 w-6 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">Upload</span>
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.back()}
                                            disabled={isSubmitting}
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={handleSubmitClick}
                                            disabled={isSubmitting}
                                            className="flex-1"
                                        >
                                            {isSubmitting ? 'Mengirim...' : 'Ajukan Bisnis'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>

            {/* Confirmation Warning Dialog */}
            <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <IconAlertTriangle className="h-5 w-5 text-yellow-600" />
                            Konfirmasi Pengajuan
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                            <p>
                                <strong>Perhatian!</strong> Data yang sudah disubmit <strong>tidak dapat diubah</strong>.
                            </p>
                            <p>
                                Pastikan semua informasi sudah benar sebelum melanjutkan. Apakah Anda yakin ingin mengirim pengajuan ini?
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Periksa Kembali</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmSubmit}>
                            Ya, Kirim Pengajuan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </SidebarProvider>
    )
}
