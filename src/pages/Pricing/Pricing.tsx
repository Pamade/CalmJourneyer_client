import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navigation from '../../components/Navigation/Navigation';
import styles from './Pricing.module.scss';
import axios from '../../utils/axios';

interface PricingPlan {
    name: string;
    price: string;
    period: string;
    features: string[];
    planType: 'FREE' | 'STANDARD' | 'PRO';
    popular?: boolean;
}

interface SubscriptionInfo {
    plan: string;
    status: string;
}

const Pricing = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentSubscription, setCurrentSubscription] = useState<SubscriptionInfo | null>(null);
    console.log(user)
    console.log(currentSubscription)
    useEffect(() => {
        const fetchSubscription = async () => {
            if (user) {
                try {
                    const response = await axios.get('/subscriptions/me');
                    if (response.data.success) {
                        setCurrentSubscription({
                            plan: response.data.data.plan,
                            status: response.data.data.status
                        });
                    }
                } catch (err) {
                    console.error('Error fetching subscription:', err);
                }
            }
        };

        fetchSubscription();
    }, [user]);

    const plans: PricingPlan[] = [
        {
            name: 'Free',
            price: '$0',
            period: 'forever',
            planType: 'FREE',
            features: [
                '3 meditation sessions',
                'Limited voices',
                'Up to 5 minutes per session'
            ],
        },
        {
            name: 'Standard',
            price: '$5',
            period: 'per month',
            planType: 'STANDARD',
            features: [
                'Unlimited meditation sessions',
                'All voices',
                'Up to 15 minutes per session',
                'Priority support',
            ],
        },
        {
            name: 'Pro',
            price: '$10',
            period: 'per month',
            planType: 'PRO',
            popular: true,
            features: [
                'Unlimited meditation sessions',
                'All premium voices',
                'Up to 30 minutes per session',
                'Priority support',
            ],
        },
    ];

    const handleSelectPlan = async (planType: 'FREE' | 'STANDARD' | 'PRO') => {
        // Check if user already has this plan
        if (currentSubscription && currentSubscription.plan.toUpperCase() === planType) {
            return; // Button is disabled, do nothing
        }

        if (planType === 'FREE') {
            if (!user) {
                window.location.href = '/login';
            } else {
                window.location.href = '/';
            }
            return;
        }

        if (!user) {
            window.location.href = '/login';
            return;
        }

        try {
            setLoading(planType);
            setError(null);

            const response = await axios.post('/subscriptions/create-checkout-session', {
                plan: planType,
            });

            if (response.data.success && response.data.data.url) {
                window.location.href = response.data.data.url;
            } else {
                throw new Error('Failed to create checkout session');
            }
        } catch (err: any) {
            console.error('Error creating checkout session:', err);
            setError(err.response?.data?.message || 'Failed to start checkout. Please try again.');
            setLoading(null);
        }
    };

    return (
        <>
            {/* React 19 Meta Tags */}
            <title>Pricing - CalmJourneyer AI Meditation App</title>
            <meta name="description" content="Choose the perfect plan for your personalized meditation journey. Free AI meditation sessions or upgrade to Pro for unlimited access to guided relaxation with custom AI voices." />
            <link rel="canonical" href="https://calmjourneyer.com/pricing" />

            {/* Structured Data - FAQPage */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "How does AI meditation work?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Our AI meditation app creates personalized guided relaxation sessions using artificial intelligence. Each meditation is uniquely generated based on your goals, preferences, and mood, with natural AI voice narration."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What makes AI voice meditation different?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Unlike pre-recorded sessions, our AI voice meditation is generated live for you. Every session is unique and tailored to your current needs, providing truly personalized meditation experiences."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Can I try AI meditation for free?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes! Start with our free plan to experience personalized AI meditation. You get 3 sessions to explore how AI-powered guided relaxation works for you."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "How long are personalized meditation sessions?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Session lengths vary by plan: Free users get up to 5 minutes, Standard users up to 15 minutes, and Pro users can enjoy sessions up to 30 minutes of guided relaxation."
                            }
                        }
                    ]
                })}
            </script>

            {/* Structured Data - Product Offers */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Product",
                    "name": "CalmJourneyer AI Meditation App",
                    "description": "Personalized AI meditation app with guided relaxation sessions",
                    "brand": {
                        "@type": "Brand",
                        "name": "CalmJourneyer"
                    },
                    "offers": [
                        {
                            "@type": "Offer",
                            "name": "Free Plan",
                            "price": "0",
                            "priceCurrency": "USD",
                            "availability": "https://schema.org/InStock"
                        },
                        {
                            "@type": "Offer",
                            "name": "Standard Plan",
                            "price": "5",
                            "priceCurrency": "USD",
                            "priceSpecification": {
                                "@type": "UnitPriceSpecification",
                                "price": "5",
                                "priceCurrency": "USD",
                                "unitText": "MONTH"
                            },
                            "availability": "https://schema.org/InStock"
                        },
                        {
                            "@type": "Offer",
                            "name": "Pro Plan",
                            "price": "10",
                            "priceCurrency": "USD",
                            "priceSpecification": {
                                "@type": "UnitPriceSpecification",
                                "price": "10",
                                "priceCurrency": "USD",
                                "unitText": "MONTH"
                            },
                            "availability": "https://schema.org/InStock"
                        }
                    ]
                })}
            </script>

            <div className={`${styles.page} extra_padding_for_wrapped_nav`}>
                <Navigation type={user ? 'logged' : 'public'} />
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1>Choose Your Plan</h1>
                        <p>Start your mindfulness journey with the plan that fits your needs</p>
                    </div>

                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}

                    <div className={styles.plansGrid}>
                        {plans.map((plan) => (
                            <div
                                key={plan.planType}
                                className={`${styles.planCard} ${plan.popular ? styles.popular : ''}`}
                            >
                                {plan.popular && <div className={styles.popularBadge}>Most Popular</div>}

                                <div className={styles.planHeader}>
                                    <h2>{plan.name}</h2>
                                    <div className={styles.priceContainer}>
                                        <span className={styles.price}>{plan.price}</span>
                                        <span className={styles.period}>/{plan.period}</span>
                                    </div>
                                </div>

                                <ul className={styles.features}>
                                    {plan.features.map((feature, index) => (
                                        <li key={index}>
                                            <svg
                                                className={styles.checkIcon}
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className={`${styles.selectButton} ${currentSubscription?.plan.toUpperCase() === plan.planType ? styles.active : ''}`}
                                    onClick={() => handleSelectPlan(plan.planType)}
                                    disabled={loading === plan.planType || currentSubscription?.plan.toUpperCase() === plan.planType}
                                >
                                    {currentSubscription?.plan.toUpperCase() === plan.planType
                                        ? 'Active Plan'
                                        : loading === plan.planType
                                            ? 'Loading...'
                                            : plan.planType === 'FREE'
                                                ? 'Get Started'
                                                : 'Subscribe'}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className={styles.faq}>
                        <h2>Frequently Asked Questions</h2>
                        <div className={styles.faqGrid}>
                            <div className={styles.faqItem}>
                                <h3>How does AI meditation work?</h3>
                                <p>Our AI meditation app creates personalized guided relaxation sessions using artificial intelligence. Each meditation is uniquely generated based on your goals, preferences, and mood, with natural AI voice narration.</p>
                            </div>
                            <div className={styles.faqItem}>
                                <h3>What makes AI voice meditation different?</h3>
                                <p>Unlike pre-recorded sessions, our AI voice meditation is generated live for you. Every session is unique and tailored to your current needs, providing truly personalized meditation experiences.</p>
                            </div>
                            <div className={styles.faqItem}>
                                <h3>Can I try AI meditation for free?</h3>
                                <p>Yes! Start with our free plan to experience personalized AI meditation. You get 3 sessions to explore how AI-powered guided relaxation works for you.</p>
                            </div>
                            <div className={styles.faqItem}>
                                <h3>Can I cancel anytime?</h3>
                                <p>Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.</p>
                            </div>
                            <div className={styles.faqItem}>
                                <h3>What payment methods do you accept?</h3>
                                <p>We accept all major credit cards, debit cards, and other payment methods through Stripe.</p>
                            </div>
                            <div className={styles.faqItem}>
                                <h3>Can I upgrade or downgrade my plan?</h3>
                                <p>Yes, you can change your plan at any time. Changes will be prorated based on your billing cycle.</p>
                            </div>
                            <div className={styles.faqItem}>
                                <h3>How long are personalized meditation sessions?</h3>
                                <p>Session lengths vary by plan: Free users get up to 5 minutes, Standard users up to 15 minutes, and Pro users can enjoy sessions up to 30 minutes of guided relaxation.</p>
                            </div>
                            <div className={styles.faqItem}>
                                <h3>Is my payment information secure?</h3>
                                <p>Absolutely. We use Stripe for payment processing, which is PCI-compliant and industry-leading in security.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Pricing;
