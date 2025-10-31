
import { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import styles from './SessionPlayer.module.scss';
import type { SessionType, SessionEvent, BreathingPattern } from '../../types/session';
import BreathingPulse from '../BreathingPulse/BreathingPulse';
import EventDisplay from '../EventDisplay/EventDisplay';

interface SessionPlayerProps {
    session: SessionType;
}

export default function SessionPlayer({ session }: SessionPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [showBreathingGuide, setShowBreathingGuide] = useState(false);

    const allEvents = session.sessionData.segments.flatMap(seg => seg.events);
    const currentEvent = allEvents[currentEventIndex];
    const currentSegment = session.sessionData.segments.find(seg =>
        seg.events.some(e => e.event_id === currentEvent?.event_id)
    );

    const totalDuration = session.actualDurationSeconds;
    const progress = (currentTime / totalDuration) * 100;

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleMute = () => {
        setIsMuted(!isMuted);
    };

    const handleBreathingToggle = () => {
        setShowBreathingGuide(!showBreathingGuide);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.playerContainer}>
            {/* Main Display Area */}
            <div className={styles.displayArea}>
                {showBreathingGuide && currentSegment?.breathing_pattern ? (
                    <BreathingPulse
                        pattern={currentSegment.breathing_pattern}
                        isActive={isPlaying}
                    />
                ) : (
                    <EventDisplay
                        event={currentEvent}
                        segment={currentSegment}
                    />
                )}
            </div>

            {/* Progress Bar */}
            <div className={styles.progressSection}>
                <div className={styles.progressBar}>
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

            {/* Controls */}
            <div className={styles.controls}>
                <button
                    className={styles.controlButton}
                    onClick={handleMute}
                    title={isMuted ? 'Unmute' : 'Mute'}
                >
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>

                <button
                    className={`${styles.playButton} ${isPlaying ? styles.playing : ''}`}
                    onClick={handlePlayPause}
                >
                    {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                </button>

                <button
                    className={`${styles.controlButton} ${showBreathingGuide ? styles.active : ''}`}
                    onClick={handleBreathingToggle}
                    title="Toggle breathing guide"
                >
                    🫁
                </button>
            </div>

            {/* Info Section */}
            <div className={styles.infoSection}>
                <div className={styles.infoCard}>
                    <h3>Current Instruction</h3>
                    <p className={styles.instruction}>
                        {currentEvent?.user_instruction || 'Begin your meditation...'}
                    </p>
                </div>

                {currentSegment?.breathing_pattern && (
                    <div className={styles.infoCard}>
                        <h3>Breathing Pattern</h3>
                        <div className={styles.breathingInfo}>
                            <div className={styles.breathingItem}>
                                <span className={styles.label}>Inhale</span>
                                <span className={styles.value}>
                                    {currentSegment.breathing_pattern.inhale_seconds}s
                                </span>
                            </div>
                            <div className={styles.breathingItem}>
                                <span className={styles.label}>Hold</span>
                                <span className={styles.value}>
                                    {currentSegment.breathing_pattern.hold_seconds}s
                                </span>
                            </div>
                            <div className={styles.breathingItem}>
                                <span className={styles.label}>Exhale</span>
                                <span className={styles.value}>
                                    {currentSegment.breathing_pattern.exhale_seconds}s
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}