import Image from "next/image";
import Link from "next/link";
import type {SkinDetail} from "@/lib/types";
import {ExternalLink} from "lucide-react";

const FLOAT_HANDLE_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='12' viewBox='0 0 16 12' fill='none'%3E%3Cpath d='M6.49485 2.20158L1.69861 7.68299C0.567091 8.97616 1.48545 11 3.20377 11H12.7962C14.5145 11 15.4329 8.97616 14.3014 7.68299L9.50515 2.20158C8.70833 1.29093 7.29167 1.29093 6.49485 2.20158Z' fill='white' stroke='%231B1D24' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`;

interface SkinDetailsProps {
    skin: SkinDetail;
}

export function SkinDetails({skin}: SkinDetailsProps) {
    const rarityColor = skin.rarity?.colorHex
        ? `#${skin.rarity.colorHex}`
        : "var(--border)";

    // Get latest observedAt from all variant prices
    const latestObservedAt = skin.variants
        .flatMap((v) => v.pricesByWear)
        .map((p) => p.observedAt)
        .sort()
        .at(-1);

    const minFloatPercent = skin.minFloat * 100;
    const maxFloatPercent = skin.maxFloat * 100;
    const rangePercent = maxFloatPercent - minFloatPercent;

    return (
        <div className="flex flex-col self-start">

            {/* Key details */}
            <dl className="mt-8 space-y-6">
                {/* Collection */}
                <div className="flex items-start justify-between gap-6 border-b pb-4">
                    <dt className="text-sm text-muted-foreground">Collection</dt>
                    <dd className="flex items-center gap-3">
                        {skin.collection?.imageUrl && (
                            <span className="relative size-6 shrink-0 overflow-hidden rounded bg-muted/30">
                <Image
                    src={skin.collection.imageUrl}
                    alt={skin.collection.name}
                    fill
                    className="object-cover"
                />
              </span>
                        )}
                        <span className="text-sm font-medium">
              {skin.collection ? (
                  <Link
                      href={`/collections/${skin.collection.id}`}
                      className="hover:underline"
                  >
                      {skin.collection.name}
                  </Link>
              ) : (
                  "Unknown"
              )}
            </span>
                    </dd>
                </div>

                {/* Rarity */}
                <div className="flex items-start justify-between gap-6 border-b pb-4">
                    <dt className="text-sm text-muted-foreground">Rarity</dt>
                    <dd className="flex items-center gap-2 text-sm font-medium">
            <span
                className="size-2.5 rounded-full"
                style={{backgroundColor: rarityColor}}
            />
                        <span style={{color: rarityColor}}>
              {skin.rarity?.name ?? "Unknown"}
            </span>
                    </dd>
                </div>

                {/* Weapon */}
                <div className="flex items-start justify-between gap-6 border-b pb-4">
                    <dt className="text-sm text-muted-foreground">Weapon</dt>
                    <dd className="text-sm font-medium">
                        {skin.weaponName ?? "Unknown"}
                    </dd>
                </div>

                {/* Market hash name */}
                <div className="flex items-start justify-between gap-6 border-b pb-4">
                    <dt className="text-sm text-muted-foreground">Market name</dt>
                    <dd className="text-right text-sm font-medium">
                        {skin.marketHashName}
                    </dd>
                </div>

                {/* Float range */}
                <div>
                    <div className="flex items-start justify-between gap-6">
                        <dt className="text-sm text-muted-foreground">Float range</dt>
                        <dd className="text-sm font-medium">
                            {skin.minFloat.toFixed(2)} – {skin.maxFloat.toFixed(2)}
                        </dd>
                    </div>

                    {/* Float visual */}
                    <div className="relative mt-5 h-10">
                        {/* Track */}
                        <div
                            className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-linear-to-r from-green-500 via-yellow-500 to-red-500"/>

                        {/* Highlight segment */}
                        <div
                            className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-background/40"
                            style={{
                                left: `${minFloatPercent}%`,
                                width: `${rangePercent}%`,
                            }}
                        />

                        {/* Min handle */}
                        <div
                            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                            style={{left: `${minFloatPercent}%`}}
                        >
                            <div
                                className="h-3 w-4 bg-contain bg-center bg-no-repeat"
                                style={{
                                    backgroundImage: FLOAT_HANDLE_BG,
                                    pointerEvents: "none",
                                }}
                            />
                        </div>

                        {/* Max handle */}
                        <div
                            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                            style={{left: `${maxFloatPercent}%`}}
                        >
                            <div
                                className="h-3 w-4 bg-contain bg-center bg-no-repeat"
                                style={{
                                    backgroundImage: FLOAT_HANDLE_BG,
                                    pointerEvents: "none",
                                }}
                            />
                        </div>
                    </div>
                </div>


                {/* Last updated */}
                {latestObservedAt && (
                    <div className="flex items-start justify-between gap-6 border-t pt-4">
                        <dt className="text-sm text-muted-foreground">Last updated</dt>
                        <dd className="text-sm font-medium">
                            {new Date(latestObservedAt).toLocaleString()}
                        </dd>
                    </div>
                )}
            </dl>
        </div>
    );
}

