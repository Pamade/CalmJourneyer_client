import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import Navigation from '../../components/Navigation/Navigation';
import { useAuth } from '../../context/AuthContext';
import styles from './SubscriptionSuccess.module.scss';

const SubscriptionSuccess = () => {
    const { user } = useAuth();

    useEffect(() => {
        // Redirect to dashboard after 5 seconds
        const timer = setTimeout(() => {
            window.location.href = '/dashboard';
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={styles.page}>
            <Navigation type={user ? 'logged' : 'public'} />
            <div className={styles.container}>
                <div className={styles.card}>
                    <CheckCircle className={styles.icon} />
                    <h1>Subscription Successful!</h1>
                    <p>Thank you for subscribing. Your account has been upgraded.</p>
                    <p className={styles.redirect}>Redirecting to dashboard in 5 seconds...</p>
                    <button
                        className={styles.button}
                        onClick={() => window.location.href = '/dashboard'}
                    >
                        Go to Dashboard Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionSuccess;
