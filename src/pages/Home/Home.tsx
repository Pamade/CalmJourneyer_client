import { useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { Sparkles, Brain, Heart } from "lucide-react";
import { FiMoon, FiWind, FiTarget, FiZap, FiCircle, FiStar } from "react-icons/fi";
import Navigation from "../../components/Navigation/Navigation";
import styles from "./Home.module.scss";
import { useOptimisticAuth } from "../../context/AuthContext";

function Home() {
    const navigate = useNavigate();
    const jwtToken = localStorage.getItem("access_token");
    const { user } = useOptimisticAuth()
    const onboardingCompleted = localStorage.getItem("is_onboarding_completed");

    useEffect(() => {
        // If user has JWT and completed onboarding, redirect to logged user home
        if (jwtToken && onboardingCompleted) {
            navigate("/dashboard");
        }
        // If user has JWT but no onboarding, redirect to onboarding
        else if (jwtToken && !onboardingCompleted) {
            navigate("/onboarding");
        }
    }, [jwtToken, onboardingCompleted, navigate]);

    const handleGetStarted = () => {
        if (user) {
            navigate("/dashboard");
        } else {
            navigate("/onboarding");
        }

    };

    const handleLogin = () => {
        navigate("/login");
    };
    console.log(user)

    return (
        <>
            {/* React 19 Native Meta Tags */}
            <title>CalmJourneyer - AI Meditation App | Personalized Guided Relaxation</title>
            <meta name="description" content="Experience personalized AI voice meditation with CalmJourneyer. Unique guided relaxation sessions generated live for stress relief, better sleep, focus, and mindfulness. Start free today." />
            <link rel="canonical" href="https://calmjourneyer.com" />

            <div className={`${styles.page} extra_padding_for_wrapped_nav`}>
                <Navigation type={user ? "logged" : "public"} />

                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroText}>
                            <h1 className={styles.heroTitle}>
                                AI Meditation App for Personalized Guided Relaxation
                            </h1>
                            <p className={styles.heroSubtitle}>
                                CalmJourneyer uses artificial intelligence to create personalized
                                AI voice meditation sessions. Each guided relaxation is unique and tailored to your needs, goals, and mood.
                            </p>
                            <div className={styles.heroCta}>


                                {!user ? (<button className={styles.primaryButton} onClick={handleGetStarted}>
                                    <Sparkles className={styles.buttonIcon} />
                                    Start Free
                                </button>) : <button className={styles.primaryButton} onClick={() => navigate("/dashboard")}>
                                    <Sparkles className={styles.buttonIcon} />
                                    Go To Dashboard
                                </button>
                                }
                                {!user && (
                                    <button className={styles.secondaryButton} onClick={handleLogin}>
                                        I Have an Account
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className={styles.heroVisual}>
                            <div className={styles.floatingCard}>
                                <div className={styles.cardIcon}>
                                    <Sparkles />
                                </div>
                                <div className={styles.cardText}>
                                    <div className={styles.cardTitle}>AI Meditation</div>
                                    <div className={styles.cardSubtitle}>Generated Live</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className={styles.features}>
                    <h2 className={styles.sectionTitle}>How AI Meditation Works</h2>
                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <Brain />
                            </div>
                            <h3 className={styles.featureTitle}>Smart AI Personalization</h3>
                            <p className={styles.featureDescription}>
                                Our AI meditation app analyzes your goals and preferences, creating guided relaxation
                                sessions perfectly tailored to your emotional state and mindfulness needs.
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <Sparkles />
                            </div>
                            <h3 className={styles.featureTitle}>Unique AI-Generated Sessions</h3>
                            <p className={styles.featureDescription}>
                                Each personalized meditation is generated live with AI. You'll never hear the same
                                session twice - always fresh, authentic meditation experiences.
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <Heart />
                            </div>
                            <h3 className={styles.featureTitle}>Natural AI Voice Guidance</h3>
                            <p className={styles.featureDescription}>
                                Choose from different AI voice meditation guides. Advanced speech synthesis
                                makes them sound natural and soothing for your guided relaxation.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Goals Section */}
                <section className={styles.goals}>
                    <h2 className={styles.sectionTitle}>Achieve Your Meditation Goals</h2>
                    <p className={styles.sectionSubtitle}>
                        Whatever you need, our AI meditation app will help you find peace through personalized guided relaxation
                    </p>
                    <div className={styles.goalsGrid}>
                        <div className={styles.goalCard}>
                            <div className={styles.goalIcon}>
                                <FiMoon />
                            </div>
                            <h4 className={styles.goalTitle}>Sleep Better</h4>
                            <p className={styles.goalDescription}>
                                Evening AI meditation sessions help you relax and prepare for peaceful sleep with personalized guided relaxation
                            </p>
                        </div>

                        <div className={styles.goalCard}>
                            <div className={styles.goalIcon}>
                                <FiWind />
                            </div>
                            <h4 className={styles.goalTitle}>Reduce Stress</h4>
                            <p className={styles.goalDescription}>
                                AI-powered breathing techniques and mindfulness meditation help you manage tension and anxiety
                            </p>
                        </div>

                        <div className={styles.goalCard}>
                            <div className={styles.goalIcon}>
                                <FiTarget />
                            </div>
                            <h4 className={styles.goalTitle}>Improve Focus</h4>
                            <p className={styles.goalDescription}>
                                Personalized meditation sessions strengthen your ability to concentrate and boost productivity
                            </p>
                        </div>

                        <div className={styles.goalCard}>
                            <div className={styles.goalIcon}>
                                <FiZap />
                            </div>
                            <h4 className={styles.goalTitle}>Boost Energy</h4>
                            <p className={styles.goalDescription}>
                                Morning AI voice meditation for an energizing start to your day with guided relaxation
                            </p>
                        </div>

                        <div className={styles.goalCard}>
                            <div className={styles.goalIcon}>
                                <FiCircle />
                            </div>
                            <h4 className={styles.goalTitle}>Sit in Silence</h4>
                            <p className={styles.goalDescription}>
                                Sometimes mindfulness meditation is simply about being present - without a specific goal
                            </p>
                        </div>

                        <div className={styles.goalCard}>
                            <div className={styles.goalIcon}>
                                <FiStar />
                            </div>
                            <h4 className={styles.goalTitle}>Know Yourself</h4>
                            <p className={styles.goalDescription}>
                                Introspective AI meditation sessions leading to deeper self-understanding and awareness
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className={styles.cta}>
                    <div className={styles.ctaContent}>
                        <h2 className={styles.ctaTitle}>Ready for Your First Session?</h2>
                        <p className={styles.ctaSubtitle}>
                            Join thousands of people who find peace daily with CalmJourneyer
                        </p>
                        <button className={styles.ctaButton} onClick={handleGetStarted}>
                            <Sparkles className={styles.buttonIcon} />
                            Start Now - Free
                        </button>
                    </div>
                </section>

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

export default Home;