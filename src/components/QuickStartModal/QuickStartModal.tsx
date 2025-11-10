import { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Heart, Brain, Zap, Moon, Sparkles, Armchair, BedSingle, UserSquare, Eye, EyeOff, Play, Square, Loader } from 'lucide-react';
import { useNavigate } from 'react-router';
import axios from '../../utils/axios';
import styles from './QuickStartModal.module.scss';
import { GOALS, VOICES, POSITIONS, EYES } from '../../utils/sessionOptions';

const goalIcons: Record<string, typeof Heart> = {
    'STRESS_RELIEF': Heart,
    'FOCUS': Brain,
    'ENERGY': Zap,
    'SLEEP': Moon,
    'SILENCE': Sparkles,
};

interface QuickStartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SubscriptionModal {
    plan: string;
    remainingFreeSessions?: number;

}

interface SessionFormData {
    goal: string;
    duration: number;
    voice: string;
    position: string;
    eyes: string;
    speed: string;
}

export default function QuickStartModal({ isOpen, onClose }: QuickStartModalProps) {
    const navigate = useNavigate();
    const [subscription, setSubscription] = useState<SubscriptionModal | null>(null);
    const [formData, setFormData] = useState<SessionFormData>({
        goal: 'STRESS_RELIEF',
        duration: 5,
        voice: 'LUNA',
        position: 'SITTING',
        eyes: 'CLOSED',
        speed: '0.0'
    });
    const [loadingData, setLoadingData] = useState(true);
    const [playingVoice, setPlayingVoice] = useState<string | null>(null);
    const [loadingVoice, setLoadingVoice] = useState<string | null>(null);
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

    const previewText = "Welcome to your meditation. Let's begin this peaceful journey together.";
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
                    eyes: prefs.preferredEyes || 'CLOSED',
                    speed: prefs.preferredSpeed || '0.0'
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingData(false);
        }
    };
    console.log(formData)



    // const handlePlayVoicePreview = async (voiceId: string, unrealSpeechId: string) => {
    //     if (playingVoice === voiceId) {
    //         audioElement?.pause();
    //         setPlayingVoice(null);
    //         return;
    //     }

    //     setLoadingVoice(voiceId);

    //     // Stwórz audio już teraz
    //     const audio = new Audio();
    //     setAudioElement(audio);

    //     try {
    //         const response = await axios.post('https://api.v8.unrealspeech.com/speech', {
    //             Text: previewText,
    //             VoiceId: unrealSpeechId,
    //             Bitrate: '320k',
    //             AudioFormat: 'mp3',
    //             OutputFormat: 'uri',
    //             TimestampType: 'sentence',
    //         }, {
    //             headers: {
    //                 'Authorization': `Bearer ${import.meta.env.VITE_UNREAL_SPEECH_API_KEY}`,
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         audio.src = response.data.OutputUri;
    //         audio.onended = () => setPlayingVoice(null);

    //         // Wywołanie play w reakcji na kliknięcie
    //         await audio.play();
    //         setPlayingVoice(voiceId);

    //     } catch (error) {
    //         console.error('Error playing voice preview:', error);
    //         alert('Failed to play voice preview. Please try again.');
    //     } finally {
    //         setLoadingVoice(null);
    //     }
    // };


    const handlePlayVoicePreview = useCallback(async (voiceId: string, unrealSpeechId: string) => {
        // If an audio is already playing, stop it.
        if (playingVoice !== null) {
            audioElement?.pause();
            setPlayingVoice(null);
            if (playingVoice === voiceId) {
                return;
            }
        }

        setLoadingVoice(voiceId);

        try {
            // 🔧 FIX: Use the EXACT same pattern as Onboarding
            const response = await axios.post('https://api.v8.unrealspeech.com/speech', {
                Text: previewText,
                VoiceId: unrealSpeechId,
                Bitrate: '320k',
                Speed: formData.speed,
                AudioFormat: 'mp3',
                OutputFormat: 'uri',
                TimestampType: 'sentence',
            }, {
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_UNREAL_SPEECH_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.data?.OutputUri) {
                throw new Error('Failed to generate voice preview URI');
            }

            const data = response.data;
            const audioUrl = data.OutputUri;

            // Create audio with the real source immediately (same as Onboarding)
            const audio = new Audio(audioUrl);
            audio.onended = () => {
                setPlayingVoice(null);
            };
            audio.play(); // This works because audio has a valid source
            setAudioElement(audio);
            setPlayingVoice(voiceId);

        } catch (error) {
            console.error('Error playing voice preview:', error);
            alert('Failed to play voice preview. Please try again.');
        } finally {
            setLoadingVoice(null);
        }
    }, [playingVoice, audioElement, formData.speed, previewText]);

    const handleStartSession = useCallback(() => {
        // Navigate to session page with form data
        // The Session page will handle calling the generate API

        if (subscription?.plan.toUpperCase() === 'FREE' && subscription.remainingFreeSessions === 0) {
            return navigate("/pricing");
        }

        navigate('/session', {
            state: {
                sessionData: formData
            }
        });
        onClose();
    }, [subscription, formData, navigate, onClose]);

    const durationOptions = useMemo(() => {
        return [5, 10, 15, 20, 25, 30].map(duration => {
            const isFreeDisabled = subscription?.plan.toLowerCase() === 'free' && duration > 5;
            const isStandardDisabled = subscription?.plan.toLowerCase() === 'standard' && duration > 15;
            const isDisabled = isFreeDisabled || isStandardDisabled;

            let badge = null;
            if (isDisabled && subscription?.plan.toLowerCase() !== 'premium') {
                badge = (subscription?.plan.toLowerCase() === 'free' && duration <= 15) ? 'Standard' : 'Premium';
            }

            return {
                duration,
                isDisabled,
                badge
            };
        });
    }, [subscription]); // Only recalculate when the subscription changes

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    <X size={24} />
                </button>

                <div className={styles.modalContent}>
                    <h2 className={styles.modalTitle}>Start a meditation session</h2>

                    {subscription?.plan.toUpperCase() === 'FREE' && (
                        <div className={styles.quotaDisplay}>
                            <span className={styles.quotaText}>
                                {subscription.remainingFreeSessions}/3 free sessions remaining
                            </span>
                        </div>
                    )}

                    {loadingData ? (
                        <div className={styles.loading}>Loading...</div>
                    ) : (
                        <>
                            <div className={styles.section}>
                                <label className={styles.sectionLabel}>Choose a goal</label>
                                <div className={styles.goalsGrid}>
                                    {GOALS.map(goal => {
                                        const IconComponent = goalIcons[goal.id] || Heart;
                                        return (
                                            <button
                                                key={goal.id}
                                                className={`${styles.goalCard} ${formData.goal === goal.id ? styles.selected : ''}`}
                                                onClick={() => setFormData({ ...formData, goal: goal.id })}
                                            >
                                                <IconComponent className={styles.goalIcon} size={28} />
                                                <span className={styles.goalLabel}>{goal.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className={styles.section}>
                                <label className={styles.sectionLabel}>Duration</label>
                                <div className={styles.optionsGrid}>
                                    {durationOptions.map(({ duration, isDisabled, badge }) => (
                                        <button
                                            key={duration}
                                            className={`${styles.optionCard} ${formData.duration === duration ? styles.selected : ''} ${isDisabled ? styles.disabled : ''}`}
                                            onClick={() => !isDisabled && setFormData({ ...formData, duration: duration })}
                                            disabled={isDisabled}
                                        >
                                            <span className={styles.optionLabel}>{duration} min</span>
                                            {badge && (
                                                <span className={styles.premiumBadge}>
                                                    {badge}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.section}>
                                <label className={styles.sectionLabel}>Speech Speed</label>
                                <div className={styles.speedControl}>
                                    <input
                                        type="range"
                                        min="-0.5"
                                        max="0.5"
                                        step="0.1"
                                        value={formData.speed}
                                        onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
                                        className={styles.speedSlider}
                                    />
                                    <div className={styles.speedLabels}>
                                        <span>Slower</span>
                                        <span className={styles.speedValue}>
                                            {parseFloat(formData.speed) === 0 ? 'Normal' :
                                                parseFloat(formData.speed) > 0 ? `+${formData.speed}x` : `${formData.speed}x`}
                                        </span>
                                        <span>Faster</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.section}>
                                <label className={styles.sectionLabel}>Choose a voice</label>
                                <div className={styles.voicesGrid}>
                                    {VOICES.map(voice => {
                                        const isDisabled = !voice.free && subscription?.plan.toUpperCase() === 'FREE';
                                        return (
                                            <div
                                                key={voice.id}
                                                className={`${styles.voiceCard} ${formData.voice === voice.id ? styles.selected : ''} ${isDisabled ? styles.disabled : ''}`}
                                                onClick={() => !isDisabled && setFormData({ ...formData, voice: voice.id })}
                                            >
                                                <div className={styles.voiceHeader}>
                                                    <span className={styles.voiceLabel}>{voice.label}</span>
                                                    {!voice.free && (
                                                        <span className={styles.premiumBadge}>Standard</span>
                                                    )}
                                                </div>
                                                <span className={styles.voiceDescription}>{voice.description}</span>
                                                <button
                                                    className={styles.previewButton}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePlayVoicePreview(voice.id, voice.unrealSpeechId);
                                                    }}
                                                    disabled={loadingVoice === voice.id}
                                                >
                                                    {loadingVoice === voice.id ? (
                                                        <>
                                                            <Loader className={styles.icon} size={16} />
                                                            Loading...
                                                        </>
                                                    ) : playingVoice === voice.id ? (
                                                        <>
                                                            <Square className={styles.icon} size={16} fill="currentColor" />
                                                            Stop
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Play className={styles.icon} size={16} fill="currentColor" />
                                                            Preview
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className={styles.section}>
                                <label className={styles.sectionLabel}>Position</label>
                                <div className={styles.optionsGrid}>
                                    {POSITIONS.map(position => {
                                        const PositionIcon = position.id === 'SITTING' ? Armchair :
                                            position.id === 'LYING' ? BedSingle :
                                                UserSquare;
                                        return (
                                            <button
                                                key={position.id}
                                                className={`${styles.optionCard} ${formData.position === position.id ? styles.selected : ''}`}
                                                onClick={() => setFormData({ ...formData, position: position.id })}
                                            >
                                                <PositionIcon size={24} className={styles.optionIcon} />
                                                <span className={styles.optionLabel}>{position.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className={styles.section}>
                                <label className={styles.sectionLabel}>Eyes</label>
                                <div className={styles.optionsGrid}>
                                    {EYES.map(eyes => {
                                        const EyeIcon = eyes.id === 'CLOSED' ? EyeOff : Eye;
                                        return (
                                            <button
                                                key={eyes.id}
                                                className={`${styles.optionCard} ${formData.eyes === eyes.id ? styles.selected : ''}`}
                                                onClick={() => setFormData({ ...formData, eyes: eyes.id })}
                                            >
                                                <EyeIcon size={24} className={styles.optionIcon} />
                                                <span className={styles.optionLabel}>{eyes.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                className={styles.startButton}
                                onClick={handleStartSession}
                            >
                                Start
                            </button>

                            <p className={styles.footerText}>
                                Using preferences: Your settings
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
