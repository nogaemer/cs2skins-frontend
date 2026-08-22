import Image from "next/image";
import Link from "next/link";
import { fetchCollections, fetchSkins } from "@/lib/api";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { SkinFiltersSidebar } from "@/components/skins/skin-filters-sidebar";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { buildQueryString } from "@/lib/build-query-string";
import type {SkinFilters, SkinVariant} from "@/lib/types";

interface SkinsPageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SkinsPage({ searchParams }: SkinsPageProps) {
    const params = await searchParams;

    const getString = (key: string) => {
        const value = params[key];
        if (Array.isArray(value)) return value[0];
        return value;
    };

    const page = Number(getString("page") ?? 0);
    const size = Number(getString("size") ?? 24);

    const filters: SkinFilters = {
        search: getString("search"),
        collectionId: getString("collectionId"),
        rarityId: getString("rarityId") ? Number(getString("rarityId")) : undefined,
        wearBucket: getString("wearBucket"),
        stattrak: getString("stattrak") === "true" ? true : undefined,
        souvenir: getString("souvenir") === "true" ? true : undefined,
        sort: getString("sort") ?? "name,asc",
        page,
        size,
    };

    const [skinsData, collectionsData] = await Promise.all([
        fetchSkins(filters),
        fetchCollections(),
    ]);

    const totalPages = skinsData.page.totalPages;

    const baseQuery = buildQueryString({
        search: filters.search,
        collectionId: filters.collectionId,
        rarityId: filters.rarityId,
        wearBucket: filters.wearBucket,
        stattrak: filters.stattrak,
        souvenir: filters.souvenir,
        sort: filters.sort,
        size: filters.size,
    });

    const pageHref = (pageNumber: number) => {
        const query = new URLSearchParams(baseQuery);
        query.set("page", String(pageNumber));
        return `/skins?${query.toString()}`;
    };

    const pageNumbers: number[] = [];
    const maxVisible = 5;
    let startPage = Math.max(0, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);
    if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(0, endPage - maxVisible + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    function splitSkinName(name: string) {
        const parts = name.split(" | ");
        if (parts.length === 2) {
            return { weapon: parts[0], skin: parts[1] };
        }
        return { weapon: "", skin: name };
    }

    function formatWearBucket(wear: string) {
        return wear.replaceAll("_", " ");
    }

    function getDefaultVariant(variants: SkinVariant[]) {
        return (
            variants.find((v) => v.type === "normal") ??
            variants[0]
        );
    }

    function getDefaultWearPrice(variant: SkinVariant | undefined) {
        if (!variant) return null;

        return (
            variant.pricesByWear.find((p) => p.wearBucket === "field_tested") ??
            variant.pricesByWear[0] ??
            null
        );
    }

    function getPriceRange(variant: SkinVariant | undefined): {
        min: number | null;
        max: number | null;
    } {
        if (!variant || variant.pricesByWear.length === 0) {
            return { min: null, max: null };
        }

        const prices = variant.pricesByWear.map((p) => p.averagePrice);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices),
        };
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar outside PageContainer */}
            <aside className="hidden w-sm shrink-0 border-r bg-background lg:block">
                <div className="p-4 sticky top-16">
                    <SkinFiltersSidebar collections={collectionsData.collections} />
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 p-8">
                <PageContainer>
                    <PageHeader
                        overline="Catalog"
                        title="Skins"
                        description={`${skinsData.page.totalElements} skins available`}
                    />

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-4">
                        {skinsData.content.map((skin) => {
                            const rarityColor = skin.rarityColorHex
                                ? `#${skin.rarityColorHex}`
                                : "var(--border)";

                            const hasStattrak = skin.variants.some((v) => v.type === "stattrak");
                            const hasSouvenir = skin.variants.some((v) => v.type === "souvenir");
                            const normalVariant = getDefaultVariant(skin.variants);
                            const priceRange = getPriceRange(normalVariant);
                            const { weapon, skin: skinName } = splitSkinName(skin.name);

                            return (
                                <Link
                                    key={skin.id}
                                    href={`/skins/${skin.id}`}
                                    className="group relative flex flex-col items-center overflow-hidden rounded-xl border border-[var(--rarity)]/25 p-5 transition-colors duration-300 hover:border-[var(--rarity)]/50"
                                    style={{
                                        "--rarity": rarityColor,
                                    } as React.CSSProperties}
                                >
                                    {/* Rarity color glow */}
                                    <div
                                        className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-100"
                                        style={{
                                            background: `radial-gradient(circle at 50% 100%, ${rarityColor}30, transparent 70%)`,
                                        }}
                                    />

                                    {/* Variant tags */}
                                    <div className="absolute right-2 top-2 z-20 flex flex-col gap-1 items-end">
                                        {hasSouvenir && (
                                            <span className="rounded-md bg-yellow-500/15 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-yellow-600">
                                                Souvenir
                                            </span>
                                        )}
                                        {hasStattrak && (
                                            <span className="rounded-md bg-orange-500/15 px-1.5 py-0.5 text-[0.6rem] w-auto font-bold uppercase w-fit tracking-wide text-orange-500">
                                                ST
                                            </span>
                                        )}
                                    </div>

                                    {/* Image */}
                                    <div className="relative z-10 aspect-square w-full">
                                        <Image
                                            src={skin.imageUrl ?? "/placeholder.svg"}
                                            alt={skin.name}
                                            fill
                                            className="object-contain transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>

                                    {/* Text below image */}
                                    <div className="relative z-10 mt-4 flex w-full flex-col items-center text-center">
                                        <span className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                                            {weapon}
                                        </span>

                                        <div className="flex w-fit flex-col items-center">
                                            <span className="mt-0.5 text-sm font-medium leading-tight">
                                                {skinName}
                                            </span>
                                            <span
                                                className="mt-2 h-1 w-8 rounded-full transition-all duration-300 group-hover:w-full"
                                                style={{ backgroundColor: rarityColor }}
                                            />
                                        </div>

                                        <div className="mt-2 flex items-center gap-2 text-xs">
                                            {priceRange.min !== null && priceRange.max !== null ? (
                                                <span className="font-semibold text-foreground">
                                                    ${priceRange.min.toFixed(2)} – ${priceRange.max.toFixed(2)}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">No price</span>
                                            )}
                                        </div>

                                        <span className="mt-1 w-full truncate text-center text-[0.6rem] text-muted-foreground/70">
                                            {skin.collectionName ?? "Unknown collection"}
                                        </span>
                                    </div>
                                </Link>                            );
                        })}
                    </div>                    {totalPages > 1 ? (
                        <div className="mt-8">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={page > 0 ? pageHref(page - 1) : "#"}
                                            aria-disabled={page === 0}
                                            tabIndex={page === 0 ? -1 : undefined}
                                            className={
                                                page === 0 ? "pointer-events-none opacity-50" : ""
                                            }
                                        />
                                    </PaginationItem>

                                    {startPage > 0 && (
                                        <>
                                            <PaginationItem>
                                                <PaginationLink href={pageHref(0)}>1</PaginationLink>
                                            </PaginationItem>
                                            {startPage > 1 && (
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            )}
                                        </>
                                    )}

                                    {pageNumbers.map((pageNumber) => (
                                        <PaginationItem key={pageNumber}>
                                            <PaginationLink
                                                href={pageHref(pageNumber)}
                                                isActive={pageNumber === page}
                                            >
                                                {pageNumber + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                    {endPage < totalPages - 1 && (
                                        <>
                                            {endPage < totalPages - 2 && (
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            )}
                                            <PaginationItem>
                                                <PaginationLink href={pageHref(totalPages - 1)}>
                                                    {totalPages}
                                                </PaginationLink>
                                            </PaginationItem>
                                        </>
                                    )}

                                    <PaginationItem>
                                        <PaginationNext
                                            href={
                                                page < totalPages - 1 ? pageHref(page + 1) : "#"
                                            }
                                            aria-disabled={page === totalPages - 1}
                                            tabIndex={page === totalPages - 1 ? -1 : undefined}
                                            className={
                                                page === totalPages - 1
                                                    ? "pointer-events-none opacity-50"
                                                    : ""
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    ) : null}
                </PageContainer>
            </div>
        </div>
    );
}