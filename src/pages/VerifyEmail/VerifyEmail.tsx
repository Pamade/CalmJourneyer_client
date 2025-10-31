
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import styles from './VerifyEmail.module.scss';

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { verifyEmail } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setError('No verification token provided');
            setLoading(false);
            return;
        }

        const verify = async () => {
            try {
                await verifyEmail(token);
                setSuccess(true);
                setTimeout(() => navigate('/dashboard'), 5000);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Verification failed');
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {loading && (
                    <div className={styles.loadingState}>
                        <div className={styles.spinner}></div>
                        <h2 className={styles.title}>Verifying your email...</h2>
                        <p className={styles.description}>Please wait while we verify your email address.</p>
                    </div>
                )}

                {success && (
                    <div className={styles.successState}>
                        <div className={styles.successEmoji}>✓</div>
                        <h2 className={styles.title}>Email Verified!</h2>
                        <p className={styles.description}>Your email has been successfully verified. Redirecting to home...</p>
                    </div>
                )}

                {error && (
                    <div className={styles.errorState}>
                        <div className={styles.errorEmoji}>✕</div>
                        <h2 className={styles.title}>Verification Failed</h2>
                        <p className={styles.description}>{error}</p>
                        <button className={styles.button} onClick={() => navigate('/login')}>
                            Back to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default VerifyEmail;
