import { useEffect, useState, useMemo } from 'react';
import styles from './BreathingPulse.module.scss';
import type { BreathingPattern } from '../../types/session';

interface BreathingPulseProps {
    pattern: BreathingPattern;
    isActive: boolean;
    timeIntoSegment: number;
}

export default function BreathingPulse({ pattern, isActive, timeIntoSegment }: BreathingPulseProps) {
    const { inhale_seconds, hold_seconds, exhale_seconds, pause_seconds } = pattern;
    const totalCycleDuration = inhale_seconds + hold_seconds + exhale_seconds + pause_seconds;

    const phase = useMemo(() => {
        if (!isActive) {
            return 'idle';
        }
        if (totalCycleDuration === 0) {
            return 'idle';
        }

        const timeInCurrentCycle = timeIntoSegment % totalCycleDuration;

        let cumulativeTime = 0;
        if (inhale_seconds > 0 && timeInCurrentCycle < (cumulativeTime += inhale_seconds)) {
            return 'inhale';
        }
        if (hold_seconds > 0 && timeInCurrentCycle < (cumulativeTime += hold_seconds)) {
            return 'hold';
        }
        if (exhale_seconds > 0 && timeInCurrentCycle < (cumulativeTime += exhale_seconds)) {
            return 'exhale';
        }
        return 'pause';
    }, [isActive, timeIntoSegment, pattern, totalCycleDuration]);

    const [phaseState, setPhaseState] = useState<'inhale' | 'hold' | 'exhale' | 'pause' | 'idle'>('inhale');

    useEffect(() => {
        setPhaseState(phase);
    }, [phase]);

    const phaseLabels = {
        inhale: 'Breathe In',
        hold: 'Hold',
        exhale: 'Breathe Out',
        pause: 'Rest',
        idle: 'Paused',
    };

    const animationStyle = {
        '--inhale-duration': `${inhale_seconds}s`,
        '--exhale-duration': `${exhale_seconds}s`,
    } as React.CSSProperties;

    return (
        <div className={styles.breathingContainer}>
            <div
                className={`${styles.breathingCircle} ${styles[phase]}`}
                style={animationStyle}
            >
                <span className={styles.phaseLabel}>
                    {phaseLabels[phase]}
                </span>
            </div>
        </div>
    );
}