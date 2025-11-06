
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { Mail, LogOut, Check, AlertCircle } from 'lucide-react';
import styles from './VerifyEmail.module.scss';
import { toast } from 'sonner';

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { verifyEmail, sendVerificationEmail, user, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    // Check if this is a verification callback with token
    const token = searchParams.get('token');
    const localStorageVerificationEmailSent = localStorage.getItem('was_verification_email_sent');
    useEffect(() => {
        if (token) {
            // This is a verification callback from email link
            verifyToken();
        } else if (user?.emailVerified) {
            // User is already verified, redirect to dashboard
            navigate('/dashboard', { replace: true });
        }
    }, [token, user]);

    useEffect(() => {
        if (!token && (user?.emailVerified === false || null) && user && localStorageVerificationEmailSent !== 'true') {
            sendVerificationEmail(user?.email);
            localStorage.setItem('was_verification_email_sent', 'true');
        }
    }, []);

    const verifyToken = async () => {
        setLoading(true);
        try {
            await verifyEmail(token!);
            setSuccess(true);
            toast.success('Email verified successfully!');
            setTimeout(() => window.location.href = '/dashboard', 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Verification failed');
            toast.error('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendVerificationEmail = async () => {
        if (!user?.email) {
            toast.error('No email found. Please login again.');
            return;
        }

        setSendingEmail(true);
        try {
            await sendVerificationEmail(user.email);
            setEmailSent(true);
            setTimeout(() => setEmailSent(false), 3000);
            toast.success('Verification email sent! Please check your inbox.');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to send verification email');
        } finally {
            setSendingEmail(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login', { replace: true });
        } catch (err) {
            toast.error('Logout failed. Please try again.');
        }
    };

    // Token verification flow
    if (token) {
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
                            <div className={styles.successIcon}>
                                <Check size={48} />
                            </div>
                            <h2 className={styles.title}>Email Verified!</h2>
                            <p className={styles.description}>Your email has been successfully verified. Redirecting to dashboard...</p>
                        </div>
                    )}

                    {error && (
                        <div className={styles.errorState}>
                            <div className={styles.errorIcon}>
                                <AlertCircle size={48} />
                            </div>
                            <h2 className={styles.title}>Verification Failed</h2>
                            <p className={styles.description}>{error}</p>
                            <button className={styles.button} onClick={() => navigate('/login', { replace: true })}>
                                Back to Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Email verification required flow
    if (!token) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.iconWrapper}>
                        <Mail size={64} className={styles.mailIcon} />
                    </div>

                    <h1 className={styles.title}>Verify Your Email</h1>
                    <p className={styles.description}>
                        We've sent a verification email to <strong>{user?.email}</strong>.
                        Please check your inbox and click the verification link to continue.
                    </p>
                    {/* 
                {emailSent && (
                    <div className={styles.successMessage}>
                        <Check size={20} />
                        <span>Verification email sent successfully!</span>
                    </div>
                )} */}

                    <div className={styles.actions}>
                        <button
                            className={styles.primaryButton}
                            onClick={handleSendVerificationEmail}
                            disabled={sendingEmail || emailSent}
                        >
                            {sendingEmail ? 'Sending...' : emailSent ? 'Email Sent' : 'Resend Verification Email'}
                        </button>

                        <button
                            className={styles.secondaryButton}
                            onClick={handleLogout}
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>

                    <div className={styles.helpText}>
                        <p>Didn't receive the email?</p>
                        <ul>
                            <li>Check your spam or junk folder</li>
                            <li>Make sure {user?.email} is correct</li>
                            <li>Wait a few minutes and try resending</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default VerifyEmail;
