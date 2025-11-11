import { Link, useNavigate } from "react-router";
import { useState, useRef } from "react";
import Navigation from "../../components/Navigation/Navigation";
import articlesData from "../../content/articles.json";
import styles from "./Resources.module.scss";
import { useOptimisticAuth } from "../../context/AuthContext";

function Resources() {
    const { user } = useOptimisticAuth();
    const { articles, categories } = articlesData;
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const navigate = useNavigate();
    const allArticlesSectionRef = useRef<HTMLElement>(null);

    const filteredArticles = selectedCategory
        ? articles.filter(article => article.category === selectedCategory)
        : articles;

    const handleCategoryClick = (categoryId: string) => {
        setSelectedCategory(categoryId === selectedCategory ? null : categoryId);

        // Scroll to the all articles section with smooth behavior
        setTimeout(() => {
            allArticlesSectionRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    };

    return (
        <>
            <title>Meditation Resources - Guides & Articles | CalmJourneyer</title>
            <meta name="description" content="Explore our comprehensive meditation guides and articles. Learn techniques for anxiety, sleep, focus, and discover how AI meditation can transform your practice." />
            <link rel="canonical" href="https://calmjourneyer.com/resources" />

            <div className={`${styles.page} extra_padding_for_wrapped_nav`}>
                <Navigation type={user ? "logged" : "public"} />

                <main className={styles.resourcesMain}>
                    {/* Hero Section */}
                    <section className={styles.hero}>
                        <div className={styles.heroContent}>
                            <h1 className={styles.heroTitle}>Meditation Resources</h1>
                            <p className={styles.heroSubtitle}>
                                Expert guides and articles to deepen your meditation practice
                            </p>
                        </div>
                    </section>

                    {/* Featured Articles */}
                    <section className={styles.featuredSection}>
                        <h2 className={styles.sectionTitle}>Featured Articles</h2>
                        <div className={styles.featuredGrid}>
                            {articles
                                .filter(article => article.featured)
                                .map(article => (
                                    <Link
                                        to={`/resources/${article.slug}`}
                                        key={article.id}
                                        className={styles.featuredCard}
                                    >
                                        <div className={styles.cardCategory}>
                                            {categories.find(cat => cat.id === article.category)?.name}
                                        </div>
                                        <h3 className={styles.cardTitle}>{article.title}</h3>
                                        <p className={styles.cardExcerpt}>{article.excerpt}</p>
                                        <div className={styles.cardMeta}>
                                            <span className={styles.readTime}>{article.readTime} read</span>
                                            <span className={styles.date}>
                                                {new Date(article.publishDate).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                        </div>
                    </section>

                    {/* Categories */}
                    <section className={styles.categoriesSection}>
                        <h2 className={styles.sectionTitle}>Browse by Topic</h2>
                        <div className={styles.categoriesGrid}>
                            {categories.map(category => {

                                const articleCount = articles.filter(
                                    article => article.category === category.id
                                ).length;
                                const isSelected = selectedCategory === category.id;
                                if (articleCount > 0) {
                                    return (
                                        <button
                                            key={category.id}
                                            className={`${styles.categoryCard} ${isSelected ? styles.categoryCardActive : ''}`}
                                            onClick={() => handleCategoryClick(category.id)}
                                            aria-pressed={isSelected}
                                        >
                                            <h3 className={styles.categoryTitle}>{category.name}</h3>
                                            <p className={styles.categoryDescription}>{category.description}</p>
                                            <span className={styles.articleCount}>
                                                {articleCount} {articleCount === 1 ? 'article' : 'articles'}
                                            </span>
                                        </button>
                                    );
                                }
                            })}
                        </div>
                    </section>

                    {/* All Articles */}
                    <section className={styles.allArticlesSection} ref={allArticlesSectionRef}>
                        <h2 className={styles.sectionTitle}>
                            {selectedCategory
                                ? `${categories.find(cat => cat.id === selectedCategory)?.name} Articles`
                                : 'All Articles'}
                        </h2>
                        {selectedCategory && (
                            <button
                                className={styles.clearFilter}
                                onClick={() => setSelectedCategory(null)}
                            >
                                Clear filter
                            </button>
                        )}
                        <div className={styles.articlesGrid}>
                            {filteredArticles.map(article => (
                                <Link
                                    to={`/resources/${article.slug}`}
                                    key={article.id}
                                    className={styles.articleCard}
                                >
                                    <div className={styles.cardHeader}>
                                        <span className={styles.cardCategory}>
                                            {categories.find(cat => cat.id === article.category)?.name}
                                        </span>
                                        <span className={styles.readTime}>{article.readTime}</span>
                                    </div>
                                    <h3 className={styles.cardTitle}>{article.title}</h3>
                                    <p className={styles.cardExcerpt}>{article.excerpt}</p>
                                    <div className={styles.cardFooter}>
                                        <span className={styles.date}>
                                            {new Date(article.publishDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
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

export default Resources;
