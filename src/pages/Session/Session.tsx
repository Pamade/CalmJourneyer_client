
import { useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader } from 'lucide-react';
import styles from './Session.module.scss';
import type { OnboardingData, SessionType } from '../../types/session';
import SessionPlayer from '../../components/SessionPlayer/SessionPlayer';

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
    const sample_session: SessionType = {
        id: "5f5f6d7f-aaef-420e-a63f-f3e671919028",
        goal: "STRESS_RELIEF",
        targetDurationMinutes: 10,
        actualDurationSeconds: 437,
        voice: "LUNA",
        position: "SITTING",
        eyes: "CLOSED",
        ambientSound: "ocean_waves",
        createdAt: "2025-10-31T14:29:59.369991367",
        expiresAt: "2026-01-29T14:29:59.370008768",
        sessionData: {
            segments: [
                {
                    title: "Welcome",
                    segment_id: "intro_1",
                    breathing_pattern: {
                        inhale_seconds: 4,
                        hold_seconds: 0,
                        exhale_seconds: 6,
                        pause_seconds: 0,
                        total_cycles: 0,
                    },
                    events: [
                        {
                            text: "Welcome to this moment of peace. Find a comfortable position, sitting or lying down, and allow your eyes to gently close. Let go of any need to do anything other than simply be here, now, as we invite calm.",
                            ssml: "<speak>Welcome to this moment of peace. <break time=\"15s\"/> Find a comfortable position, sitting or lying down, and allow your eyes to gently close. <break time=\"10s\"/> Let go of any need to do anything other than simply be here, now, as we invite calm. <break time=\"20s\"/></speak>",
                            audioUrl: "https://unreal-synthesis-expire-in-90-days.s3-us-west-2.amazonaws.com/8442fd60-6c02-4617-b7fd-451e6fbd67d1-0.mp3",
                            event_id: "narration_intro_1",
                            event_type: "narration",
                            duration_seconds: 25,
                            user_instruction: "Find a comfortable sitting or lying position and gently close your eyes.",
                            start_time_seconds: null,
                        },
                    ],
                },
                {
                    title: "Grounding the Body",
                    segment_id: "body_scan_1",
                    breathing_pattern: {
                        inhale_seconds: 4,
                        hold_seconds: 0,
                        exhale_seconds: 6,
                        pause_seconds: 0,
                        total_cycles: 0,
                    },
                    events: [
                        {
                            text: "Begin by bringing your awareness to your feet. Feel them resting, perhaps on the floor or a cushion. Allow any tension to soften and release downwards, like sand trickling through your fingers.",
                            ssml: "<speak>Begin by bringing your awareness to your feet. <break time=\"10s\"/> Feel them resting, perhaps on the floor or a cushion. <break time=\"15s\"/> Allow any tension to soften and release downwards, like sand trickling through your fingers. <break time=\"25s\"/></speak>",
                            audioUrl: "https://unreal-synthesis-expire-in-90-days.s3-us-west-2.amazonaws.com/85200036-479a-49e4-bcfa-952058781c28-0.mp3",
                            event_id: "narration_body_1",
                            event_type: "narration",
                            duration_seconds: 22,
                            user_instruction: "Bring awareness to your feet and allow them to soften.",
                            start_time_seconds: null,
                        },
                        {
                            text: "Gently guide your attention upwards through your legs, your torso, your arms. With each exhale, imagine releasing any held tension, like clouds drifting away across a vast sky.",
                            ssml: "<speak>Gently guide your attention upwards through your legs, your torso, your arms. <break time=\"15s\"/> With each exhale, imagine releasing any held tension, like clouds drifting away across a vast sky. <break time=\"25s\"/></speak>",
                            audioUrl: "https://unreal-synthesis-expire-in-90-days.s3-us-west-2.amazonaws.com/fd9bb6cf-6fc4-4ec9-9925-0b7119bd8b77-0.mp3",
                            event_id: "narration_body_2",
                            event_type: "narration",
                            duration_seconds: 21,
                            user_instruction: "Scan your body and release tension with each exhale.",
                            start_time_seconds: null,
                        },
                    ],
                },
                {
                    title: "Calming Breath",
                    segment_id: "breathing_1",
                    breathing_pattern: {
                        inhale_seconds: 4,
                        hold_seconds: 0,
                        exhale_seconds: 6,
                        pause_seconds: 0,
                        total_cycles: 24,
                    },
                    events: [
                        {
                            text: "We will now focus on a gentle, calming breath pattern. Inhale softly through your nose for a count of four, and exhale completely through your mouth for a count of six. This longer exhale helps to signal safety to your nervous system.",
                            ssml: "<speak>We will now focus on a gentle, calming breath pattern. <break time=\"10s\"/> Inhale softly through your nose for a count of four, and exhale completely through your mouth for a count of six. <break time=\"15s\"/> This longer exhale helps to signal safety to your nervous system. <break time=\"20s\"/></speak>",
                            audioUrl: "https://unreal-synthesis-expire-in-90-days.s3-us-west-2.amazonaws.com/d14a2c08-e3f8-4e7d-9b7a-a43392748c61-0.mp3",
                            event_id: "narration_breath_1",
                            event_type: "narration",
                            duration_seconds: 27,
                            user_instruction: "Prepare to follow the 4-inhale, 6-exhale breathing pattern.",
                            start_time_seconds: null,
                        },
                        {
                            text: "Continue this rhythm. Inhale... 2... 3... 4. Exhale... 2... 3... 4... 5... 6. Let each breath be an anchor, grounding you in this present moment, like the steady tide of the ocean.",
                            ssml: "<speak>Continue this rhythm. <break time=\"5s\"/> Inhale... 2... 3... 4. <break time=\"5s\"/> Exhale... 2... 3... 4... 5... 6. <break time=\"20s\"/> Let each breath be an anchor, grounding you in this present moment, like the steady tide of the ocean. <break time=\"180s\"/></speak>",
                            audioUrl: "https://unreal-synthesis-expire-in-90-days.s3-us-west-2.amazonaws.com/bc67323c-06e0-41c9-a234-4f877bb08829-0.mp3",
                            event_id: "narration_breath_2",
                            event_type: "narration",
                            duration_seconds: 37,
                            user_instruction: "Follow the 4-second inhale and 6-second exhale, letting each breath calm your system.",
                            start_time_seconds: null,
                        },
                    ],
                },
                {
                    title: "Peaceful Sanctuary",
                    segment_id: "visualization_1",
                    breathing_pattern: {
                        inhale_seconds: 4,
                        hold_seconds: 0,
                        exhale_seconds: 6,
                        pause_seconds: 0,
                        total_cycles: 0,
                    },
                    events: [
                        {
                            text: "Now, allow your imagination to wander to a place of deep peace. Picture yourself beside a calm, serene lake, the water like glass reflecting the soft sky. Feel the gentle breeze, carrying the scent of pine and earth.",
                            ssml: "<speak>Now, allow your imagination to wander to a place of deep peace. <break time=\"15s\"/> Picture yourself beside a calm, serene lake, the water like glass reflecting the soft sky. <break time=\"20s\"/> Feel the gentle breeze, carrying the scent of pine and earth. <break time=\"25s\"/></speak>",
                            audioUrl: "https://unreal-synthesis-expire-in-90-days.s3-us-west-2.amazonaws.com/38446019-76c0-421e-9cbf-be765c4e1a9c-0.mp3",
                            event_id: "narration_viz_1",
                            event_type: "narration",
                            duration_seconds: 26,
                            user_instruction: "Imagine yourself in a serene natural sanctuary.",
                            start_time_seconds: null,
                        },
                        {
                            text: "Absorb the quiet stillness, the natural harmony. Allow this sense of profound calm to fill you, like sunlight warming a quiet meadow.",
                            ssml: "<speak>Absorb the quiet stillness, the natural harmony. <break time=\"15s\"/> Allow this sense of profound calm to fill you, like sunlight warming a quiet meadow. <break time=\"20s\"/></speak>",
                            audioUrl: "https://unreal-synthesis-expire-in-90-days.s3-us-west-2.amazonaws.com/0df0482f-4287-41ce-844d-d4e82db5db2a-0.mp3",
                            event_id: "narration_viz_2",
                            event_type: "narration",
                            duration_seconds: 16,
                            user_instruction: "Embrace the feeling of peace and stillness.",
                            start_time_seconds: null,
                        },
                    ],
                },
                {
                    title: "Returning",
                    segment_id: "outro_1",
                    breathing_pattern: {
                        inhale_seconds: 4,
                        hold_seconds: 0,
                        exhale_seconds: 6,
                        pause_seconds: 0,
                        total_cycles: 0,
                    },
                    events: [
                        {
                            text: "Gently begin to bring your awareness back to the room. Wiggle your fingers and toes, and when you feel ready, slowly open your eyes. Carry this feeling of calm with you as you move back into your day.",
                            ssml: "<speak>Gently begin to bring your awareness back to the room. <break time=\"15s\"/> Wiggle your fingers and toes, and when you feel ready, slowly open your eyes. <break time=\"15s\"/> Carry this feeling of calm with you as you move back into your day. <break time=\"20s\"/></speak>",
                            audioUrl: "https://unreal-synthesis-expire-in-90-days.s3-us-west-2.amazonaws.com/2868c834-7c3e-4c2b-b396-da7fab249e20-0.mp3",
                            event_id: "narration_outro_1",
                            event_type: "narration",
                            duration_seconds: 23,
                            user_instruction: "Gently return your awareness to your surroundings and slowly open your eyes.",
                            start_time_seconds: null,
                        },
                    ],
                },
            ],
            tts_audio_map: null,
            ambient_sound: "ocean_waves",
        },
    };
    const [isLoading, setIsLoading] = useState(true);
    const [sessionResponse, setSessionResponse] = useState<SessionType>(sample_session);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // if (!sessionData) {
        //     navigate('/onboarding');
        //     return;
        // }

        const generateSession = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/sessions/generate`, {
                //     goal: sessionData.goal,
                //     duration: sessionData.duration,
                //     voice: sessionData.voice,
                //     position: sessionData.position,
                //     eyes: sessionData.eyes,
                // });

                // setSessionResponse(response.data);
            } catch (err) {
                console.error('Error generating session:', err);
                setError('Failed to prepare your session. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        generateSession();
    }, [sessionData]);

    // if (!sessionData) {
    //     return null;
    // }

    // if (isLoading) {
    //     return (
    //         <div className={styles.sessionContainer}>
    //             <div className={styles.preparingContent}>
    //                 <Loader className={styles.loadingIcon} size={48} />
    //                 <h1 className={styles.preparingTitle}>Preparing Your Session</h1>
    //                 <p className={styles.preparingSubtitle}>
    //                     Creating your personalized meditation...
    //                 </p>
    //                 <div className={styles.loadingBar}>
    //                     <div className={styles.loadingBarFill}></div>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    // if (error) {
    //     return (
    //         <div className={styles.sessionContainer}>
    //             <div className={styles.errorContent}>
    //                 <h1 className={styles.errorTitle}>Oops!</h1>
    //                 <p className={styles.errorMessage}>{error}</p>
    //                 <button
    //                     className={styles.retryButton}
    //                     onClick={() => navigate('/onboarding')}
    //                 >
    //                     Try Again
    //                 </button>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className={styles.sessionContainer}>
            {/* Session Header */}
            <header className={styles.sessionHeader}>
                <button
                    className={styles.backButton}
                    onClick={() => navigate('/dashboard')}
                >
                    ← Back
                </button>
                <h1 className={styles.sessionTitle}>Your Meditation</h1>
                <div className={styles.sessionMeta}>
                    <span className={styles.duration}>{sessionData.duration} min</span>
                </div>
            </header>

            {/* Main Session Content */}
            <main className={styles.sessionContent}>
                {sessionResponse && (
                    <SessionPlayer session={sessionResponse} />
                )}
                {/* Audio Player Component - Add here */}
                <div className={styles.playerSection}>
                    {/* TODO: Add AudioPlayer component */}
                </div>

                {/* Session Info */}
                {/* <div className={styles.sessionInfo}>
                    <div className={styles.infoCard}>
                        <h3 className={styles.infoTitle}>Your Session</h3>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Goal</span>
                                <span className={styles.infoValue}>{sessionData.goal}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Voice</span>
                                <span className={styles.infoValue}>{sessionData.voice}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Position</span>
                                <span className={styles.infoValue}>{sessionData.position}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Eyes</span>
                                <span className={styles.infoValue}>{sessionData.eyes}</span>
                            </div>
                        </div>
                    </div>
                </div> */}
            </main>

            {/* Session Footer */}
            {/* <footer className={styles.sessionFooter}> */}
            {/* TODO: Add feedback/rating component */}
            {/* </footer> */}
        </div>
    );
}

export default Session;
