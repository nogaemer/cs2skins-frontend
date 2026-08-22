import {fetchCollection} from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import {PageContainer} from "@/components/layout/page-container";
import {PageHeader} from "@/components/layout/page-header";

interface CollectionDetailPageProps {
    params: Promise<{ collectionId: string }>;
}

function splitSkinName(name: string) {
    const parts = name.split(" | ");
    if (parts.length === 2) {
        return {weapon: parts[0], skin: parts[1]};
    }
    return {weapon: "", skin: name};
}

export default async function CollectionDetailPage({
                                                       params,
                                                   }: CollectionDetailPageProps) {
    const {collectionId} = await params;
    const collection = await fetchCollection(collectionId);

    const rarityRank: Record<string, number> = {
        "consumer grade": 0,
        "industrial grade": 1,
        "mil-spec grade": 2,
        restricted: 3,
        classified: 4,
        covert: 5,
        contraband: 6,
    };

    function getRank(rarityName: string) {
        const key = rarityName.trim().toLowerCase();
        return rarityRank[key] ?? 99;
    }

    const allItems = collection.itemsByRarity
        .flatMap((group) =>
            group.items.map((item) => ({
                ...item,
                rarityName: group.rarityName,
                rarityColorHex: group.rarityColorHex,
            })),
        )
        .sort((a, b) => getRank(a.rarityName) - getRank(b.rarityName));

    const totalItems = allItems.length;

    return (
        <main className="p-8">
            <PageContainer>
                <PageHeader
                    overline="Collection"
                    title={collection.name}
                    description={`${totalItems} skins`}
                />

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {allItems.map((item) => {
                        const {weapon, skin} = splitSkinName(item.name);
                        const rarityColor = `#${item.rarityColorHex}`;

                        return (
                            <Link
                                key={item.id}
                                href={`/skins/${item.id}`}
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

                                <div className="flex flex-col items-center">
                                    <span className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                                        {weapon}
                                    </span>

                                    <div className="flex w-fit flex-col items-center">
                                        <span className="mt-0.5 text-sm font-medium leading-tight">
                                            {skin}
                                        </span>
                                        <span
                                            className="mt-2 h-1 w-8 rounded-full transition-all duration-300 group-hover:w-full"
                                            style={{backgroundColor: rarityColor}}
                                        />
                                    </div>
                                </div>

                                <div className="relative z-10 mt-4 aspect-square w-full overflow-hidden">
                                    <Image
                                        src={item.imageUrl ?? "/placeholder.svg"}
                                        alt={item.name}
                                        fill
                                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </PageContainer>
        </main>
    );
}