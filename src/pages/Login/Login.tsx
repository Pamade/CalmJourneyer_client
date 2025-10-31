import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, Activity, Target } from 'lucide-react';
import axios from 'axios';
import styles from './Login.module.scss';
import { toast } from 'sonner';

type TabType = 'login' | 'register';

interface LoginFormData {
    email: string;
    password: string;
}

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    repeatPassword: string;
    terms: boolean;
}

export default function Login() {
    const navigate = useNavigate();
    const { login, register } = useAuth();

    console.log('Login component rendered');


    const [activeTab, setActiveTab] = useState<TabType>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [loginData, setLoginData] = useState<LoginFormData>({
        email: '',
        password: '',
    });

    const [registerData, setRegisterData] = useState<RegisterFormData>({
        name: '',
        email: '',
        password: '',
        repeatPassword: '',
        terms: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const quotes = [
        { text: "Your journey to inner peace begins with a single breath.", author: "CalmJourneyer" },
        { text: "Meditation is not about stopping thoughts, but recognizing that they are just thoughts.", author: "Allan Lokos" },
        { text: "The mind is everything. What you think you become.", author: "Buddha" },
    ];

    const [displayQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        setErrors({});
    };


    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
        clearErrors(name);
    };

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({ ...prev, [name]: value }));
        clearErrors(name);
    };

    const clearErrors = (fieldName?: string) => {
        if (fieldName && errors[fieldName]) {
            setErrors(prev => ({ ...prev, [fieldName]: '' }));
        }
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // setErrors({});

        try {
            await login(loginData.email, loginData.password);
            navigate('/dashboard');
        } catch (error) {
            console.log('Error:', error);
            if (axios.isAxiosError(error) && error.response) {
                const responseData = error.response.data;
                if (responseData.errors) {
                    setErrors(responseData.errors);
                }
                if (!responseData.errors && responseData.message) {
                    toast.error(responseData.message);
                }
            } else {
                toast.error('An unexpected error occurred.  Please try again.');
            }
            setIsLoading(false);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // setErrors({});

        try {
            await register(
                registerData.name,
                registerData.email,
                registerData.password,
                registerData.repeatPassword
            );
            navigate('/dashboard');
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                const responseData = error.response.data;
                console.log(responseData);
                if (responseData.errors) {
                    setErrors(responseData.errors);
                }
                if (!responseData.errors && responseData.message) {
                    toast.error(responseData.message);
                }
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
            setIsLoading(false);
        }
    };

    // useEffect(() => {
    //     // Load Google Sign-In script
    //     const script = document.createElement('script');
    //     script.src = 'https://accounts.google.com/gsi/client';
    //     script.async = true;
    //     script.defer = true;
    //     document.head.appendChild(script);

    //     script.onload = () => {
    //         window.google.accounts.id.initialize({
    //             client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    //             callback: handleGoogleLogin,
    //         });
    //     };
    // }, []);

    const handleGoogleLogin = () => {
        // Send token to backend
        window.location.href = import.meta.env.VITE_BACKEND_URL + `/oauth2/authorization/google`;
    };

    return (
        <div className={styles.loginPage}>
            {/* Left Side - Decorative */}
            <div className={styles.leftSide}>
                <div className={styles.gradientBackground}>
                    <div className={styles.floatingShape1}></div>
                    <div className={styles.floatingShape2}></div>
                    <div className={styles.floatingShape3}></div>
                </div>

                <div className={styles.leftContent}>
                    <Link to="/" className={styles.logo}>
                        CalmJourneyer
                    </Link>

                    <div className={styles.quoteSection}>
                        {/* <div className={styles.quoteIcon}>
                            <Sparkles />
                        </div> */}
                        <blockquote className={styles.quote}>
                            "{displayQuote.text}"
                        </blockquote>
                        <p className={styles.quoteAuthor}>— {displayQuote.author}</p>
                    </div>

                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>
                                <User />
                            </span>
                            <span className={styles.featureText}>Personalized meditation sessions</span>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}><Activity /></span>
                            <span className={styles.featureText}>Track your progress</span>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>  <Target /></span>
                            <span className={styles.featureText}>Achieve your wellness goals</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className={styles.rightSide}>
                <div className={styles.formContainer}>
                    {/* Tabs */}
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'login' ? styles.activeTab : ''}`}
                            onClick={() => handleTabChange('login')}
                        >
                            Sign In
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'register' ? styles.activeTab : ''}`}
                            onClick={() => handleTabChange('register')}
                        >
                            Sign Up
                        </button>
                        <div
                            className={styles.tabIndicator}
                            style={{ transform: activeTab === 'login' ? 'translateX(0)' : 'translateX(100%)' }}
                        />
                    </div>

                    {/* Error Message */}
                    {errors.general && (
                        <div className={styles.errorMessage}>
                            {errors.general}
                        </div>
                    )}

                    {/* Login Form */}
                    {activeTab === 'login' && (
                        <form onSubmit={handleLoginSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="login-email">Email</label>
                                <div className={styles.inputWrapper}>
                                    <Mail className={styles.inputIcon} size={20} />
                                    <input
                                        id="login-email"
                                        type="email"
                                        name="email"
                                        className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                                        placeholder="your@email.com"
                                        value={loginData.email}
                                        onChange={handleLoginChange}
                                    />
                                </div>
                                {errors.email && <span className={styles.error}>{errors.email}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="login-password">Password</label>
                                <div className={styles.inputWrapper}>
                                    <Lock className={styles.inputIcon} size={20} />
                                    <input
                                        id="login-password"
                                        type={showPassword ? 'text' : 'password'}
                                        className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                                        placeholder="Enter your password"
                                        value={loginData.password}
                                        name="password"
                                        onChange={handleLoginChange}
                                    />
                                    <button
                                        type="button"
                                        className={styles.eyeButton}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && <span className={styles.error}>{errors.password}</span>}
                            </div>

                            <div className={styles.forgotPassword}>
                                <Link to="/forgot-password">Forgot password?</Link>
                            </div>

                            <div className={styles.loginInfo}>
                                <p className={styles.infoTitle}></p>
                                <p className={styles.infoText}>
                                    Continue your journey to inner peace and mindfulness. Track your progress,
                                    access personalized meditation sessions, and achieve your wellness goals.
                                </p>
                            </div>



                            <button type="submit" disabled={isLoading} className={styles.submitButton}>
                                Sign In
                            </button>
                        </form>
                    )}

                    {/* Register Form */}
                    {activeTab === 'register' && (
                        <form onSubmit={handleRegisterSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="register-name">Name</label>
                                <div className={styles.inputWrapper}>
                                    <User className={styles.inputIcon} size={20} />
                                    <input
                                        id="register-name"
                                        type="text"
                                        className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                                        name="name"
                                        placeholder="Your name"
                                        value={registerData.name}
                                        onChange={handleRegisterChange}
                                    />
                                </div>
                                {errors.name && <span className={styles.error}>{errors.name}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="register-email">Email</label>
                                <div className={styles.inputWrapper}>
                                    <Mail className={styles.inputIcon} size={20} />
                                    <input
                                        id="register-email"
                                        type="email"
                                        className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                                        placeholder="your@email.com"
                                        value={registerData.email}
                                        name="email"
                                        onChange={handleRegisterChange}
                                    />
                                </div>
                                {errors.email && <span className={styles.error}>{errors.email}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="register-password">Password</label>
                                <div className={styles.inputWrapper}>
                                    <Lock className={styles.inputIcon} size={20} />
                                    <input
                                        name="password"
                                        id="register-password"
                                        type={showPassword ? 'text' : 'password'}
                                        className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                                        placeholder="Create a password"
                                        value={registerData.password}
                                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        className={styles.eyeButton}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && <span className={styles.error}>{errors.password}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="register-confirm-password">Confirm Password</label>
                                <div className={styles.inputWrapper}>
                                    <Lock className={styles.inputIcon} size={20} />
                                    <input
                                        id="register-confirm-password"
                                        name="repeatPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className={`${styles.input} ${errors.repeatPassword ? styles.inputError : ''}`}
                                        placeholder="Confirm your password"
                                        value={registerData.repeatPassword}
                                        onChange={(e) => setRegisterData({ ...registerData, repeatPassword: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        className={styles.eyeButton}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.repeatPassword && <span className={styles.error}>{errors.repeatPassword}</span>}
                            </div>

                            <button disabled={isLoading} type="submit" className={styles.submitButton}>
                                Create Account
                            </button>
                        </form>
                    )}

                    {/* Social Login */}
                    <div className={styles.divider}>
                        <span>or continue with</span>
                    </div>

                    <div className={styles.socialButtons}>
                        <button onClick={handleGoogleLogin} className={styles.socialButton}>
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                        {/* <button className={styles.socialButton}>
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

