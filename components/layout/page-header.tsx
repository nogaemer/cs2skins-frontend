interface PageHeaderProps {
    overline?: string;
    title: string;
    description?: string;
}

export function PageHeader({ overline, title, description }: PageHeaderProps) {
    return (
        <div className="mb-8">
            {overline ? (
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    {overline}
                </p>
            ) : null}

            <h1 className="mt-1 text-3xl font-bold tracking-tight">{title}</h1>

            {description ? (
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            ) : null}
        </div>
    );
}