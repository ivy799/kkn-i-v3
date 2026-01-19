"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface VillageProfile {
    id: number
    villageName: string | null
    address: string | null
    email: string | null
    phone: string | null
    vision: string | null
    mission: string | null
    mapEmbedCode: string | null
}

interface VillageProfileFormProps {
    data: VillageProfile | null
    loading: boolean
    onRefresh: () => void
}

export function VillageProfileForm({ data, loading, onRefresh }: VillageProfileFormProps) {
    const [saving, setSaving] = React.useState(false)
    const [formData, setFormData] = React.useState({
        villageName: "",
        address: "",
        email: "",
        phone: "",
        vision: "",
        mission: "",
        mapEmbedCode: ""
    })

    React.useEffect(() => {
        if (data) {
            setFormData({
                villageName: data.villageName || "",
                address: data.address || "",
                email: data.email || "",
                phone: data.phone || "",
                vision: data.vision || "",
                mission: data.mission || "",
                mapEmbedCode: data.mapEmbedCode || ""
            })
        }
    }, [data])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setSaving(true)
            const response = await fetch('/api/village-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const result = await response.json()

            if (result.success) {
                alert('Profil desa berhasil diperbarui')
                onRefresh()
            } else {
                alert('Gagal memperbarui profil desa')
            }
        } catch (error) {
            console.error('Error updating village profile:', error)
            alert('Terjadi kesalahan saat memperbarui profil desa')
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    if (loading) {
        return (
            <div className="px-4 lg:px-6">
                <div className="flex items-center justify-center py-8">
                    <div className="text-center space-y-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                        <p className="text-muted-foreground">Memuat data profil...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="px-4 lg:px-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Profil Desa</h2>
                <p className="text-muted-foreground">Kelola informasi profil desa</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Umum</CardTitle>
                            <CardDescription>Informasi dasar tentang desa</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="villageName">Nama Desa</Label>
                                <Input
                                    id="villageName"
                                    value={formData.villageName}
                                    onChange={(e) => handleChange('villageName', e.target.value)}
                                    placeholder="Masukkan nama desa"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Alamat</Label>
                                <Textarea
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                    placeholder="Masukkan alamat lengkap desa"
                                    rows={3}
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        placeholder="email@desa.id"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telepon</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        placeholder="08xx-xxxx-xxxx"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Visi & Misi</CardTitle>
                            <CardDescription>Visi dan misi desa</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="vision">Visi</Label>
                                <Textarea
                                    id="vision"
                                    value={formData.vision}
                                    onChange={(e) => handleChange('vision', e.target.value)}
                                    placeholder="Masukkan visi desa"
                                    rows={4}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="mission">Misi</Label>
                                <Textarea
                                    id="mission"
                                    value={formData.mission}
                                    onChange={(e) => handleChange('mission', e.target.value)}
                                    placeholder="Masukkan misi desa"
                                    rows={6}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Peta Lokasi</CardTitle>
                            <CardDescription>Kode embed peta dari Google Maps atau layanan lainnya</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="mapEmbedCode">Kode Embed Peta</Label>
                                <Textarea
                                    id="mapEmbedCode"
                                    value={formData.mapEmbedCode}
                                    onChange={(e) => handleChange('mapEmbedCode', e.target.value)}
                                    placeholder='<iframe src="..." width="600" height="450"></iframe>'
                                    rows={4}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={saving}>
                            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
