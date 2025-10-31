import { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import styles from './SessionPlayer.module.scss';
import type { SessionType, SessionEvent, AmbientSound, SessionSegment, BreathingPattern } from '../../types/session';
import BreathingPulse from '../BreathingPulse/BreathingPulse';
import EventDisplay from '../EventDisplay/EventDisplay';

interface SessionPlayerProps {
    session: SessionType;
}

// Define a unified type for our timeline
type TimelineItem =
    | { type: 'narration'; data: SessionEvent; startTime: number; duration: number; segment: SessionSegment }
    | { type: 'breathing'; data: BreathingPattern; startTime: number; duration: number; segment: SessionSegment };


export default function SessionPlayer({ session }: SessionPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);

    const narrationAudioRef = useRef<HTMLAudioElement>(null);
    const ambientAudioRef = useRef<HTMLAudioElement>(null);
    const timerRef = useRef<number | null>(null);

    // 1. Create a unified timeline including both narration and breathing sections
    const timeline = useMemo(() => {
        const items: TimelineItem[] = [];
        let cumulativeTime = 0;

        session.sessionData.segments.forEach(segment => {
            // Add narration events from the segment
            segment.events.forEach(event => {
                items.push({
                    type: 'narration',
                    data: event,
                    startTime: cumulativeTime,
                    duration: event.duration_seconds,
                    segment,
                });
                cumulativeTime += event.duration_seconds;
            });

            // Add breathing exercise from the segment if it exists
            const bp = segment.breathing_pattern;
            if (bp && bp.total_cycles > 0) {
                const cycleDuration = bp.inhale_seconds + bp.hold_seconds + bp.exhale_seconds + bp.pause_seconds;
                const breathingDuration = cycleDuration * bp.total_cycles;
                if (breathingDuration > 0) {
                    items.push({
                        type: 'breathing',
                        data: bp,
                        startTime: cumulativeTime,
                        duration: breathingDuration,
                        segment,
                    });
                    cumulativeTime += breathingDuration;
                }
            }
        });
        return items;
    }, [session.sessionData.segments]);

    const totalDuration = session.actualDurationSeconds;
    const currentItem = timeline[currentItemIndex];
    const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

    // 2. Main effect to handle playback logic based on the current timeline item
    useEffect(() => {
        // Clear any existing timers when state changes
        if (timerRef.current) clearInterval(timerRef.current);

        if (!isPlaying || !currentItem) {
            narrationAudioRef.current?.pause();
            return;
        }

        if (currentItem.type === 'narration') {
            const audio = narrationAudioRef.current;
            if (audio) {
                if (audio.src !== currentItem.data.audioUrl) {
                    audio.src = currentItem.data.audioUrl;
                }
                // Sync audio time with the overall session time
                const timeIntoEvent = currentTime - currentItem.startTime;
                audio.currentTime = timeIntoEvent;
                audio.play().catch(e => console.error("Narration play failed:", e));
            }
        } else if (currentItem.type === 'breathing') {
            narrationAudioRef.current?.pause();
            // Use a timer for the silent breathing part
            timerRef.current = setInterval(() => {
                setCurrentTime(prevTime => {
                    const newTime = prevTime + 1;
                    if (newTime >= currentItem.startTime + currentItem.duration) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        // Advance to the next item
                        if (currentItemIndex < timeline.length - 1) {
                            setCurrentItemIndex(currentItemIndex + 1);
                        } else {
                            setIsPlaying(false); // End of session
                        }
                        return currentItem.startTime + currentItem.duration;
                    }
                    return newTime;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };

    }, [isPlaying, currentItemIndex, timeline]);


    // 3. Audio event listeners for narration tracks
    useEffect(() => {
        const audio = narrationAudioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            if (currentItem?.type === 'narration' && !audio.paused) {
                setCurrentTime(currentItem.startTime + audio.currentTime);
            }
        };

        const handleAudioEnded = () => {
            if (currentItem?.type === 'narration') {
                if (currentItemIndex < timeline.length - 1) {
                    setCurrentItemIndex(currentItemIndex + 1);
                } else {
                    setIsPlaying(false);
                }
            }
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleAudioEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleAudioEnded);
        };
    }, [currentItemIndex, timeline, currentItem]);


    // 4. Control ambient sound playback
    useEffect(() => {
        const ambientAudio = ambientAudioRef.current;
        if (!ambientAudio) return;

        if (isPlaying && session.ambientSound !== 'NONE') {
            ambientAudio.play().catch(e => console.error("Ambient play failed:", e));
        } else {
            ambientAudio.pause();
        }
    }, [isPlaying, session.ambientSound]);

    // 5. Handle muting
    useEffect(() => {
        if (narrationAudioRef.current) narrationAudioRef.current.muted = isMuted;
        if (ambientAudioRef.current) ambientAudioRef.current.muted = isMuted;
    }, [isMuted]);


    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleMute = () => {
        setIsMuted(!isMuted);
    };


    // 6. Handle seeking on the progress bar
    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newTime = Math.floor((clickX / progressBar.offsetWidth) * totalDuration);

        const targetItemIndex = timeline.findIndex(item => newTime >= item.startTime && newTime < item.startTime + item.duration);

        if (targetItemIndex !== -1) {
            setCurrentTime(newTime);
            setCurrentItemIndex(targetItemIndex);
        }
        narrationAudioRef.current?.pause();
        setIsPlaying(false);
        setTimeout(() => {
            narrationAudioRef.current?.play();
            setIsPlaying(true);
        }, 100);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getAmbientSoundUrl = (sound: AmbientSound) => {
        if (sound === 'NONE') return '';
        return `/sounds/ambient/${sound.toLowerCase()}.mp3`;
    };

    // Determine what to display - now solely based on currentItem type
    const displayBreathingPulse = currentItem?.type === 'breathing' && currentItem.data.total_cycles > 0;
    const timeIntoSegment = currentItem ? currentTime - currentItem.startTime : 0;

    // Logic for instruction text
    const instructionText = useMemo(() => {
        if (currentItem?.type === 'narration') {
            return currentItem.data.user_instruction || 'Listen to the meditation.';
        } else if (currentItem?.type === 'breathing') {
            const bp = currentItem.data;
            let pattern = [];
            if (bp.inhale_seconds > 0) pattern.push(`Inhale: ${bp.inhale_seconds}s`);
            if (bp.hold_seconds > 0) pattern.push(`Hold: ${bp.hold_seconds}s`);
            if (bp.exhale_seconds > 0) pattern.push(`Exhale: ${bp.exhale_seconds}s`);
            if (bp.pause_seconds > 0) pattern.push(`Pause: ${bp.pause_seconds}s`);
            return pattern.length > 0 ? `Breathing Pattern: ${pattern.join(', ')}` : 'Focus on your breath.';
        }
        return 'Begin your meditation...';
    }, [currentItem]);

    return (
        <div className={styles.playerContainer}>
            <audio ref={narrationAudioRef} />
            <audio ref={ambientAudioRef} src={getAmbientSoundUrl(session.ambientSound)} loop />

            <div className={styles.displayArea}>
                {displayBreathingPulse ? (
                    <BreathingPulse
                        pattern={currentItem.data as BreathingPattern}
                        isActive={isPlaying}
                        timeIntoSegment={timeIntoSegment}
                    />
                ) : (
                    <EventDisplay
                        event={currentItem?.type === 'narration' ? currentItem.data : undefined}
                        segment={currentItem?.segment}
                    />
                )}
            </div>

            <div className={styles.progressSection}>
                <div className={styles.progressBar} onClick={handleSeek}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className={styles.timeDisplay}>
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(totalDuration)}</span>
                </div>
            </div>

            <div className={styles.controls}>
                <button
                    className={styles.controlButton}
                    onClick={handleMute}
                    title={isMuted ? 'Unmute' : 'Mute'}
                >
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>

                <button
                    className={styles.playButton}
                    onClick={handlePlayPause}
                >
                    {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                </button>
            </div>

            <div className={styles.infoSection}>
                <div className={styles.instruction}>
                    <h3>Current Instruction</h3>
                    <p>{instructionText}</p>
                </div>
            </div>
        </div>
    );
}