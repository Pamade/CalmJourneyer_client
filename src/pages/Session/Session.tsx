import { useLocation, useNavigate, useParams } from 'react-router';
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
import { useAuth } from '../../context/AuthContext';

function Session() {
    const location = useLocation();
    const navigate = useNavigate();
    const { sessionId } = useParams<{ sessionId: string }>();
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

    // Rotate quotes every 10 seconds while loading
    useEffect(() => {
        if (!isLoading) return;

        const interval = setInterval(() => {
            setCurrentQuoteIndex((prev) => (prev + 1) % meditationQuotes.length);
        }, 10000);

        return () => clearInterval(interval);
    }, [isLoading, meditationQuotes.length]);

    useEffect(() => {
        // Mode 1: Shared session (public access)
        if (location.pathname.startsWith('/session/shared/')) {
            fetchSharedSession();
            return;
        }

        // Mode 2: Replay existing session (has sessionId in URL, requires auth)
        if (sessionId) {
            fetchExistingSession();
            return;
        }

        // Mode 3: Generate new session (has sessionData in state)
        if (!sessionData) {
            navigate('/onboarding');
            return;
        }

        generateNewSession();
    }, [sessionId, sessionData]);

    // Fetch shared session (public access)
    const fetchSharedSession = async () => {
        try {
            setError(null);
            const response = await axiosInstance.get<GenerateSessionResponse>(`/sessions/shared/${sessionId}`);

            if (response.data.success) {
                const session = response.data.data;

                // Parse sessionData if it's a string (from DB)
                if (typeof session.sessionData === 'string') {
                    session.sessionData = JSON.parse(session.sessionData);
                }

                setSessionResponse(session);
            } else {
                setError(response.data.message || 'This session is not available.');
            }
        } catch (err) {
            console.error('Error fetching shared session:', err);
            setError('This session is not publicly shared or does not exist.');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch existing session for replay
    const fetchExistingSession = async () => {
        try {
            setError(null);
            const response = await axiosInstance.get<GenerateSessionResponse>(`/sessions/${sessionId}`);

            if (response.data.success) {
                console.log(response.data)
                const session = response.data.data;

                // Parse sessionData if it's a string (from DB)
                if (typeof session.sessionData === 'string') {
                    session.sessionData = JSON.parse(session.sessionData);
                }

                setSessionResponse(session);
            } else {
                setError(response.data.message || 'Failed to load session.');
            }
        } catch (err) {
            console.error('Error fetching session:', err);
            setError('Failed to load session. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Generate new session from sessionData
    const generateNewSession = async () => {
        const isOnBoardingCompleted = localStorage.getItem('is_onboarding_completed');
        try {
            setError(null);
            if (!user && isOnBoardingCompleted === 'true') {
                return setError('Please log in to generate a new session.');
            }

            const response = await axiosInstance.post<GenerateSessionResponse>('/sessions/generate', {
                goal: sessionData.goal,
                duration: sessionData.duration,
                voice: sessionData.voice,
                position: sessionData.position,
                eyes: sessionData.eyes,
                speed: sessionData.speed,
            });

            if (response.data.success) {
                const session = response.data.data;
                setSessionResponse(session);
                if (!user && !isOnBoardingCompleted) {
                    localStorage.setItem('is_onboarding_completed', 'true');
                }
                // Note: Session is already saved to DB by /sessions/generate endpoint
            } else {
                setError(response.data.message || 'Failed to prepare your session.');
            }
        } catch (err) {
            console.error('Error generating session:', err);
            setError('Failed to prepare your session. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


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
        const token = localStorage.getItem('is_onboarding_completed');
        // const isUserLoggedIn = !user;

        // Not logged in + onboarding completed = redirect to login
        if (!user && token === 'true') {
            return (
                <div className={`${styles.sessionContainer} ${styles.defaultBg}`}>
                    <div className={styles.contentWrapper}>
                        <div className={styles.error}>
                            <h2>Login Required</h2>
                            <p>Please log in to generate a new meditation session.</p>
                            <button onClick={() => navigate('/login')}>Log In</button>
                        </div>
                    </div>
                </div>
            );
        }

        if (!user && token !== 'true') {
            return (
                <div className={`${styles.sessionContainer} ${styles.defaultBg}`}>
                    <div className={styles.contentWrapper}>
                        <div className={styles.error}>
                            <h2>Oops! Something wehnt wrong.</h2>

                            <button onClick={() => navigate('/onboarding')}>Try Again</button>
                        </div>
                    </div>
                </div>
            );
        }

        // Default error or not logged in + not onboarded = go to onboarding
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
            {!isComplete && (
                <button
                    className={styles.exitButton}
                    onClick={() => setIsExitModalOpen(true)}
                    title="Exit Session"
                >
                    <X size={24} />
                </button>
            )}
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