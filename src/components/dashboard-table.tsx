"use client"

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { IconMap, IconBuilding, IconCalendarEvent, IconPhoto } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface TourismSpot {
    id: number
    name: string | null
    description: string | null
    _count: {
        TourismSpotGallery: number
    }
}

interface Business {
    id: number
    name: string | null
    description: string | null
    type: string | null
}

interface Event {
    id: number
    title: string
    description: string | null
    startDate: string
    status: string
}

type DashboardItem = {
    id: number
    name: string
    type: "wisata" | "umkm" | "event"
    category: string | null
    description: string | null
    extra?: string
}

interface DashboardTableProps {
    tourismSpots: TourismSpot[]
    businesses: Business[]
    events: Event[]
}

const columns: ColumnDef<DashboardItem>[] = [
    {
        accessorKey: "type",
        header: "Tipe",
        cell: ({ row }) => {
            const type = row.getValue("type") as string
            const icons = {
                wisata: <IconMap className="size-4" />,
                umkm: <IconBuilding className="size-4" />,
                event: <IconCalendarEvent className="size-4" />,
            }
            const colors = {
                wisata: "bg-green-100 text-green-700",
                umkm: "bg-blue-100 text-blue-700",
                event: "bg-purple-100 text-purple-700",
            }
            return (
                <Badge variant="outline" className={colors[type as keyof typeof colors]}>
                    {icons[type as keyof typeof icons]}
                    <span className="ml-1 capitalize">{type}</span>
                </Badge>
            )
        },
    },
    {
        accessorKey: "name",
        header: "Nama",
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "category",
        header: "Kategori",
        cell: ({ row }) => (
            <span className="text-muted-foreground">
                {row.getValue("category") || "-"}
            </span>
        ),
    },
    {
        accessorKey: "description",
        header: "Deskripsi",
        cell: ({ row }) => {
            const desc = row.getValue("description") as string | null
            return (
                <span className="text-muted-foreground line-clamp-1 max-w-[300px]">
                    {desc || "-"}
                </span>
            )
        },
    },
    {
        accessorKey: "extra",
        header: "Info",
        cell: ({ row }) => {
            const extra = row.getValue("extra") as string | undefined
            return extra ? (
                <span className="text-sm text-muted-foreground">{extra}</span>
            ) : null
        },
    },
]

export function DashboardTable({ tourismSpots, businesses, events }: DashboardTableProps) {
    // Combine all data into a single array
    const data: DashboardItem[] = React.useMemo(() => {
        const items: DashboardItem[] = []

        tourismSpots.forEach((spot) => {
            items.push({
                id: spot.id,
                name: spot.name || 'Untitled',
                type: "wisata",
                category: null,
                description: spot.description,
                extra: `${spot._count.TourismSpotGallery} foto`,
            })
        })

        businesses.forEach((biz) => {
            items.push({
                id: biz.id + 1000,
                name: biz.name || 'Untitled',
                type: "umkm",
                category: biz.type,
                description: biz.description,
            })
        })

        events.forEach((evt) => {
            items.push({
                id: evt.id + 2000,
                name: evt.title,
                type: "event",
                category: evt.status,
                description: evt.description,
                extra: new Date(evt.startDate).toLocaleDateString("id-ID"),
            })
        })

        return items
    }, [tourismSpots, businesses, events])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    })

    return (
        <div className="px-4 lg:px-6">
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Tidak ada data.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} data
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Sebelumnya
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Selanjutnya
                    </Button>
                </div>
            </div>
        </div>
    )
}
