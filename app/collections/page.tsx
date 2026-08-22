import Image from "next/image";
import Link from "next/link";
import { fetchCollections } from "@/lib/api";
import { PageContainer } from "@/components/layout/page-container";
import {PageHeader} from "@/components/layout/page-header";

export default async function CollectionsPage() {
    const data = await fetchCollections();
    const visibleCollections = data.collections.filter(
        (collection) => collection.itemCount > 0,
    );

    return (
        <main className="p-8">
            <PageContainer>
                <PageHeader
                    overline="Catalog"
                    title="Collections"
                    description={`Browse all ${visibleCollections.length} collections`}
                />

                {/* Grid */}
                <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-4">
                    {visibleCollections.map((collection) => (
                        <Link
                            key={collection.id}
                            href={`/collections/${collection.id}`}
                            className="group flex aspect-square flex-col items-center justify-center rounded-lg border border-border p-4 text-center transition-colors hover:border-primary/50 hover:bg-muted/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            <div className="relative h-3/5 w-full">
                                <Image
                                    src={collection.imageUrl ?? "/placeholder.svg"}
                                    alt={collection.name}
                                    fill
                                    className="object-contain transition-transform duration-300 ease-out group-hover:scale-110"
                                />
                            </div>

                            <h2 className="mt-2 font-medium leading-tight">{collection.name}</h2>
                            <p className="text-sm text-muted-foreground">
                                {collection.itemCount} items
                            </p>
                        </Link>
                    ))}
                </div>
            </PageContainer>
        </main>
    );
}