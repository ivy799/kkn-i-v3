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

interface User {
    id: number
    username: string
    role: string
}

interface EditUserDialogProps {
    children: React.ReactNode
    user: User
    onSuccess: () => void
}

export function EditUserDialog({ children, user, onSuccess }: EditUserDialogProps) {
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false)
    const [formData, setFormData] = React.useState({
        username: user.username,
        password: "",
        role: user.role
    })

    React.useEffect(() => {
        setFormData({
            username: user.username,
            password: "",
            role: user.role
        })
    }, [user])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setConfirmDialogOpen(true)
    }

    const handleConfirmSubmit = async () => {
        setLoading(true)

        try {
            const payload: any = {
                username: formData.username,
                role: formData.role,
            }

            // Only include password if it's been changed
            if (formData.password) {
                payload.password = formData.password
            }

            const response = await fetch(`/api/user/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            const result = await response.json()

            if (response.ok) {
                toast.success('Pengguna berhasil diperbarui')
                setConfirmDialogOpen(false)
                setOpen(false)
                onSuccess()
            } else {
                toast.error(result.message || 'Gagal memperbarui pengguna')
            }
        } catch (error) {
            console.error('Error updating user:', error)
            toast.error('Terjadi kesalahan')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Pengguna</DialogTitle>
                    <DialogDescription>
                        Perbarui data pengguna. Kosongkan password jika tidak ingin mengubahnya.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-username">Username</Label>
                            <Input
                                id="edit-username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                placeholder="Masukkan username"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-password">Password Baru</Label>
                            <Input
                                id="edit-password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Kosongkan jika tidak diubah"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-role">Role</Label>
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
                        <AlertDialogTitle>Konfirmasi Edit Pengguna</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin mengubah data pengguna ini? Pastikan semua data sudah benar.
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
