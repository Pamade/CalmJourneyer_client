import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';
import { GOALS, VOICES, POSITIONS, EYES } from '../../utils/sessionOptions';
import Navigation from '../../components/Navigation/Navigation';
import styles from './Preferences.module.scss';
import axios from '../../utils/axios';


interface UserPreferences {
    preferredVoice: string;
    preferredDuration: number;
    preferredGoal: string;
    preferredPosition: string;
    preferredEyes: string;
}

interface Subscription {
    plan: string;
}

export default function Preferences() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [preferences, setPreferences] = useState<UserPreferences>({
        preferredVoice: 'LUNA',
        preferredDuration: 5,
        preferredGoal: 'STRESS_RELIEF',
        preferredPosition: 'SITTING',
        preferredEyes: 'CLOSED'
    });
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prefsResponse, subResponse] = await Promise.all([
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user-preferences/me`, { withCredentials: true }),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/subscriptions/me`, { withCredentials: true })
            ]);

            if (prefsResponse.data.success) {
                setPreferences(prefsResponse.data.data);
            }

            if (subResponse.data.success) {
                setSubscription(subResponse.data.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/user-preferences/save`,
                preferences,
                { withCredentials: true }
            );

            if (response.data.success) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Error saving preferences:', error);
        } finally {
            setSaving(false);
        }
    };

    const isVoiceDisabled = (voiceId: string) => {
        const voice = VOICES.find(v => v.id === voiceId);
        return !voice?.free && subscription?.plan === 'FREE'.toLowerCase();
    };

    if (loading) {
        return (
            <div className={`${styles.page} extra_padding_for_wrapped_nav`}>
                <Navigation type="dashboard" />
                <div className={styles.loading}>Loading...</div>
            </div>
        );
    }

    return (
        <div className={`${styles.page} extra_padding_for_wrapped_nav`}>
            <Navigation type="dashboard" />

            <main className={styles.container}>
                <div className={styles.header}>
                    <button className={styles.backButton} onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={20} />
                        Back to dashboard
                    </button>
                    <h1 className={styles.title}>Meditation Preferences</h1>
                    <p className={styles.subtitle}>
                        Set your default preferences for quick session starts
                    </p>
                </div>

                {showSuccess && (
                    <div className={styles.successBanner}>
                        <CheckCircle size={20} />
                        Preferences saved successfully!
                    </div>
                )}

                <div className={styles.sections}>
                    {/* Goal Section */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Default Goal</h2>
                        <div className={styles.grid}>
                            {GOALS.map(goal => {
                                const IconComponent = goal.icon;
                                return (
                                    <button
                                        key={goal.id}
                                        className={`${styles.card} ${preferences.preferredGoal === goal.id ? styles.selected : ''}`}
                                        onClick={() => setPreferences({ ...preferences, preferredGoal: goal.id })}
                                    >
                                        <IconComponent className={styles.icon} size={28} />
                                        <span className={styles.label}>{goal.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Voice Section */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Preferred Voice</h2>
                        <div className={styles.grid}>
                            {VOICES.map(voice => (
                                <button
                                    key={voice.id}
                                    className={`${styles.card} ${preferences.preferredVoice === voice.id ? styles.selected : ''} ${isVoiceDisabled(voice.id) ? styles.disabled : ''}`}
                                    onClick={() => !isVoiceDisabled(voice.id) && setPreferences({ ...preferences, preferredVoice: voice.id })}
                                    disabled={isVoiceDisabled(voice.id)}
                                >
                                    <span className={styles.voiceName}>{voice.label}</span>
                                    <span className={styles.voiceDescription}>{voice.description}</span>
                                    {!voice.free && subscription?.plan.toUpperCase() === 'FREE' && (
                                        <span className={styles.badge}>Standard</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Duration Section */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Default Duration</h2>
                        <div className={styles.grid}>
                            {[5, 10, 15, 20, 25, 30].map(duration => {
                                const isDisabled =
                                    (subscription?.plan.toLowerCase() === 'free' && duration > 5) ||
                                    (subscription?.plan.toLowerCase() === 'standard' && duration > 15);

                                return (
                                    <button
                                        key={duration}
                                        className={`${styles.card} ${preferences.preferredDuration === duration ? styles.selected : ''} ${isDisabled ? styles.disabled : ''}`}
                                        onClick={() => !isDisabled && setPreferences({ ...preferences, preferredDuration: duration })}
                                        disabled={isDisabled}
                                    >
                                        <span className={styles.durationLabel}>{duration} min</span>
                                        {isDisabled && subscription?.plan.toLowerCase() !== 'premium' && (
                                            <span className={styles.badge}>
                                                {subscription?.plan.toLowerCase() === 'free' && duration <= 15 ? 'Standard' : 'Premium'}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Position Section */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Preferred Position</h2>
                        <div className={styles.grid}>
                            {POSITIONS.map(position => {
                                const PositionIcon = position.icon;
                                return (
                                    <button
                                        key={position.id}
                                        className={`${styles.card} ${preferences.preferredPosition === position.id ? styles.selected : ''}`}
                                        onClick={() => setPreferences({ ...preferences, preferredPosition: position.id })}
                                    >
                                        <PositionIcon size={24} className={styles.icon} />
                                        <span className={styles.label}>{position.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Eyes Section */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Preferred Eyes</h2>
                        <div className={styles.grid}>
                            {EYES.map(eyes => {
                                const EyeIcon = eyes.icon;
                                return (
                                    <button
                                        key={eyes.id}
                                        className={`${styles.card} ${preferences.preferredEyes === eyes.id ? styles.selected : ''}`}
                                        onClick={() => setPreferences({ ...preferences, preferredEyes: eyes.id })}
                                    >
                                        <EyeIcon size={24} className={styles.icon} />
                                        <span className={styles.label}>{eyes.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <button
                    className={styles.saveButton}
                    onClick={handleSave}
                    disabled={saving}
                >
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save Preferences'}
                </button>
            </main>
        </div>
    );
}
