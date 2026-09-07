import type {
    CollectionDetail,
    CollectionListResponse, PriceHistoryResponse, SkinDetail, SkinFilters, SkinListResponse,
} from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not set in .env.local");
}

/**
 * Converts an object of query parameters into a URL query string.
 * Example: { page: 0, size: 25 } -> "?page=0&size=25"
 */
function buildQueryString(
    params?: Record<string, string | number | boolean | undefined>,
): string {
    if (!params) return "";

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
            searchParams.set(key, String(value));
        }
    });

    const query = searchParams.toString();
    return query ? `?${query}` : "";
}

/**
 * Generic request function used by all API methods.
 */
async function apiRequest<T>(
    path: string,
    options: {
        method?: "GET" | "POST";
        body?: unknown;
        params?: Record<string, string | number | boolean | undefined>;
    } = {},
): Promise<T> {
    const { method = "GET", body, params } = options;

    const url = `${BASE_URL}${path}${buildQueryString(params)}`;

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
}

/**
 * Simple GET helper.
 */
async function apiGet<T>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
    return apiRequest<T>(path, { method: "GET", params });
}

/**
 * Simple POST helper.
 */
async function apiPost<T>(
    path: string,
    body?: unknown,
): Promise<T> {
    return apiRequest<T>(path, { method: "POST", body });
}

// ----------------------------------------------------------------------
// Collections
// ----------------------------------------------------------------------

export async function fetchCollections(): Promise<CollectionListResponse> {
    return apiGet<CollectionListResponse>("/collections");
}

export async function fetchCollection(id: string): Promise<CollectionDetail> {
    return apiGet<CollectionDetail>(`/collections/${id}`);
}

// ----------------------------------------------------------------------
// Skins
// ----------------------------------------------------------------------

export async function fetchSkins(
    filters: SkinFilters = {},
): Promise<SkinListResponse> {
    return apiGet<SkinListResponse>("/skins", {
        ...filters,
    });
}

export async function fetchSkin(id: string): Promise<SkinDetail> {
    return apiGet<SkinDetail>(`/skins/${id}`);
}

export async function fetchPriceHistory(
    itemId: string,
    wearBucket: string,
    window: string = "30d",
): Promise<PriceHistoryResponse> {
    return apiGet<PriceHistoryResponse>(
        `/skins/${itemId}/price-history`,
        { wearBucket, window },
    );
}

// ----------------------------------------------------------------------
// Admin example POST functions (will be used later)
// ----------------------------------------------------------------------

export async function startOptimize(): Promise<{ runId: number; status: string }> {
    return apiPost<{ runId: number; status: string }>("/admin/optimize");
}

export async function startPriceIngestion(): Promise<{ status: string; message: string }> {
    return apiPost<{ status: string; message: string }>("/admin/ingest/prices");
}

export async function startMetricsIngestion(): Promise<{ status: string; message: string }> {
    return apiPost<{ status: string; message: string }>("/admin/ingest/metrics");
}