import { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, Volume2, VolumeX, Rewind, FastForward, Palette, Mic, MicOff, AudioLines } from 'lucide-react';
import styles from './SessionPlayer.module.scss';
import type {
    SessionType,
    SessionEvent,
    AmbientSound,
    SessionSegment,
    BreathingPattern,
    BreathingEvent,
    NarrationEvent,
    SilenceEvent
} from '../../types/session';
import BreathingPulse from '../BreathingPulse/BreathingPulse';
import EventDisplay from '../EventDisplay/EventDisplay';
import SessionTimeline from '../SessionTimeline/SessionTimeline';

interface SessionPlayerProps {
    session: SessionType;
    onSessionComplete: () => void;
    onOpenThemeSwitcher: () => void;
    onOpenAmbientSwitcher: () => void;
    ambientVolume: number;
    isAmbientMuted: boolean;
    currentAmbientSound: AmbientSound;
    isNarrationMuted: boolean;
    onNarrationMuteToggle: () => void;
    onAmbientMuteToggle: () => void;
}

// Simplified timeline - just events with their metadata
type TimelineItem = {
    event: SessionEvent;
    startTime: number;
    segment: SessionSegment;
};

export default function SessionPlayer({
    session,
    onSessionComplete,
    onOpenThemeSwitcher,
    onOpenAmbientSwitcher,
    ambientVolume,
    isAmbientMuted,
    currentAmbientSound,
    isNarrationMuted,
    onNarrationMuteToggle,
    onAmbientMuteToggle
}: SessionPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);

    const narrationAudioRef = useRef<HTMLAudioElement>(null);
    const ambientAudioRef = useRef<HTMLAudioElement>(null);
    const timerRef = useRef<number | null>(null);

    // Build timeline from all events in all segments
    const timeline = useMemo(() => {
        const items: TimelineItem[] = [];
        let cumulativeTime = 0;

        session.sessionData.segments.forEach(segment => {
            segment.events.forEach(event => {
                items.push({
                    event,
                    startTime: cumulativeTime,
                    segment,
                });
                cumulativeTime += event.duration_seconds;
            });
        });

        return items;
    }, [session.sessionData.segments]);

    const totalDuration = session.actualDurationSeconds;
    const currentItem = timeline[currentItemIndex];
    const currentEvent = currentItem?.event;
    const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

    // Main playback effect
    useEffect(() => {
        if (timerRef.current) clearInterval(timerRef.current);

        if (!isPlaying || !currentEvent) {
            narrationAudioRef.current?.pause();
            return;
        }

        const audio = narrationAudioRef.current;

        // Handle different event types
        if (currentEvent.event_type === 'narration' && currentEvent.audioUrl) {
            // Narration with audio
            if (audio && audio.src !== currentEvent.audioUrl) {
                audio.src = currentEvent.audioUrl;
            }
            const timeIntoEvent = currentTime - currentItem.startTime;
            if (audio) {
                audio.currentTime = timeIntoEvent;
                audio.play().catch(e => console.error("Narration play failed:", e));
            }
        } else {
            // Silence or breathing - use timer
            narrationAudioRef.current?.pause();

            timerRef.current = setInterval(() => {
                setCurrentTime(prevTime => {
                    const newTime = prevTime + 1;
                    const eventEndTime = currentItem.startTime + currentEvent.duration_seconds;

                    if (newTime >= eventEndTime) {
                        if (timerRef.current) clearInterval(timerRef.current);

                        // Move to next item
                        if (currentItemIndex < timeline.length - 1) {
                            setCurrentItemIndex(currentItemIndex + 1);
                        } else {
                            setIsPlaying(false);
                        }
                        return eventEndTime;
                    }
                    return newTime;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, currentItemIndex, timeline, currentEvent, currentItem, currentTime]);

    // Audio event listeners for narration
    useEffect(() => {
        const audio = narrationAudioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            if (currentEvent?.event_type === 'narration' && currentEvent.audioUrl && !audio.paused) {
                setCurrentTime(currentItem.startTime + audio.currentTime);
            }
        };

        const handleAudioEnded = () => {
            if (currentEvent?.event_type === 'narration' && currentEvent.audioUrl) {
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
    }, [currentItemIndex, timeline, currentEvent, currentItem]);

    // Ambient sound control
    useEffect(() => {
        const ambientAudio = ambientAudioRef.current;
        if (!ambientAudio) return;

        if (isPlaying) {
            ambientAudio.play().catch(e => console.error("Ambient play failed:", e));
        } else {
            ambientAudio.pause();
        }
    }, [isPlaying, currentAmbientSound]);

    // Narration muting
    useEffect(() => {
        if (narrationAudioRef.current) {
            narrationAudioRef.current.muted = isNarrationMuted;
        }
    }, [isNarrationMuted]);

    // Ambient volume and muting
    useEffect(() => {
        const ambientAudio = ambientAudioRef.current;
        if (ambientAudio) {
            ambientAudio.volume = ambientVolume;
            ambientAudio.muted = isAmbientMuted;
        }
    }, [ambientVolume, isAmbientMuted]);

    // Update ambient source
    useEffect(() => {
        const ambientAudio = ambientAudioRef.current;
        if (!ambientAudio) return;

        const newSrc = getAmbientSoundUrl(currentAmbientSound);
        if (ambientAudio.src !== newSrc) {
            ambientAudio.src = newSrc;
            if (isPlaying) {
                ambientAudio.play().catch(e => console.error("Ambient play after source change failed:", e));
            }
        }
    }, [currentAmbientSound, isPlaying]);

    // Session completion check
    useEffect(() => {
        if (currentTime >= totalDuration && totalDuration > 0) {
            setIsPlaying(false);
            onSessionComplete();
        }
    }, [currentTime, totalDuration, onSessionComplete]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleSkip = (seconds: number) => {
        const newTime = Math.max(0, Math.min(totalDuration, currentTime + seconds));
        handleSeek(null, newTime);
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement> | null, directTime?: number) => {
        const narrationAudio = narrationAudioRef.current;
        if (!narrationAudio) return;

        narrationAudio.pause();

        let newTime: number;
        if (directTime !== undefined) {
            newTime = directTime;
        } else if (e) {
            const progressBar = e.currentTarget;
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            newTime = Math.floor((clickX / progressBar.offsetWidth) * totalDuration);
        } else {
            return;
        }

        const targetItemIndex = timeline.findIndex(
            item => newTime >= item.startTime && newTime < item.startTime + item.event.duration_seconds
        );

        if (targetItemIndex !== -1) {
            setCurrentTime(newTime);
            setCurrentItemIndex(targetItemIndex);
        }

        // Brief pause before resuming
        setIsPlaying(false);
        setTimeout(() => {
            setIsPlaying(true);
        }, 100);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getAmbientSoundUrl = (sound: AmbientSound) => {
        if (!sound) return '';
        return `/sound_themes/${sound}.wav`;
    };

    // Determine what to display based on event type
    const displayBreathingPulse = currentEvent?.event_type === 'breathing';
    const timeIntoEvent = currentItem ? currentTime - currentItem.startTime : 0;

    // Type guard helpers
    const isBreathingEvent = (event: SessionEvent): event is BreathingEvent => {
        return event.event_type === 'breathing';
    };

    const isNarrationEvent = (event: SessionEvent): event is NarrationEvent => {
        return event.event_type === 'narration';
    };

    // Instruction text based on current event
    const instructionText = useMemo(() => {
        if (!currentEvent) return 'Begin your meditation...';

        if (isBreathingEvent(currentEvent)) {
            const bp = currentEvent.breathing_pattern;
            let pattern = [];
            if (bp.inhale_seconds > 0) pattern.push(`Inhale: ${bp.inhale_seconds}s`);
            if (bp.hold_seconds > 0) pattern.push(`Hold: ${bp.hold_seconds}s`);
            if (bp.exhale_seconds > 0) pattern.push(`Exhale: ${bp.exhale_seconds}s`);
            if (bp.pause_seconds > 0) pattern.push(`Pause: ${bp.pause_seconds}s`);
            return pattern.length > 0 ? pattern.join(' • ') : 'Follow your breath';
        }

        return currentEvent.user_instruction || 'Listen to the guidance';
    }, [currentEvent]);

    return (
        <div className={styles.playerWrapper}>
            <div className={styles.playerContainer}>
                <audio ref={narrationAudioRef} />
                <audio ref={ambientAudioRef} src={getAmbientSoundUrl(currentAmbientSound)} loop />

                <div className={styles.displayArea}>
                    {displayBreathingPulse && isBreathingEvent(currentEvent) ? (
                        <BreathingPulse
                            pattern={currentEvent.breathing_pattern}
                            isActive={isPlaying}
                            timeIntoSegment={timeIntoEvent}
                        />
                    ) : (
                        <EventDisplay
                            event={isNarrationEvent(currentEvent) ? currentEvent : undefined}
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
                        className={`${styles.controlButton} ${styles.skipButton}`}
                        onClick={() => handleSkip(-10)}
                        title="Rewind 10s"
                    >
                        <Rewind size={22} />
                    </button>
                    <button
                        className={styles.playButton}
                        onClick={handlePlayPause}
                    >
                        {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                    </button>
                    <button
                        className={`${styles.controlButton} ${styles.skipButton}`}
                        onClick={() => handleSkip(15)}
                        title="Forward 15s"
                    >
                        <FastForward size={22} />
                    </button>
                </div>

                <div className={styles.secondaryControls}>
                    <button
                        className={styles.controlButton}
                        onClick={onNarrationMuteToggle}
                        title={isNarrationMuted ? 'Unmute Narrator' : 'Mute Narrator'}
                    >
                        {isNarrationMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>
                    <button
                        className={styles.controlButton}
                        onClick={onAmbientMuteToggle}
                        title={isAmbientMuted ? 'Unmute Ambient' : 'Mute Ambient'}
                    >
                        {isAmbientMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                    <button
                        className={styles.controlButton}
                        onClick={onOpenAmbientSwitcher}
                        title="Ambient Sound"
                    >
                        <AudioLines size={24} />
                    </button>
                    <button
                        className={styles.controlButton}
                        onClick={onOpenThemeSwitcher}
                        title="Change Theme"
                    >
                        <Palette size={24} />
                    </button>
                </div>

                <div className={styles.infoSection}>
                    <div className={styles.instruction}>
                        <h3>Current Instruction</h3>
                        <p>{instructionText}</p>
                    </div>
                </div>
            </div>

            <SessionTimeline
                segments={session.sessionData.segments}
                currentSegmentId={currentItem?.segment.segment_id}
            />
        </div>
    );
}