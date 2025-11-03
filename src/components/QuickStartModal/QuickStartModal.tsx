import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router';
import axios from '../../utils/axios';
import styles from './QuickStartModal.module.scss';
import type { Subscription } from '../../utils/planCases/planTypes';
import { maxDuration } from '../../utils/planCases/maxTime';
interface QuickStartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SessionFormData {
    goal: string;
    duration: number;
    voice: string;
    position: string;
    eyes: string;
}

const GOALS = [
    { id: 'STRESS_RELIEF', label: 'Redukcja stresu', emoji: '🧘' },
    { id: 'FOCUS', label: 'Koncentracja', emoji: '🎯' },
    { id: 'SLEEP', label: 'Sen', emoji: '😴' },
    { id: 'ENERGY', label: 'Energia', emoji: '⚡' },
    { id: 'SILENCE', label: 'Cisza', emoji: '🌸' }
];

const VOICES = [
    { id: 'LUNA', label: 'Luna', description: 'Kobiecy - miękki, kojący', free: true },
    { id: 'LAUREN', label: 'Lauren', description: 'Kobiecy - uspokajający', free: true },
    { id: 'CALEB', label: 'Caleb', description: 'Męski - kojący, łagodny', free: false },
    { id: 'DANIEL', label: 'Daniel', description: 'Męski - silny, pewny siebie', free: false }
];

const POSITIONS = [
    { id: 'SITTING', label: 'Siedząca', emoji: '🪑' },
    { id: 'LYING', label: 'Leżąca', emoji: '🛏️' },
    { id: 'STANDING', label: 'Stojąca', emoji: '🧍' }
];

const EYES = [
    { id: 'CLOSED', label: 'Zamknięte', emoji: '👁️' },
    { id: 'OPEN', label: 'Otwarte', emoji: '👀' }
];

export default function QuickStartModal({ isOpen, onClose }: QuickStartModalProps) {
    const navigate = useNavigate();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [formData, setFormData] = useState<SessionFormData>({
        goal: 'STRESS_RELIEF',
        duration: 5,
        voice: 'LUNA',
        position: 'SITTING',
        eyes: 'CLOSED'
    });
    const [loadingData, setLoadingData] = useState(true);
    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const fetchData = async () => {
        setLoadingData(true);
        try {
            const [subResponse, prefResponse] = await Promise.all([
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/subscriptions/me`, { withCredentials: true }),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user-preferences/me`, { withCredentials: true })
            ]);

            console.log(subResponse)
            console.log(prefResponse)

            if (subResponse.data.success) {
                setSubscription(subResponse.data.data);
            }

            if (prefResponse.data.success) {
                const prefs = prefResponse.data.data;
                setFormData({
                    goal: prefs.preferredGoal || 'STRESS_RELIEF',
                    duration: prefs.preferredDuration || 5,
                    voice: prefs.preferredVoice || 'LUNA',
                    position: prefs.preferredPosition || 'SITTING',
                    eyes: prefs.preferredEyes || 'CLOSED'
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleStartSession = () => {
        // Navigate to session page with form data
        // The Session page will handle calling the generate API
        navigate('/session', {
            state: {
                sessionData: formData
            }
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    <X size={24} />
                </button>

                <div className={styles.modalContent}>
                    <h2 className={styles.modalTitle}>Rozpocznij sesję meditacji</h2>

                    {subscription?.plan === 'FREE' && (
                        <div className={styles.quotaDisplay}>
                            <span className={styles.quotaText}>
                                {subscription.remainingFreeSessions}/3 darmowych sesji pozostało
                            </span>
                        </div>
                    )}

                    {loadingData ? (
                        <div className={styles.loading}>Ładowanie...</div>
                    ) : (
                        <>
                            <div className={styles.section}>
                                <label className={styles.sectionLabel}>Wybierz cel</label>
                                <div className={styles.goalsGrid}>
                                    {GOALS.map(goal => (
                                        <button
                                            key={goal.id}
                                            className={`${styles.goalCard} ${formData.goal === goal.id ? styles.selected : ''}`}
                                            onClick={() => setFormData({ ...formData, goal: goal.id })}
                                        >
                                            <span className={styles.goalEmoji}>{goal.emoji}</span>
                                            <span className={styles.goalLabel}>{goal.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.section}>
                                <label className={styles.sectionLabel}>
                                    Czas trwania: {formData.duration} min
                                </label>
                                <input
                                    type="range"
                                    min="5"
                                    max={maxDuration(subscription)}
                                    step="5"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                    className={styles.slider}
                                />
                                <div className={styles.sliderLabels}>
                                    <span>5 min</span>
                                    <span>{maxDuration(subscription)} min</span>
                                </div>
                            </div>

                            <div className={styles.section}>
                                <label className={styles.sectionLabel}>Wybierz głos</label>
                                <div className={styles.voicesGrid}>
                                    {VOICES.map(voice => {
                                        const isDisabled = !voice.free && subscription?.plan === 'FREE';
                                        return (
                                            <button
                                                key={voice.id}
                                                className={`${styles.voiceCard} ${formData.voice === voice.id ? styles.selected : ''} ${isDisabled ? styles.disabled : ''}`}
                                                onClick={() => !isDisabled && setFormData({ ...formData, voice: voice.id })}
                                                disabled={isDisabled}
                                            >
                                                <div className={styles.voiceHeader}>
                                                    <span className={styles.voiceLabel}>{voice.label}</span>
                                                    {!voice.free && (
                                                        <span className={styles.premiumBadge}>Premium</span>
                                                    )}
                                                </div>
                                                <span className={styles.voiceDescription}>{voice.description}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className={styles.section}>
                                <label className={styles.sectionLabel}>Pozycja</label>
                                <div className={styles.optionsGrid}>
                                    {POSITIONS.map(position => (
                                        <button
                                            key={position.id}
                                            className={`${styles.optionCard} ${formData.position === position.id ? styles.selected : ''}`}
                                            onClick={() => setFormData({ ...formData, position: position.id })}
                                        >
                                            <span className={styles.optionEmoji}>{position.emoji}</span>
                                            <span className={styles.optionLabel}>{position.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.section}>
                                <label className={styles.sectionLabel}>Oczy</label>
                                <div className={styles.optionsGrid}>
                                    {EYES.map(eyes => (
                                        <button
                                            key={eyes.id}
                                            className={`${styles.optionCard} ${formData.eyes === eyes.id ? styles.selected : ''}`}
                                            onClick={() => setFormData({ ...formData, eyes: eyes.id })}
                                        >
                                            <span className={styles.optionEmoji}>{eyes.emoji}</span>
                                            <span className={styles.optionLabel}>{eyes.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                className={styles.startButton}
                                onClick={handleStartSession}
                            >
                                Rozpocznij
                            </button>

                            <p className={styles.footerText}>
                                Używane ustawienia: Twoje preferencje
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
