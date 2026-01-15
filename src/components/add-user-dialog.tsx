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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface AddUserDialogProps {
    children: React.ReactNode
    onSuccess: () => void
    onOperatingChange?: (operating: boolean) => void
}

export function AddUserDialog({ children, onSuccess, onOperatingChange }: AddUserDialogProps) {
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false)
    const [formData, setFormData] = React.useState({
        username: "",
        password: "",
        role: "USER"
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setConfirmDialogOpen(true)
    }

    const handleConfirmSubmit = async () => {
        setLoading(true)
        onOperatingChange?.(true)

        try {
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const result = await response.json()

            if (response.ok) {
                toast.success('Pengguna berhasil ditambahkan')
                setConfirmDialogOpen(false)
                setOpen(false)
                setFormData({ username: "", password: "", role: "USER" })
                onSuccess()
            } else {
                toast.error(result.message || 'Gagal menambahkan pengguna')
            }
        } catch (error) {
            console.error('Error adding user:', error)
            toast.error('Terjadi kesalahan')
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tambah Pengguna Baru</DialogTitle>
                    <DialogDescription>
                        Isi data pengguna baru di bawah ini.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                placeholder="Masukkan username"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Masukkan password"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value) => setFormData({ ...formData, role: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USER">User</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
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
                        <AlertDialogTitle>Konfirmasi Tambah Pengguna</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menambahkan pengguna ini? Pastikan semua data sudah benar.
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
