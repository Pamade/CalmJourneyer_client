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
                'Up to 10 minutes per session',
                'Basic customization',
            ],
        },
        {
            name: 'Standard',
            price: '$5',
            period: 'per month',
            planType: 'STANDARD',
            popular: true,
            features: [
                'Unlimited meditation sessions',
                'Limited voices',
                'Up to 15 minutes per session',
                'Full customization',
                'Priority support',
            ],
        },
        {
            name: 'Pro',
            price: '$15',
            period: 'per month',
            planType: 'PRO',
            features: [
                'Unlimited meditation sessions',
                'All premium voices',
                'Up to 30 minutes per session',
                'Full customization',
                'Priority support',
                'Early access to new features',
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
        <div className={styles.pricingPage}>
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
                            <h3>Is my payment information secure?</h3>
                            <p>Absolutely. We use Stripe for payment processing, which is PCI-compliant and industry-leading in security.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
