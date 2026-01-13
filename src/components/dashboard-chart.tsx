"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

interface DashboardChartProps {
    data: {
        wisata: number
        umkm: number
        event: number
        galeri: number
    }
}

const chartConfig = {
    wisata: {
        label: "Wisata",
        color: "hsl(142, 76%, 36%)",
    },
    umkm: {
        label: "UMKM",
        color: "hsl(221, 83%, 53%)",
    },
    event: {
        label: "Event",
        color: "hsl(262, 83%, 58%)",
    },
    galeri: {
        label: "Galeri",
        color: "hsl(25, 95%, 53%)",
    },
} satisfies ChartConfig

export function DashboardChart({ data }: DashboardChartProps) {
    const isMobile = useIsMobile()

    const chartData = [
        { name: "Wisata", value: data.wisata, fill: "hsl(142, 76%, 36%)" },
        { name: "UMKM", value: data.umkm, fill: "hsl(221, 83%, 53%)" },
        { name: "Event", value: data.event, fill: "hsl(262, 83%, 58%)" },
        { name: "Galeri", value: data.galeri, fill: "hsl(25, 95%, 53%)" },
    ]

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Statistik Data</CardTitle>
                <CardDescription>
                    Ringkasan data yang tersedia di sistem
                </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart data={chartData} layout="vertical">
                        <CartesianGrid horizontal={false} />
                        <XAxis type="number" />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            width={80}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="value"
                            radius={[0, 4, 4, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
