import React from 'react';

interface OgProps {
    title?: string;
    description?: string;
    url?: string;
    type?: string;
    image?: string;
}

interface MetaTagsProps {
    title: string;
    description?: string;
    canonical?: string;
    keywords?: string;
    robots?: string;
    og?: OgProps;
    ldJson?: object | null;
}

const MetaTags: React.FC<MetaTagsProps> = ({
    title,
    description,
    canonical,
    keywords,
    robots,
    og,
    ldJson,
}) => {
    return (
        <>
            <title>{title}</title>
            {description && <meta name="description" content={description} />}
            {keywords && <meta name="keywords" content={keywords} />}
            {robots && <meta name="robots" content={robots} />}
            {canonical && <link rel="canonical" href={canonical} />}

            {og?.type && <meta property="og:type" content={og.type} />}
            {og?.title && <meta property="og:title" content={og.title} />}
            {og?.description && <meta property="og:description" content={og.description} />}
            {og?.url && <meta property="og:url" content={og.url} />}
            {og?.image && <meta property="og:image" content={og.image} />}

            {ldJson && (
                <script type="application/ld+json">
                    {JSON.stringify(ldJson)}
                </script>
            )}
        </>
    );
};

export default MetaTags;
