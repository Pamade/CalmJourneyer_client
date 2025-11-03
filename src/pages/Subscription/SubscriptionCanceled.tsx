import { XCircle } from 'lucide-react';
import Navigation from '../../components/Navigation/Navigation';
import { useAuth } from '../../context/AuthContext';
import styles from './SubscriptionSuccess.module.scss';

const SubscriptionCanceled = () => {
    const { user } = useAuth();

    return (
        <div className={styles.page}>
            <Navigation type={user ? 'logged' : 'public'} />
            <div className={styles.container}>
                <div className={styles.card}>
                    <XCircle className={`${styles.icon} ${styles.canceled}`} />
                    <h1>Subscription Canceled</h1>
                    <p>Your subscription process was canceled. No charges were made.</p>
                    <p>You can try again anytime you're ready.</p>
                    <div className={styles.buttonGroup}>
                        <button
                            className={styles.button}
                            onClick={() => window.location.href = '/pricing'}
                        >
                            View Pricing
                        </button>
                        <button
                            className={`${styles.button} ${styles.secondary}`}
                            onClick={() => window.location.href = '/dashboard'}
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionCanceled;
