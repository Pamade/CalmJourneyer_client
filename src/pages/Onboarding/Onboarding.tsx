import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Sparkles, Brain, Heart, Zap, Moon, Play, Loader, Square } from "lucide-react";
import styles from "./Onboarding.module.scss";
import type { SessionData, OnboardingData, Voice, Eyes, Position, Goal, VoiceOption } from "../../types/session";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
const Onboarding: React.FC = () => {

    const navigate = useNavigate();
    const { user } = useAuth(); // Get user from auth context
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<OnboardingData>({
        name: '',
        goal: 'STRESS_RELIEF',
        eyes: 'CLOSED',
        position: 'SITTING',
        duration: 10,
        voice: 'LUNA',
        speed: '0.0', // Default normal speed
    });

    const [playingVoice, setPlayingVoice] = useState<Voice | null>(null);
    const [loadingVoice, setLoadingVoice] = useState<Voice | null>(null);
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

    // Helper function to read cookies
    const getCookie = (name: string): string | null => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
    };

    // Guard: Prevent access if onboarding already completed
    useEffect(() => {
        // For logged-in users, check backend value from auth context
        if (user?.onboardingCompleted) {
            navigate('/dashboard', { replace: true });
            return;
        }

        // For guest users, check onboarding_completed cookie from backend
        const onboardingCookie = getCookie('onboarding_completed');
        if (!user && onboardingCookie === 'true') {
            navigate('/login', { replace: true });
            return;
        }
    }, [user, navigate]);

    console.log(formData)

    const totalSteps = 5;

    const goals = [
        { id: 'STRESS_RELIEF' as Goal, label: 'Stress Relief', icon: Heart, pattern: '4-0-6-0', description: 'Breathe in (4s) • Breathe out (6s)' },
        { id: 'FOCUS' as Goal, label: 'Focus & Clarity', icon: Brain, pattern: '4-4-4-4', description: 'Breathe in (4s) • Hold (4s) • Breathe out (4s) • Pause (4s)' },
        { id: 'ENERGY' as Goal, label: 'Energy Boost', icon: Zap, pattern: '4-0-4-0', description: 'Breathe in (4s) • Breathe out (4s)' },
        { id: 'SLEEP' as Goal, label: 'Better Sleep', icon: Moon, pattern: '4-7-8-0', description: 'Breathe in (4s) • Hold (7s) • Breathe out (8s)' },
        // { id: 'ANXIETY' as Goal, label: 'Manage Anxiety', icon: Heart, pattern: '4-0-6-0', description: 'Breathe in (4s) • Breathe out (6s)' },
        { id: 'SILENCE' as Goal, label: 'Silence.', icon: Sparkles, pattern: '4-4-4-4', description: 'Breathe in (4s) • Hold (4s) • Breathe out (4s) • Pause (4s)' },
    ];

    const voices: VoiceOption[] = [
        { id: 'LUNA', label: 'Luna', description: 'Calm and soothing', unrealSpeechId: 'Luna' },
        { id: 'LAUREN', label: 'Lauren', description: 'Warm and gentle', unrealSpeechId: 'Lauren' },
        { id: 'CALEB', label: 'Caleb', description: 'Deep and grounding', unrealSpeechId: 'Caleb' },
        { id: 'DANIEL', label: 'Daniel', description: 'Clear and focused', unrealSpeechId: 'Daniel' },
        { id: "MELODY", label: "Melody", description: "Soft and melodic", unrealSpeechId: "Melody" },
        { id: "JASPER", label: "Jasper", description: "Rich and soothing", unrealSpeechId: "Jasper" }
    ];

    const eyeOptions = [
        { id: 'CLOSED' as Eyes, label: 'Eyes Closed', description: 'Traditional meditation' },
        { id: 'OPEN' as Eyes, label: 'Eyes Open', description: 'Soft gaze meditation' },
    ];

    const positionOptions = [
        { id: 'SITTING' as Position, label: 'Sitting', description: 'Cross-legged or chair' },
        { id: 'LYING' as Position, label: 'Lying Down', description: 'For deep relaxation' },
        { id: 'STANDING' as Position, label: 'Standing', description: 'Active meditation' },
    ];

    const previewText = "Welcome to your meditation. Let's begin this peaceful journey together.";

    const handlePlayVoicePreview = async (voice: VoiceOption) => {
        if (playingAudio) {
            audioElement?.pause();
            setPlayingVoice(null);
            return;
        }

        setLoadingVoice(voice.id);

        try {

            const response = await axios.post('https://api.v8.unrealspeech.com/speech', {
                Text: previewText,
                VoiceId: voice.unrealSpeechId,
                Bitrate: '320k',
                AudioFormat: 'mp3',
                OutputFormat: 'uri',
                TimestampType: 'sentence',
                sync: false,
            }, {
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_UNREAL_SPEECH_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.data) {
                throw new Error('Failed to generate voice preview');
            }

            const data = await response.data;
            const audioUrl = data.OutputUri;

            const audio = new Audio(audioUrl);
            audio.onended = () => {
                setPlayingVoice(null);
            };
            audio.play();
            setAudioElement(audio);
            setPlayingVoice(voice.id);

            // Automatically select this voice when preview is played
            setFormData({ ...formData, voice: voice.id });
        } catch (error) {
            console.error('Error playing voice preview:', error);
            alert('Failed to play voice preview. Please try again.');
        } finally {
            setLoadingVoice(null);
        }
    };

    const playingAudio = playingVoice !== null;

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async () => {
        try {

            navigate("/session", { state: { sessionData: formData as SessionData } });
            // Placeholder for axios endpoint
            // const response = await fetch('/api/onboarding', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData),
            // });
            // console.log('Onboarding completed:', formData);
            // Navigate to main app or show success message
        } catch (error) {
            console.error('Error submitting onboarding:', error);
        }
    };

    return (
        <div className={styles.onboardingContainer}>
            <div className={styles.progressBar}>
                <div
                    className={styles.progressFill}
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                />
            </div>

            <div className={styles.content}>
                {step === 1 && (
                    <div className={styles.stepContent}>
                        <h1 className={styles.title}>Welcome to CalmJourneyer</h1>
                        <p className={styles.subtitle}>Let's personalize your meditation journey</p>

                        <div className={styles.formGroup}>
                            <label htmlFor="name">What should we call you?</label>
                            <input
                                id="name"
                                type="text"
                                className={styles.input}
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className={styles.stepContent}>
                        <h1 className={styles.title}>What's your goal today?</h1>
                        <p className={styles.subtitle}>Each goal includes a breathing pattern to support your intention</p>

                        <div className={styles.goalsGrid}>
                            {goals.map(goal => {
                                const IconComponent = goal.icon;
                                return (
                                    <button
                                        key={goal.id}
                                        className={`${styles.goalCard} ${formData.goal === goal.id ? styles.selected : ''}`}
                                        onClick={() => setFormData({ ...formData, goal: goal.id })}
                                    >
                                        <IconComponent className={styles.goalIcon} size={32} />
                                        <span className={styles.goalLabel}>{goal.label}</span>
                                        <span className={styles.goalPattern}>{goal.pattern}</span>
                                        <span className={styles.goalDescription}>{goal.description}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className={styles.stepContent}>
                        <h1 className={styles.title}>Choose your guide</h1>
                        <p className={styles.subtitle}>Select the voice that resonates with you</p>

                        <div className={styles.optionsList}>
                            {voices.map(voice => (
                                <button
                                    key={voice.id}
                                    className={`${styles.optionCard} ${formData.voice === voice.id ? styles.selected : ''}`}
                                    onClick={() => setFormData({ ...formData, voice: voice.id })}
                                >
                                    <div className={styles.optionContent}>
                                        <div className={styles.optionHeader}>
                                            <span className={styles.optionLabel}>{voice.label}</span>
                                        </div>
                                        <p className={styles.optionDescription}>{voice.description}</p>
                                    </div>
                                    <div
                                        className={styles.previewButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePlayVoicePreview(voice);
                                        }}
                                    // disabled={loadingVoice === voice.id}
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
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className={styles.stepContent}>
                        <h1 className={styles.title}>Your meditation posture</h1>
                        <p className={styles.subtitle}>Set your preferred practice style</p>

                        <div className={styles.formGroup}>
                            <label>Eyes preference</label>
                            <div className={styles.optionsList}>
                                {eyeOptions.map(eye => (
                                    <button
                                        key={eye.id}
                                        className={`${styles.optionCard} ${styles.compact} ${formData.eyes === eye.id ? styles.selected : ''}`}
                                        onClick={() => setFormData({ ...formData, eyes: eye.id })}
                                    >
                                        <div className={styles.optionHeader}>
                                            <span className={styles.optionLabel}>{eye.label}</span>
                                        </div>
                                        <p className={styles.optionDescription}>{eye.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Position preference</label>
                            <div className={styles.optionsList}>
                                {positionOptions.map(pos => (
                                    <button
                                        key={pos.id}
                                        className={`${styles.optionCard} ${styles.compact} ${formData.position === pos.id ? styles.selected : ''}`}
                                        onClick={() => setFormData({ ...formData, position: pos.id })}
                                    >
                                        <div className={styles.optionHeader}>
                                            <span className={styles.optionLabel}>{pos.label}</span>
                                        </div>
                                        <p className={styles.optionDescription}>{pos.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className={styles.stepContent}>
                        <h1 className={styles.title}>Final preferences</h1>
                        <p className={styles.subtitle}>Customize your experience</p>

                        <div className={styles.formGroup}>
                            <label htmlFor="duration">Session duration</label>
                            <div className={styles.durationSelector}>
                                <input
                                    id="duration"
                                    type="range"
                                    min="5"
                                    max="30"
                                    step="5"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                    className={styles.slider}
                                />
                                <span className={styles.durationValue}>{formData.duration} minutes</span>
                            </div>
                        </div>

                        <div className={styles.summary}>
                            <h3>Your personalized journey:</h3>
                            <ul className={styles.summaryList}>
                                <li><strong>Goal:</strong> {goals.find(g => g.id === formData.goal)?.label}</li>
                                <li><strong>Voice:</strong> {voices.find(v => v.id === formData.voice)?.label}</li>
                                <li><strong>Eyes:</strong> {eyeOptions.find(e => e.id === formData.eyes)?.label}</li>
                                <li><strong>Position:</strong> {positionOptions.find(p => p.id === formData.position)?.label}</li>
                                <li><strong>Duration:</strong> {formData.duration} minutes</li>
                            </ul>
                        </div>
                    </div>
                )}

                <div className={styles.navigation}>
                    {step > 1 && (
                        <button onClick={handleBack} className={styles.btnSecondary}>
                            Back
                        </button>
                    )}

                    {step < totalSteps ? (
                        <button
                            onClick={handleNext}
                            className={styles.btnPrimary}
                            disabled={formData.name.trim().length === 0 && step === 1}
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className={styles.btnPrimary}
                        // disabled={!canProceed()}
                        >
                            Start Your Journey
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
