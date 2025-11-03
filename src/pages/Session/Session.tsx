import { useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { Loader, X } from 'lucide-react';
import styles from './Session.module.scss';
import type { OnboardingData, SessionType, AmbientSound, GenerateSessionResponse } from '../../types/session';
import SessionPlayer from '../../components/SessionPlayer/SessionPlayer';
import SessionComplete from '../../components/SessionComplete/SessionComplete';
import ThemeSwitcher from '../../components/ThemeSwitcher/ThemeSwitcher';
import AmbientSoundSwitcher from '../../components/AmbientSoundSwitcher/AmbientSoundSwitcher';
import ExitConfirmationModal from '../../components/ExitConfirmationModal/ExitConfirmationModal';
import publicAxiosInstance from '../../utils/publicAxiosInstance';
import { useAuth } from '../../context/AuthContext';

function Session() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const sessionData = location.state?.sessionData as OnboardingData;

    const meditationQuotes = [
        "The present moment is filled with joy and happiness. If you are attentive, you will see it.",
        "Meditation is not evasion; it is a serene encounter with reality.",
        "In stillness, the world resets.",
        "Peace comes from within. Do not seek it without.",
        "The quieter you become, the more you can hear.",
        "Breath is the bridge which connects life to consciousness.",
        "Your calm mind is the ultimate weapon against your challenges.",
        "Silence is not empty, it is full of answers."
    ];

    const [isLoading, setIsLoading] = useState(true);
    const [sessionResponse, setSessionResponse] = useState<SessionType | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isThemeSwitcherOpen, setIsThemeSwitcherOpen] = useState(false);
    const [isAmbientSwitcherOpen, setIsAmbientSwitcherOpen] = useState(false);
    const [ambientVolume, setAmbientVolume] = useState(0.1); // Default 10%
    const [isAmbientMuted, setIsAmbientMuted] = useState(false);
    const [isNarrationMuted, setIsNarrationMuted] = useState(false);
    const [currentAmbientSound, setCurrentAmbientSound] = useState<AmbientSound | null>(null);
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

    const handleSessionComplete = () => {
        setIsComplete(true);
    };

    // Save session to backend
    const saveSessionToBackend = async (session: SessionType) => {
        try {
            await publicAxiosInstance.post('/api/sessions/create', {
                sessionId: session.id,
                goal: sessionData.goal,
                durationMinutes: sessionData.duration,
                voice: sessionData.voice,
                position: sessionData.position,
                eyes: sessionData.eyes,
                ambientSound: session.ambientSound,
            });

            console.log('Session created in backend successfully');
        } catch (err) {
            console.error('Failed to save session to backend:', err);
        }
    };

    // Rotate quotes every 10 seconds while loading
    useEffect(() => {
        if (!isLoading) return;

        const interval = setInterval(() => {
            setCurrentQuoteIndex((prev) => (prev + 1) % meditationQuotes.length);
        }, 10000);

        return () => clearInterval(interval);
    }, [isLoading, meditationQuotes.length]);

    useEffect(() => {
        if (!sessionData) {
            navigate('/onboarding');
            return;
        }

        const generateSession = async () => {
            try {
                setError(null);

                const response = await axiosInstance.post<GenerateSessionResponse>('/sessions/generate', {
                    goal: sessionData.goal,
                    duration: sessionData.duration,
                    voice: sessionData.voice,
                    position: sessionData.position,
                    eyes: sessionData.eyes,
                });

                if (response.data.success) {
                    const session = response.data.data;
                    setSessionResponse(session);

                    // Save session to backend after successful generation
                    await saveSessionToBackend(session);
                } else {
                    setError(response.data.message || 'Failed to prepare your session.');
                }
                console.log(response)

            } catch (err) {
                console.error('Error generating session:', err);
                setError('Failed to prepare your session. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        generateSession();
    }, [sessionData]);


    const handleThemeSelect = (newTheme: AmbientSound) => {
        if (sessionResponse) {
            setSessionResponse({ ...sessionResponse, ambientSound: newTheme });
        }
    };

    const handleAmbientSoundSelect = (newSound: AmbientSound) => {
        // Only update the playing ambient sound, not the theme
        setCurrentAmbientSound(newSound);
    };

    const handleExitSession = () => {
        navigate('/dashboard');
    };

    const getThemeClass = (ambientSound: AmbientSound) => {
        return styles[`theme-${ambientSound}`] || '';
    };

    if (isLoading) {
        return (
            <div className={`${styles.sessionContainer} ${styles.loadingBg}`}>
                <div className={styles.contentWrapper}>
                    <div className={styles.loader}>
                        <div className={styles.loaderSpinner}>
                            <Loader size={64} className={styles.spinnerIcon} />
                        </div>
                        <h2>Preparing Your Session</h2>
                        <p className={styles.quote} key={currentQuoteIndex}>
                            {meditationQuotes[currentQuoteIndex]}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${styles.sessionContainer} ${styles.defaultBg}`}>
                <div className={styles.contentWrapper}>
                    <div className={styles.error}>
                        <h2>Oops! Something went wrong.</h2>
                        <p>{error}</p>
                        <button onClick={() => navigate('/onboarding')}>Start Over</button>
                    </div>
                </div>
            </div>
        );
    }

    if (!sessionResponse) {
        return null; // Or a fallback for no session
    }

    return (
        <div className={`${styles.sessionContainer} ${getThemeClass(sessionResponse.ambientSound)}`}>
            <button
                className={styles.exitButton}
                onClick={() => setIsExitModalOpen(true)}
                title="Exit Session"
            >
                <X size={24} />
            </button>
            <div className={styles.contentWrapper}>
                {isComplete ? (
                    <SessionComplete
                        sessionId={sessionResponse.id}
                        userId={user?.id || null}
                    />
                ) : (
                    <SessionPlayer
                        session={sessionResponse}
                        onSessionComplete={handleSessionComplete}
                        onOpenThemeSwitcher={() => setIsThemeSwitcherOpen(true)}
                        onOpenAmbientSwitcher={() => setIsAmbientSwitcherOpen(true)}
                        ambientVolume={ambientVolume}
                        isAmbientMuted={isAmbientMuted}
                        currentAmbientSound={currentAmbientSound ?? sessionResponse.ambientSound}
                        isNarrationMuted={isNarrationMuted}
                        onNarrationMuteToggle={() => setIsNarrationMuted(!isNarrationMuted)}
                        onAmbientMuteToggle={() => setIsAmbientMuted(!isAmbientMuted)}
                    />
                )}
            </div>
            <ThemeSwitcher
                isOpen={isThemeSwitcherOpen}
                onClose={() => setIsThemeSwitcherOpen(false)}
                onThemeSelect={handleThemeSelect}
                currentTheme={sessionResponse.ambientSound}
            />
            <AmbientSoundSwitcher
                isOpen={isAmbientSwitcherOpen}
                onClose={() => setIsAmbientSwitcherOpen(false)}
                onSoundSelect={handleAmbientSoundSelect}
                currentSound={currentAmbientSound ?? sessionResponse.ambientSound}
                volume={ambientVolume}
                onVolumeChange={setAmbientVolume}
                isAmbientMuted={isAmbientMuted}
                onAmbientMuteToggle={() => setIsAmbientMuted(!isAmbientMuted)}
            />
            <ExitConfirmationModal
                isOpen={isExitModalOpen}
                onCancel={() => setIsExitModalOpen(false)}
                onConfirm={handleExitSession}
            />
        </div>
    );
}

export default Session;