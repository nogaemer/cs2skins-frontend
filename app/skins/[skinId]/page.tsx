import Image from "next/image";
import { notFound } from "next/navigation";

import { fetchSkin } from "@/lib/api";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { SkinDetailClient } from "@/components/skins/skin-detail-client";
import { SkinDetails } from "@/components/skins/skin-details";

interface SkinDetailPageProps {
    params: Promise<{ skinId: string }>;
}

export default async function SkinDetailPage({
                                                 params,
                                             }: SkinDetailPageProps) {
    const { skinId } = await params;

    const skin = await fetchSkin(skinId).catch(() => null);
    if (!skin) notFound();

    return (
        <main className="min-h-screen p-8">
            <PageContainer>
                <PageHeader
                    overline="Skin"
                    title={skin.name}
                    description={skin.marketHashName}
                />

                <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                    {/* Image */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted/30">
                        <Image
                            src={skin.imageUrl ?? "/placeholder.svg"}
                            alt={skin.name}
                            fill
                            className="object-contain p-8"
                        />
                    </div>

                    {/* Details (separate component) */}
                    <SkinDetails skin={skin} />
                </div>

                <div className="mt-12">
                    <SkinDetailClient skin={skin} />
                </div>
            </PageContainer>
        </main>
    );
}