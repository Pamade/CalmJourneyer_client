import { useParams, Link, useNavigate } from "react-router";
import { useEffect } from "react";
import { ExternalLink, List, CheckCircle } from "lucide-react";
import Navigation from "../../components/Navigation/Navigation";
import articlesData from "../../content/articles.json";
import styles from "./ResourcePost.module.scss";
import { useOptimisticAuth } from "../../context/AuthContext";

function ResourcePost() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useOptimisticAuth();
    const { articles, categories } = articlesData;

    const article = articles.find(a => a.slug === slug);

    useEffect(() => {
        if (!article) {
            navigate("/resources");
        }
    }, [article, navigate]);

    if (!article) {
        return null;
    }

    const category = categories.find(cat => cat.id === article.category);
    const relatedArticles = articles.filter(a =>
        article.relatedArticles?.includes(a.id)
    );

    // Handle smooth scroll with offset for navigation
    const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const navHeight = 80; // 5rem = 80px
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navHeight - 20; // Extra 20px padding

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Generate table of contents from headings
    const generateTableOfContents = () => {
        if (!article.tableOfContents) return null;

        const headings = article.content.filter((block: any) =>
            block.type === 'heading' && block.level === 2
        );

        return headings.map((heading: any, index: number) => ({
            id: `section-${index}`,
            text: heading.text
        }));
    };

    const tableOfContents = generateTableOfContents();

    const renderContent = (block: any, index: number) => {
        switch (block.type) {
            case 'heading':
                if (block.level === 2) {
                    const tocIndex = article.content
                        .filter((b: any) => b.type === 'heading' && b.level === 2)
                        .findIndex((b: any) => b.text === block.text);
                    const id = tocIndex >= 0 ? `section-${tocIndex}` : undefined;
                    return <h2 key={index} id={id} className={styles.heading2}>{block.text}</h2>;
                } else if (block.level === 3) {
                    return <h3 key={index} className={styles.heading3}>{block.text}</h3>;
                }
                return null;
            case 'paragraph':
                return <p key={index} className={styles.paragraph}>{block.text}</p>;
            case 'list':
                return (
                    <ul key={index} className={styles.list}>
                        {block.items.map((item: string, i: number) => (
                            <li key={i}>
                                <CheckCircle className={styles.listIcon} size={20} />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                );
            case 'externalLink':
                return (
                    <div key={index} className={styles.externalLinkBlock}>
                        <a
                            href={block.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.externalLink}
                        >
                            <ExternalLink size={18} />
                            {block.text}
                        </a>
                    </div>
                );
            case 'internalLink':
                return (
                    <div key={index} className={styles.internalLinkBlock}>
                        <Link to={block.url} className={styles.internalLink}>
                            → {block.text}
                        </Link>
                    </div>
                );
            case 'cta':
                return (
                    <div key={index} className={styles.ctaBlock}>
                        <Link to={block.link} className={styles.ctaButton}>
                            {block.text}
                        </Link>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <title>{article.title} | CalmJourneyer</title>
            <meta name="description" content={article.metaDescription} />
            <meta name="keywords" content={article.keywords.join(', ')} />
            <link rel="canonical" href={`https://calmjourneyer.com/resources/${article.slug}`} />

            {/* Open Graph */}
            <meta property="og:type" content="article" />
            <meta property="og:title" content={article.title} />
            <meta property="og:description" content={article.metaDescription} />
            <meta property="og:url" content={`https://calmjourneyer.com/resources/${article.slug}`} />

            {/* Article Schema */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": article.title,
                    "description": article.metaDescription,
                    "author": {
                        "@type": "Organization",
                        "name": article.author
                    },
                    "datePublished": article.publishDate,
                    "publisher": {
                        "@type": "Organization",
                        "name": "CalmJourneyer",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://calmjourneyer.com/favicon.png"
                        }
                    }
                })}
            </script>

            <div className={`${styles.page} extra_padding_for_wrapped_nav`}>
                <Navigation type={user ? "logged" : "public"} />

                <main className={styles.articleMain}>
                    {/* Breadcrumbs */}
                    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
                        <Link to="/" className={styles.breadcrumbLink}>Home</Link>
                        <span className={styles.breadcrumbSeparator}>/</span>
                        <Link to="/resources" className={styles.breadcrumbLink}>Resources</Link>
                        <span className={styles.breadcrumbSeparator}>/</span>
                        <span className={styles.breadcrumbCurrent}>{article.title}</span>
                    </nav>

                    {/* Article Header */}
                    <header className={styles.articleHeader}>
                        <div className={styles.categoryBadge}>{category?.name}</div>
                        <h1 className={styles.articleTitle}>{article.title}</h1>
                        <div className={styles.articleMeta}>
                            <span className={styles.author}>{article.author}</span>
                            <span className={styles.separator}>•</span>
                            <span className={styles.date}>
                                {new Date(article.publishDate).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>
                            <span className={styles.separator}>•</span>
                            <span className={styles.readTime}>{article.readTime} read</span>
                        </div>
                    </header>

                    {/* Table of Contents */}
                    {tableOfContents && tableOfContents.length > 0 && (
                        <nav className={styles.tableOfContents}>
                            <h2 className={styles.tocTitle}>
                                <List size={24} />
                                Table of Contents
                            </h2>
                            <ul className={styles.tocList}>
                                {tableOfContents.map((item: any, index: number) => (
                                    <li key={index}>
                                        <a
                                            href={`#${item.id}`}
                                            className={styles.tocLink}
                                            onClick={(e) => handleTocClick(e, item.id)}
                                        >
                                            {item.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}

                    {/* Article Content */}
                    <article className={styles.articleContent}>
                        {article.content.map((block, index) => renderContent(block, index))}
                    </article>

                    {/* Related Articles */}
                    {relatedArticles.length > 0 && (
                        <section className={styles.relatedSection}>
                            <h2 className={styles.relatedTitle}>Related Articles</h2>
                            <div className={styles.relatedGrid}>
                                {relatedArticles.map(related => (
                                    <Link
                                        to={`/resources/${related.slug}`}
                                        key={related.id}
                                        className={styles.relatedCard}
                                        onClick={() => window.scrollTo(0, 0)}
                                    >
                                        <div className={styles.relatedCategory}>
                                            {categories.find(cat => cat.id === related.category)?.name}
                                        </div>
                                        <h3 className={styles.relatedCardTitle}>{related.title}</h3>
                                        <p className={styles.relatedExcerpt}>{related.excerpt}</p>
                                        <span className={styles.relatedReadTime}>{related.readTime} read</span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Back to Resources */}
                    <div className={styles.backLink}>
                        <Link to="/resources" className={styles.backButton}>
                            ← Back to All Resources
                        </Link>
                    </div>
                </main>

                {/* Footer */}
                <footer className={styles.footer}>
                    <div className={styles.footerContent}>
                        <div className={styles.footerBrand}>
                            <div className={styles.footerLogo}>CalmJourneyer</div>
                            <p className={styles.footerTagline}>
                                AI Meditation App for Personalized Guided Relaxation
                            </p>
                        </div>
                        <div className={styles.footerLinks}>
                            <Link to="/pricing" className={styles.footerLink}>Pricing</Link>
                            <Link to="/resources" className={styles.footerLink}>Resources</Link>
                            <Link to="/login" className={styles.footerLink}>Sign In</Link>
                            <a href="mailto:contact@calmjourneyer.com" className={styles.footerLink}>Contact</a>
                        </div>
                    </div>
                    <div className={styles.footerBottom}>
                        <p>© 2025 CalmJourneyer. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}

export default ResourcePost;
