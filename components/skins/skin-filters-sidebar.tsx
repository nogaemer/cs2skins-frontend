"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import type {CollectionSummary} from "@/lib/types";

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Separator} from "@/components/ui/separator";

const RARITIES = [
    {value: "1", label: "Consumer Grade", color: "#b0c3d9"},
    {value: "2", label: "Industrial Grade", color: "#5e98d9"},
    {value: "3", label: "Mil-Spec Grade", color: "#4b69ff"},
    {value: "4", label: "Restricted", color: "#8847ff"},
    {value: "5", label: "Classified", color: "#d32ce6"},
    {value: "6", label: "Covert", color: "#eb4b4b"},];

const WEAR_BUCKETS = [
    {value: "factory_new", label: "Factory New"},
    {value: "minimal_wear", label: "Minimal Wear"},
    {value: "field_tested", label: "Field-Tested"},
    {value: "well_worn", label: "Well-Worn"},
    {value: "battle_scarred", label: "Battle-Scarred"},
];

const SORT_OPTIONS = [
    {value: "name,asc", label: "Name (A-Z)"},
    {value: "name,desc", label: "Name (Z-A)"},
    {value: "averagePrice,asc", label: "Price (low to high)"},
    {value: "averagePrice,desc", label: "Price (high to low)"},
    {value: "liquidityScore,desc", label: "Liquidity (high to low)"},
];

interface SkinFiltersSidebarProps {
    collections: CollectionSummary[];
}

export function SkinFiltersSidebar({
                                       collections,
                                   }: SkinFiltersSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") ?? "");
    const [collectionId, setCollectionId] = useState(searchParams.get("collectionId") ?? "all",);
    const [rarityId, setRarityId] = useState(searchParams.get("rarityId") ?? "all",);
    const [wearBucket, setWearBucket] = useState(searchParams.get("wearBucket") ?? "all",);
    const [stattrak, setStattrak] = useState(searchParams.get("stattrak") === "true",);
    const [souvenir, setSouvenir] = useState(searchParams.get("souvenir") === "true",);
    const [sort, setSort] = useState(searchParams.get("sort") ?? "name,asc");

    const isFirstRender = useRef(true);

    function buildQueryString() {
        const params = new URLSearchParams();

        if (search.trim()) params.set("search", search.trim());
        if (collectionId !== "all") params.set("collectionId", collectionId);
        if (rarityId !== "all") params.set("rarityId", rarityId);
        if (wearBucket !== "all") params.set("wearBucket", wearBucket);
        if (stattrak) params.set("stattrak", "true");
        if (souvenir) params.set("souvenir", "true");
        if (sort !== "name,asc") params.set("sort", sort);

        return params;
    }

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            const query = buildQueryString().toString();
            router.replace(query ? `/skins?${query}` : "/skins");
        }, 400);

        return () => clearTimeout(timeout);
    }, [search, collectionId, rarityId, wearBucket, stattrak, souvenir, sort]);

    function clearFilters() {
        setSearch("");
        setCollectionId("all");
        setRarityId("all");
        setWearBucket("all");
        setStattrak(false);
        setSouvenir(false);
        setSort("name,asc");
    }

    return (<div className="sticky top-20 flex flex-col gap-5 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Filters
        </h2>

        <div className="flex flex-col gap-2">
            <label htmlFor="skin-search" className="text-xs font-medium text-muted-foreground">
                Search
            </label>
            <Input
                id="skin-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Skin name..."
            />
        </div>

        <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          Collection
        </span>
            <Select
                items={collections.map((collection) => ({value: collection.id, label: collection.name}))}
                value={collectionId}
                onValueChange={(value) => setCollectionId(value ?? "all")}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="All collections"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All collections</SelectItem>
                    {collections.map((collection) => (<SelectItem key={collection.id} value={collection.id}>
                        {collection.name}
                    </SelectItem>))}
                </SelectContent>
            </Select>
        </div>

        <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">
                Rarity
            </span>
            <Select
                items={RARITIES}
                value={rarityId}
                onValueChange={(value) => setRarityId(value ?? "all")}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="All rarities"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All rarities</SelectItem>
                    {RARITIES.map((rarity) =>
                        <SelectItem key={rarity.value} value={rarity.value}>
                            <div className="flex items-center gap-2">
                                <span
                                    className="size-2 rounded-full"
                                    style={{backgroundColor: rarity.color}}
                                />
                                {rarity.label}
                            </div>
                        </SelectItem>)}
                </SelectContent>
            </Select>
        </div>

        <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          Wear
        </span>
            <Select
                items={WEAR_BUCKETS}
                value={wearBucket}
                onValueChange={(value) => setWearBucket(value ?? "all")}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="All wear"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All wear</SelectItem>
                    {WEAR_BUCKETS.map((wear) => (<SelectItem key={wear.value} value={wear.value}>
                        {wear.label}
                    </SelectItem>))}
                </SelectContent>
            </Select>
        </div>

        <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          Sort
        </span>
            <Select
                items={SORT_OPTIONS}
                value={sort}
                onValueChange={(value) => setSort(value ?? "name,asc")}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort"/>
                </SelectTrigger>
                <SelectContent>
                    {SORT_OPTIONS.map((option) => (<SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>))}
                </SelectContent>
            </Select>
        </div>

        <Separator/>

        <div className="flex flex-col gap-1">
            <label
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/50">
                <Checkbox
                    checked={stattrak}
                    onCheckedChange={(checked) => setStattrak(checked === true)}
                />
                <span className="text-sm">StatTrak</span>
            </label>

            <label
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/50">
                <Checkbox
                    checked={souvenir}
                    onCheckedChange={(checked) => setSouvenir(checked === true)}
                />
                <span className="text-sm">Souvenir</span>
            </label>
        </div>

        <Button
            type="button"
            variant="outline"
            onClick={clearFilters}
            className="mt-1"
        >
            Clear all filters
        </Button>
    </div>);
}