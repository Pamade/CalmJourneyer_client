
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import styles from './ForgotPassword.module.scss';
import Navigation from '../../components/Navigation/Navigation';
import { toast } from 'sonner';

type Step = 'email' | 'token' | 'password' | 'success';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const { forgotPassword, resetPassword, verifyToken } = useAuth();
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await forgotPassword(email);
            setStep('token');
        } catch (err: any) {
            if (err.response.data.success === false && err.response.data.message) {
                return toast.error(err.response.data.message);
            }
            toast.error('An unexpected error occurred.  Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyToken = async (e: React.FormEvent) => {
        e.preventDefault();
        // setError('');

        if (!token.trim()) {
            toast.error('Please enter the token');
            // setError('Please enter the token');
            return;
        }
        try {
            await verifyToken(token);
            setStep('password');
        } catch (err: any) {
            console.log(err);
            if (err.response.data.success === false && err.response.data.message) {
                return toast.error(err.response.data.message);
            }
            toast.error('An unexpected error occurred.  Please try again.');
            // setError(err instanceof Error ? err.message : 'We could not verify the token');
        }


    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            // setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await resetPassword(token, newPassword, confirmPassword);
            setStep('success');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleRefreshToken = async (e: React.FormEvent) => {
        e.preventDefault();
        setToken('');
        await handleSendEmail(e);
    };

    return (
        <div className={styles.wrapper}>
            <Navigation type="public" />
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.title}>Reset Password</h1>

                    {step === 'email' && (
                        <form onSubmit={handleSendEmail} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className={styles.input}
                                />
                            </div>
                            {error && <p className={styles.error}>{error}</p>}
                            <button type="submit" disabled={loading} className={styles.button}>
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    )}

                    {step === 'token' && (
                        <form onSubmit={handleVerifyToken} className={styles.form}>
                            <p className={styles.info}>
                                We've sent a reset token to <strong>{email}</strong>
                            </p>
                            <div className={styles.formGroup}>
                                <label htmlFor="token" className={styles.label}>
                                    Reset Token
                                </label>
                                <input
                                    id="token"
                                    type="text"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    placeholder="Enter the token from your email"
                                    required
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.buttonGroup}>
                                {error && <p className={styles.error}>{error}</p>}
                                <button disabled={loading} type="submit" className={`${styles.button} ${loading ? styles.disabled : ''}`}>
                                    Verify Token
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRefreshToken}
                                    className={`${styles.buttonSecondary} ${loading ? styles.disabled : ''}`}
                                    disabled={loading}
                                >
                                    Token not arrived? Refresh
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 'password' && (
                        <form onSubmit={handleResetPassword} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="newPassword" className={styles.label}>
                                    New Password
                                </label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    required
                                    minLength={8}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="confirmPassword" className={styles.label}>
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    required
                                    minLength={8}
                                    className={styles.input}
                                />
                            </div>
                            {error && <p className={styles.error}>{error}</p>}
                            <button type="submit" disabled={loading} className={styles.button}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}        {step === 'success' && (
                        <div className={styles.success}>
                            <div className={styles.successIcon}>✓</div>
                            <h2 className={styles.successTitle}>Password Reset Successfully!</h2>
                            <p className={styles.successMessage}>
                                Your password has been changed. You can now log in with your new password.
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className={styles.button}
                            >
                                Go to Home
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


