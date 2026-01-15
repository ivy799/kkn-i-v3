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
import { AddUserDialog } from "./add-user-dialog"
import { EditUserDialog } from "./edit-user-dialog"
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
import { toast } from "sonner"

interface User {
    id: number
    username: string
    role: string
    createdAt: string
}

interface UsersDataTableProps {
    data: User[]
    loading: boolean
    onRefresh: () => void
}

export function UsersDataTable({ data, loading, onRefresh }: UsersDataTableProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
    const [userToDelete, setUserToDelete] = React.useState<number | null>(null)
    const [deleting, setDeleting] = React.useState(false)
    const [isOperating, setIsOperating] = React.useState(false)

    const handleDelete = async () => {
        if (!userToDelete) return

        try {
            setDeleting(true)
            setIsOperating(true)
            const response = await fetch(`/api/user/${userToDelete}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                toast.success('Pengguna berhasil dihapus')
                onRefresh()
                setDeleteDialogOpen(false)
                setUserToDelete(null)
            } else {
                toast.error('Gagal menghapus pengguna')
            }
        } catch (error) {
            console.error('Error deleting user:', error)
            toast.error('Terjadi kesalahan')
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

    const getRoleBadge = (role: string) => {
        const variants: Record<string, "default" | "secondary"> = {
            ADMIN: "default",
            USER: "secondary",
        }
        return <Badge variant={variants[role] || "secondary"}>{role}</Badge>
    }

    return (
        <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Pengguna</h2>
                    <p className="text-muted-foreground">Kelola data pengguna sistem</p>
                </div>
                <AddUserDialog onSuccess={onRefresh} onOperatingChange={setIsOperating}>
                    <Button disabled={isOperating || loading}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Tambah User
                    </Button>
                </AddUserDialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">No</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Tanggal Dibuat</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    Tidak ada data
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((user, index) => (
                                <TableRow key={user.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">{user.username}</TableCell>
                                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <EditUserDialog user={user} onSuccess={onRefresh} onOperatingChange={setIsOperating}>
                                                <Button variant="ghost" size="icon" disabled={isOperating || loading}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </EditUserDialog>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                disabled={isOperating || loading}
                                                onClick={() => {
                                                    setUserToDelete(user.id)
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
                        <AlertDialogTitle>Hapus Pengguna</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.
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
