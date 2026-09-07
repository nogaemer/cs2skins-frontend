"use client";

import {useEffect, useMemo, useState} from "react";
import type {PriceHistoryResponse, SkinDetail} from "@/lib/types";
import {fetchPriceHistory} from "@/lib/api";

import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";

import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from "recharts";
import {MarketSummary} from "@/components/skins/market-summary";
import {ExternalLink} from "lucide-react";

const VARIANT_LABELS: Record<string, string> = {
    normal: "Normal",
    stattrak: "StatTrak",
    souvenir: "Souvenir",
};

function formatWearBucket(wear: string) {
    return wear.replaceAll("_", " ");
}

function formatWearBucketForSteam(wear: string) {
    const map: Record<string, string> = {
        factory_new: "Factory New",
        minimal_wear: "Minimal Wear",
        field_tested: "Field-Tested",
        well_worn: "Well-Worn",
        battle_scarred: "Battle-Scarred",
    };
    return map[wear] ?? wear;
}

function formatPrice(value: number | null) {
    if (value === null || value === undefined) return "—";
    return `$${value.toFixed(2)}`;
}

function formatPercent(value: number | null) {
    if (value === null || value === undefined) return "—";
    return `${value.toFixed(2)}%`;
}

interface SkinDetailClientProps {
    skin: SkinDetail;
}

export function SkinDetailClient({skin}: SkinDetailClientProps) {
    const [selectedVariant, setSelectedVariant] = useState(
        skin.variants[0]?.type ?? "normal",
    );
    const [selectedWear, setSelectedWear] = useState<string | null>(null);
    const [priceHistory, setPriceHistory] = useState<PriceHistoryResponse | null>(null);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const activeVariant = skin.variants.find(
        (v) => v.type === selectedVariant,
    );

    useEffect(() => {
        if (activeVariant && activeVariant.pricesByWear.length > 0) {
            setSelectedWear(activeVariant.pricesByWear[0].wearBucket);
        } else {
            setSelectedWear(null);
        }
    }, [selectedVariant, activeVariant]);

    useEffect(() => {
        if (!activeVariant || !selectedWear) {
            setPriceHistory(null);
            return;
        }

        let cancelled = false;
        setLoadingHistory(true);

        fetchPriceHistory(activeVariant.itemId, selectedWear, "30d")
            .then((data) => {
                if (!cancelled) setPriceHistory(data);
            })
            .catch(() => {
                if (!cancelled) setPriceHistory(null);
            })
            .finally(() => {
                if (!cancelled) setLoadingHistory(false);
            });

        return () => {
            cancelled = true;
        };
    }, [activeVariant, selectedWear]);

    const chartData = useMemo(() => {
        if (!priceHistory) return [];
        return priceHistory.points
            .map((point) => ({
                timestamp: new Date(point.observedAt).getTime(),
                averagePrice: point.averagePrice,
            }))
            .sort((a, b) => a.timestamp - b.timestamp);
    }, [priceHistory]);

    const selectedWearData = activeVariant?.pricesByWear.find(
        (p) => p.wearBucket === selectedWear,
    );

    const variant = activeVariant ?? skin.variants[0];

    return (
        <div className="space-y-8">
            {/* Variant selector - segmented */}
            {skin.variants.length > 1 && (
                <div className="grid w-full grid-flow-col gap-1 rounded-full bg-muted p-1">
                    {skin.variants.map((v) => {
                        const isActive = v.type === selectedVariant;
                        return (
                            <button
                                key={v.type}
                                onClick={() => setSelectedVariant(v.type)}
                                className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition-colors ${
                                    isActive
                                        ? "bg-background text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {VARIANT_LABELS[v.type] ?? v.type}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Content for active variant */}
            <div className="space-y-8">
                {/* Wear selector */}
                <div>
                    <p className="mb-3 text-sm font-medium text-muted-foreground">
                        Select wear
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {variant.pricesByWear.map((price) => {
                            const isSelected = selectedWear === price.wearBucket;
                            return (
                                <button
                                    key={price.wearBucket}
                                    onClick={() => setSelectedWear(price.wearBucket)}
                                    className={`rounded-xl px-4 py-2 text-left transition-colors ${
                                        isSelected
                                            ? "bg-muted text-foreground"
                                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                    }`}
                                >
                                    <span className="block text-xs font-medium capitalize leading-tight">
                                        {formatWearBucket(price.wearBucket)}
                                    </span>
                                    <span className="mt-0.5 block text-sm font-semibold">
                                        {formatPrice(price.averagePrice)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {selectedWear && (
                    <a
                        href={getSteamMarketUrl(
                            skin.marketHashName || skin.name,
                            selectedWear,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                        View on Steam Market
                        <ExternalLink className="size-4" />
                    </a>
                )}

                {/* Market summary */}
                {selectedWearData ? (
                    <MarketSummary data={selectedWearData}/>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Select a wear condition to see details.
                    </p>
                )}

                {/* Price history */}
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle>Price History</CardTitle>
                        <CardDescription>
                            {selectedWear
                                ? `30-day trend for ${formatWearBucket(selectedWear)}`
                                : "Select a wear condition"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loadingHistory ? (
                            <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
                                Loading...
                            </div>
                        ) : chartData.length > 0 ? (
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={chartData}
                                        margin={{top: 5, right: 20, bottom: 5, left: 0}}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
                                        <XAxis
                                            dataKey="timestamp"
                                            type="number"
                                            scale="time"
                                            domain={["dataMin", "dataMax"]}
                                            tickFormatter={(timestamp) =>
                                                new Date(timestamp).toLocaleDateString()
                                            }
                                            tick={{fontSize: 12}}
                                            stroke="var(--muted-foreground)"
                                        />
                                        <YAxis
                                            tick={{fontSize: 12}}
                                            stroke="var(--muted-foreground)"
                                            domain={["auto", "auto"]}
                                            tickFormatter={(value) => `$${value}`}
                                        />
                                        <Tooltip
                                            labelFormatter={(label) => {
                                                const timestamp = Number(label);
                                                return Number.isFinite(timestamp)
                                                    ? new Date(timestamp).toLocaleString()
                                                    : String(label);
                                            }}
                                            formatter={(value) => {
                                                if (typeof value === "number") {
                                                    return [`$${value.toFixed(2)}`, "Price"];
                                                }
                                                return [String(value), "Price"];
                                            }}
                                            contentStyle={{
                                                backgroundColor: "var(--background)",
                                                border: "1px solid var(--border)",
                                                borderRadius: "8px",
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="averagePrice"
                                            stroke="var(--primary)"
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{r: 5}}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
                                No history available
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function getSteamMarketUrl(marketHashName: string, wearBucket: string) {
    const wearName = formatWearBucketForSteam(wearBucket);
    return `https://steamcommunity.com/market/listings/730/${encodeURIComponent(
        `${marketHashName} (${wearName})`,
    )}`;
}