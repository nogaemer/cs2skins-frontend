// lib/types.ts

/**
 * Represents a single collection in the list returned by GET /collections.
 */
export interface CollectionSummary {
    id: string;
    name: string;
    imageUrl: string | null;
    itemCount: number;
}

/**
 * Wrapper object for the GET /collections response.
 */
export interface CollectionListResponse {
    collections: CollectionSummary[];
}

/**
 * Represents a single item inside a collection's rarity group.
 * Returned by GET /collections/{id}.
 */
export interface CollectionItem {
    id: string;
    name: string;
    imageUrl: string | null;
}

/**
 * Groups items of the same rarity within a collection detail response.
 */
export interface CollectionRarityGroup {
    rarityId: number;
    rarityName: string;
    rarityColorHex: string | null;
    items: CollectionItem[];
}

/**
 * Full collection detail returned by GET /collections/{id}.
 */
export interface CollectionDetail {
    id: string;
    name: string;
    imageUrl: string | null;
    itemsByRarity: CollectionRarityGroup[];
}

export interface PageMeta {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface PageResponse<T> {
    content: T[];
    page: PageMeta;
}

export interface SkinFilters {
    collectionId?: string;
    rarityId?: number;
    wearBucket?: string;
    stattrak?: boolean;
    souvenir?: boolean;
    search?: string;
    page?: number;
    size?: number;
    sort?: string;
}

export interface SkinPriceByWear {
    wearBucket: string;
    averagePrice: number;
    buyPrice: number | null;
    sellPrice: number | null;
    liquidityScore: number | null;
    spreadPct: number | null;
    slippagePct: number | null;
    priceImpact5Pct: number | null;
    priceImpact10Pct: number | null;
    volatility1d: number | null;
    volatility7d: number | null;
    observedAt: string;
}

export interface SkinVariant {
    type: "normal" | "stattrak" | "souvenir";
    itemId: string;
    pricesByWear: SkinPriceByWear[];
}

export interface SkinSummary {
    id: string;
    name: string;
    collectionId: string | null;
    collectionName: string | null;
    rarityId: number | null;
    rarityName: string | null;
    rarityColorHex: string | null;
    imageUrl: string | null;
    variants: SkinVariant[];
}
export interface SkinListResponse {
    content: SkinSummary[];
    page: PageMeta;
}