import { useNavigate } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';
import Navigation from '../../components/Navigation/Navigation';
import { useAuth } from '../../context/AuthContext';
import styles from './NotFound.module.scss';

const NotFound = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className={styles.page}>
            <Navigation type={user ? 'dashboard' : 'public'} />

            <main className={styles.main}>
                <div className={styles.content}>
                    <div className={styles.errorCode}>404</div>
                    <h1 className={styles.title}>Page Not Found</h1>
                    <p className={styles.description}>
                        The page you're looking for doesn't exist or has been moved.
                    </p>

                    <div className={styles.actions}>
                        <button
                            className={styles.primaryButton}
                            onClick={() => navigate(user ? '/dashboard' : '/')}
                        >
                            <Home size={20} />
                            Go to {user ? 'Dashboard' : 'Home'}
                        </button>
                        <button
                            className={styles.secondaryButton}
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft size={20} />
                            Go Back
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NotFound;
