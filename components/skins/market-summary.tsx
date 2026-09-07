import type {SkinPriceByWear} from "@/lib/types";

function formatPrice(value: number | null) {
    if (value === null || value === undefined) return "—";
    return `$${value.toFixed(2)}`;
}

function formatPercent(value: number | null) {
    if (value === null || value === undefined) return "—";
    return `${value.toFixed(2)}%`;
}

function formatWearBucket(wear: string) {
    return wear.replaceAll("_", " ");
}

interface MarketSummaryProps {
    data: SkinPriceByWear;
}

export function MarketSummary({data}: MarketSummaryProps) {
    const wearName = formatWearBucket(data.wearBucket);

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
            {/* Gradient header */}
            <div className="bg-muted from-primary/10 via-transparent to-primary/5 p-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold capitalize">{wearName}</h3>
                    <span className="text-sm font-medium text-muted-foreground">
            {formatPrice(data.averagePrice)}
          </span>
                </div>
            </div>

            {/* Grouped metrics */}
            <div className="p-5 space-y-5">
                {/* Price group */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Price
                    </p>
                    <div className="mt-2 grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Buy</p>
                            <p className="text-lg font-semibold">{formatPrice(data.buyPrice)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Sell</p>
                            <p className="text-lg font-semibold">{formatPrice(data.sellPrice)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Avg</p>
                            <p className="text-lg font-semibold">{formatPrice(data.averagePrice)}</p>
                        </div>
                    </div>
                </div>

                {/* Liquidity group */}
                <div className="border-t pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Liquidity
                    </p>
                    <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-semibold">
              {data.liquidityScore === null ? "—" : data.liquidityScore.toFixed(0)}
            </span>
                        <div className="h-2 flex-1 rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary"
                                style={{width: `${data.liquidityScore ?? 0}%`}}
                            />
                        </div>
                    </div>
                </div>

                {/* Market depth group */}
                <div className="border-t pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Market depth
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Spread</p>
                            <p className="text-lg font-semibold">{formatPercent(data.spreadPct)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Slippage</p>
                            <p className="text-lg font-semibold">{formatPercent(data.slippagePct)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Impact 5</p>
                            <p className="text-lg font-semibold">{formatPercent(data.priceImpact5Pct)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Impact 10</p>
                            <p className="text-lg font-semibold">{formatPercent(data.priceImpact10Pct)}</p>
                        </div>
                    </div>
                </div>

                {/* Volatility group */}
                <div className="border-t pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Volatility
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">1d</p>
                            <p className="text-lg font-semibold">{formatPercent(data.volatility1d)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">7d</p>
                            <p className="text-lg font-semibold">{formatPercent(data.volatility7d)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}