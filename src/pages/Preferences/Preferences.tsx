import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Save, ArrowLeft } from 'lucide-react';
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

const GOALS = [
    { id: 'STRESS_RELIEF', label: 'Redukcja stresu', emoji: '🧘' },
    { id: 'FOCUS', label: 'Koncentracja', emoji: '🎯' },
    { id: 'SLEEP', label: 'Sen', emoji: '😴' },
    { id: 'ENERGY', label: 'Energia', emoji: '⚡' },
    { id: 'SILENCE', label: 'Cisza', emoji: '🌸' }
];

const VOICES = [
    { id: 'LUNA', label: 'Luna', description: 'Kojący, kobiecy głos', free: true },
    { id: 'MILO', label: 'Milo', description: 'Spokojny, męski głos', free: true },
    { id: 'ARIA', label: 'Aria', description: 'Delikatny, melodyjny głos', free: false },
    { id: 'ZEN', label: 'Zen', description: 'Głęboki, medytacyjny głos', free: false }
];

const POSITIONS = [
    { id: 'SITTING', label: 'Pozycja siedząca', emoji: '🪑' },
    { id: 'LYING', label: 'Pozycja leżąca', emoji: '🛏️' },
    { id: 'STANDING', label: 'Pozycja stojąca', emoji: '🧍' }
];

const EYES = [
    { id: 'CLOSED', label: 'Zamknięte oczy', emoji: '👁️' },
    { id: 'OPEN', label: 'Otwarte oczy', emoji: '👀' }
];

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
        return !voice?.free && subscription?.plan === 'FREE';
    };

    if (loading) {
        return (
            <div className={`${styles.page} extra_padding_for_wrapped_nav`}>
                <Navigation type="dashboard" />
                <div className={styles.loading}>Ładowanie...</div>
            </div>
        );
    }

    const maxDuration = subscription?.plan === 'PRO' ? 30 : 15;

    return (
        <div className={`${styles.page} extra_padding_for_wrapped_nav`}>
            <Navigation type="dashboard" />

            <main className={styles.container}>
                <div className={styles.header}>
                    <button className={styles.backButton} onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={20} />
                        <span>Powrót do panelu</span>
                    </button>
                    <h1 className={styles.title}>Preferencje meditacji</h1>
                    <p className={styles.subtitle}>
                        Ustaw swoje domyślne preferencje dla szybkiego startu sesji
                    </p>
                </div>

                {showSuccess && (
                    <div className={styles.successBanner}>
                        ✓ Preferencje zapisane pomyślnie!
                    </div>
                )}

                <div className={styles.sections}>
                    {/* Goal Section */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Domyślny cel</h2>
                        <div className={styles.grid}>
                            {GOALS.map(goal => (
                                <button
                                    key={goal.id}
                                    className={`${styles.card} ${preferences.preferredGoal === goal.id ? styles.selected : ''}`}
                                    onClick={() => setPreferences({ ...preferences, preferredGoal: goal.id })}
                                >
                                    <span className={styles.emoji}>{goal.emoji}</span>
                                    <span className={styles.label}>{goal.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Voice Section */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Preferowany głos</h2>
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
                                    {!voice.free && subscription?.plan === 'FREE' && (
                                        <span className={styles.badge}>Premium</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Duration Section */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            Domyślny czas trwania: {preferences.preferredDuration} min
                        </h2>
                        <input
                            type="range"
                            min="5"
                            max={maxDuration}
                            step="5"
                            value={preferences.preferredDuration}
                            onChange={(e) => setPreferences({ ...preferences, preferredDuration: Number(e.target.value) })}
                            className={styles.slider}
                        />
                        <div className={styles.sliderLabels}>
                            <span>5 min</span>
                            <span>{maxDuration} min</span>
                        </div>
                    </div>

                    {/* Position Section */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Preferowana pozycja</h2>
                        <div className={styles.grid}>
                            {POSITIONS.map(position => (
                                <button
                                    key={position.id}
                                    className={`${styles.card} ${preferences.preferredPosition === position.id ? styles.selected : ''}`}
                                    onClick={() => setPreferences({ ...preferences, preferredPosition: position.id })}
                                >
                                    <span className={styles.emoji}>{position.emoji}</span>
                                    <span className={styles.label}>{position.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Eyes Section */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Preferowane oczy</h2>
                        <div className={styles.grid}>
                            {EYES.map(eyes => (
                                <button
                                    key={eyes.id}
                                    className={`${styles.card} ${preferences.preferredEyes === eyes.id ? styles.selected : ''}`}
                                    onClick={() => setPreferences({ ...preferences, preferredEyes: eyes.id })}
                                >
                                    <span className={styles.emoji}>{eyes.emoji}</span>
                                    <span className={styles.label}>{eyes.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    className={styles.saveButton}
                    onClick={handleSave}
                    disabled={saving}
                >
                    <Save size={20} />
                    {saving ? 'Zapisywanie...' : 'Zapisz preferencje'}
                </button>
            </main>
        </div>
    );
}
