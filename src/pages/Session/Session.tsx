import { useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader, X } from 'lucide-react';
import styles from './Session.module.scss';
import type { OnboardingData, SessionType, AmbientSound, GenerateSessionResponse } from '../../types/session';
import SessionPlayer from '../../components/SessionPlayer/SessionPlayer';
import SessionComplete from '../../components/SessionComplete/SessionComplete';
import ThemeSwitcher from '../../components/ThemeSwitcher/ThemeSwitcher';
import AmbientSoundSwitcher from '../../components/AmbientSoundSwitcher/AmbientSoundSwitcher';
import ExitConfirmationModal from '../../components/ExitConfirmationModal/ExitConfirmationModal';
// interface SessionResponse {
//     id: string;
//     audioUrl: string;
//     duration: number;
//     // Add other fields as needed
// }

function Session() {
    const location = useLocation();
    const navigate = useNavigate();
    // const sessionData = location.state?.sessionData as OnboardingData;
    const sessionData = {
        goal: 'STRESS_RELIEF',
        duration: 10,
        voice: 'LUNA',
        position: 'SITTING',
        eyes: 'CLOSED',
    }
    const sample_session: GenerateSessionResponse = {
        success: true,
        message: "Session generated successfully",
        data: {
            id: "5f5f6d7f-aaef-420e-a63f-f3e671919028",
            goal: "STRESS_RELIEF",
            targetDurationMinutes: 10,
            actualDurationSeconds: 437,
            voice: "LUNA",
            position: "SITTING",
            eyes: "CLOSED",
            ambientSound: "MOUNTAIN_WIND",
            createdAt: "2025-10-31T14:29:59.369991367",
            expiresAt: "2026-01-29T14:29:59.370008768",
            sessionData: {
                segments: [
                    {
                        title: "Welcome",
                        events: [
                            {
                                text: "Welcome to this moment of peace. Find a comfortable position, sitting or lying down, and allow your eyes to gently close. Let go of any need to do anything other than simply be here, now, as we invite calm.",
                                ssml: "<speak>Welcome to this moment of peace. <break time=\"15s\"/> Find a comfortable position, sitting or lying down, and allow your eyes to gently close. <break time=\"10s\"/> Let go of any need to do anything other than simply be here, now, as we invite calm. <break time=\"20s\"/></speak>",
                                audioUrl: "https://unreal-synthesis-expire-in-90-days.s3-us-west-2.amazonaws.com/8442fd60-6c02-4617-b7fd-451e6fbd67d1-0.mp3",
                                event_id: "narration_intro_1",
                                event_type: "narration",
                                duration_seconds: 25,
                                user_instruction: "Find a comfortable sitting or lying position and gently close your eyes.",
                                start_time_seconds: null
                            }
                        ],
                        segment_id: "intro_1",
                        breathing_pattern: {
                            inhale_seconds: 4,
                            hold_seconds: 0,
                            exhale_seconds: 6,
                            pause_seconds: 0,
                            total_cycles: 0
                        }
                    },
                    {
                        title: "Grounding the Body",
                        events: [
                            {
                                text: "Begin by bringing your awareness to your feet. Feel them resting, perhaps on the floor or a cushion. Allow any tension to soften and release downwards, like sand trickling through your fingers.",
                                ssml: "<speak>Begin by bringing your awareness to your feet. <break time=\"10s\"/> Feel them resting, perhaps on the floor or a cushion. <break time=\"15s\"/> Allow any tension to soften and release downwards, like sand trickling through your fingers. <break time=\"25s\"/></speak>",
                                audioUrl: "https://unreal-synthesis-expire-in-90-days.s3-us-west-2.amazonaws.com/85200036-479a-49e4-bcfa-952058781c28-0.mp3",
                                event_id: "narration_body_1",
                                event_type: "narration",
                                duration_seconds: 22,
                                user_instruction: "Bring awareness to your feet and allow them to soften.",
                                start_time_seconds: null
                            },
                            {
                                text: "Gently guide your attention upwards through your legs, your torso, your arms. With each exhale, imagine releasing any held tension, like clouds drifting away across a vast sky.",
                                ssml: "<speak>Gently guide your attention upwards through your legs, your torso, your arms. <break time=\"15s\"/> With each exhale, imagine releasing any held tension, like clouds drifting away across a vast sky. <break time=\"25s\"/></speak>",
                                audioUrl: "https://unreal-synthesis-expire-in-90-days.s3-us-west-2.amazonaws.com/fd9bb6cf-6fc4-4ec9-9925-0b7119bd8b77-0.mp3",
                                event_id: "narration_body_2",
                                event_type: "narration",
                                duration_seconds: 21,
                                user_instruction: "Scan your body and release tension with each exhale.",
                                start_time_seconds: null
                            }
                        ],
                        segment_id: "body_scan_1",
                        breathing_pattern: {
                            inhale_seconds: 4,
                            hold_seconds: 0,
                            exhale_seconds: 6,
                            pause_seconds: 0,
                            total_cycles: 0
                        }
                    },
                    {
                        title: "Calming Breath",
                        events: [
                            {
                                text: "We will now focus on a gentle, calming breath pattern. Inhale softly through your nose for a count of four, and exhale completely through your mouth for a count of six. This longer exhale helps to signal safety to your nervous system.",
                                ssml: "<speak>We will now focus on a gentle, calming breath pattern. <break time=\"10s\"/> Inhale softly through your nose for a count of four, and exhale completely through your mouth for a count of six. <break time=\"15s\"/> This longer exhale helps to signal safety to your nervous system. <break time=\"20s\"/></speak>",
                                audioUrl: "https://unreal-synthesis-expire-in-90-days.s3-us-west-2.amazonaws.com/d14a2c08-e3f8-4e7d-9b7a-a43392748c61-0.mp3",
                                event_id: "narration_breath_1",
                                event_type: "narration",
                                duration_seconds: 27,
                                user_instruction: "Prepare to follow the 4-inhale, 6-exhale breathing pattern.",
                                start_time_seconds: null
                            },
                            {
                                text: "Continue this rhythm. Inhale... 2... 3... 4. Exhale... 2... 3... 4... 5... 6. Let each breath be an anchor, grounding you in this present moment, like the steady tide of the ocean.",
                                ssml: "<speak>Continue this rhythm. <break time=\"5s\"/> Inhale... 2... 3... 4. <break time=\"5s\"/> Exhale... 2... 3... 4... 5... 6. <break time=\"20s\"/> Let each breath be an anchor, grounding you in this present moment, like the steady tide of the ocean. <break time=\"180s\"/></speak>",
                                audioUrl: "https://unreal-synthesis-expire-in-90-days.s3-us-west-2.amazonaws.com/bc67323c-06e0-41c9-a234-4f877bb08829-0.mp3",
                                event_id: "narration_breath_2",
                                event_type: "narration",
                                duration_seconds: 37,
                                user_instruction: "Follow the 4-second inhale and 6-second exhale, letting each breath calm your system.",
                                start_time_seconds: null
                            }
                        ],
                        segment_id: "breathing_1",
                        breathing_pattern: {
                            inhale_seconds: 4,
                            hold_seconds: 0,
                            exhale_seconds: 6,
                            pause_seconds: 0,
                            total_cycles: 24
                        }
                    },
                    {
                        title: "Peaceful Sanctuary",
                        events: [
                            {
                                text: "Now, allow your imagination to wander to a place of deep peace. Picture yourself beside a calm, serene lake, the water like glass reflecting the soft sky. Feel the gentle breeze, carrying the scent of pine and earth.",
                                ssml: "<speak>Now, allow your imagination to wander to a place of deep peace. <break time=\"15s\"/> Picture yourself beside a calm, serene lake, the water like glass reflecting the soft sky. <break time=\"20s\"/> Feel the gentle breeze, carrying the scent of pine and earth. <break time=\"25s\"/></speak>",
                                audioUrl: "https://unreal-synthesis-expire-in-90-days.s3-us-west-2.amazonaws.com/38446019-76c0-421e-9cbf-be765c4e1a9c-0.mp3",
                                event_id: "narration_viz_1",
                                event_type: "narration",
                                duration_seconds: 26,
                                user_instruction: "Imagine yourself in a serene natural sanctuary.",
                                start_time_seconds: null
                            },
                            {
                                text: "Absorb the quiet stillness, the natural harmony. Allow this sense of profound calm to fill you, like sunlight warming a quiet meadow.",
                                ssml: "<speak>Absorb the quiet stillness, the natural harmony. <break time=\"15s\"/> Allow this sense of profound calm to fill you, like sunlight warming a quiet meadow. <break time=\"20s\"/></speak>",
                                audioUrl: "https://unreal-synthesis-expire-in-90-days.s3-us-west-2.amazonaws.com/0df0482f-4287-41ce-844d-d4e82db5db2a-0.mp3",
                                event_id: "narration_viz_2",
                                event_type: "narration",
                                duration_seconds: 16,
                                user_instruction: "Embrace the feeling of peace and stillness.",
                                start_time_seconds: null
                            }
                        ],
                        segment_id: "visualization_1",
                        breathing_pattern: {
                            inhale_seconds: 4,
                            hold_seconds: 0,
                            exhale_seconds: 6,
                            pause_seconds: 0,
                            total_cycles: 0
                        }
                    },
                    {
                        title: "Returning",
                        events: [
                            {
                                text: "Gently begin to bring your awareness back to the room. Wiggle your fingers and toes, and when you feel ready, slowly open your eyes. Carry this feeling of calm with you as you move back into your day.",
                                ssml: "<speak>Gently begin to bring your awareness back to the room. <break time=\"15s\"/> Wiggle your fingers and toes, and when you feel ready, slowly open your eyes. <break time=\"15s\"/> Carry this feeling of calm with you as you move back into your day. <break time=\"20s\"/></speak>",
                                audioUrl: "https://unreal-synthesis-expire-in-90-days.s3-us-west-2.amazonaws.com/2868c834-7c3e-4c2b-b396-da7fab249e20-0.mp3",
                                event_id: "narration_outro_1",
                                event_type: "narration",
                                duration_seconds: 23,
                                user_instruction: "Gently return your awareness to your surroundings and slowly open your eyes.",
                                start_time_seconds: null
                            }
                        ],
                        segment_id: "outro_1",
                        breathing_pattern: {
                            inhale_seconds: 4,
                            hold_seconds: 0,
                            exhale_seconds: 6,
                            pause_seconds: 0,
                            total_cycles: 0
                        }
                    }
                ],
                tts_audio_map: null,
                ambient_sound: "OCEAN_WAVES"
            }
        },
        timestamp: "2025-10-31T14:29:59.442095019"
    }

    const [isLoading, setIsLoading] = useState(true);
    const [sessionResponse, setSessionResponse] = useState<SessionType | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isThemeSwitcherOpen, setIsThemeSwitcherOpen] = useState(false);
    const [isAmbientSwitcherOpen, setIsAmbientSwitcherOpen] = useState(false);
    const [ambientVolume, setAmbientVolume] = useState(0.5); // Default 50%
    const [isAmbientMuted, setIsAmbientMuted] = useState(false);
    const [isNarrationMuted, setIsNarrationMuted] = useState(false);
    const [currentAmbientSound, setCurrentAmbientSound] = useState<AmbientSound | null>(null);
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);

    const handleSessionComplete = () => {
        setIsComplete(true);
    };

    useEffect(() => {
        // if (!sessionData) {
        //     navigate('/onboarding');
        //     return;
        // }

        const generateSession = async () => {
            // setIsLoading(true);
            try {

                setError(null);

                const response = await axios.post<GenerateSessionResponse>(`${import.meta.env.VITE_BACKEND_URL}/api/sessions/generate`, {
                    goal: sessionData.goal,
                    duration: sessionData.duration,
                    voice: sessionData.voice,
                    position: sessionData.position,
                    eyes: sessionData.eyes,
                });

                if (response.data.success) {
                    setSessionResponse(response.data.data);
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
            <div className={`${styles.sessionContainer} ${styles.defaultBg}`}>
                <div className={styles.contentWrapper}>
                    <div className={styles.loader}>
                        <Loader size={48} />
                        <h2>Preparing Your Session</h2>
                        <p>Personalizing your meditation experience...</p>
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
                    <SessionComplete />
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