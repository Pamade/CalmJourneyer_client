import { useEffect, useState } from 'react';
import styles from './BreathingPulse.module.scss';
import type { BreathingPattern } from '../../types/session';

interface BreathingPulseProps {
    pattern: BreathingPattern;
    isActive: boolean;
}

export default function BreathingPulse({ pattern, isActive }: BreathingPulseProps) {
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
    const [phaseProgress, setPhaseProgress] = useState(0);

    useEffect(() => {
        if (!isActive) return;

        const totalCycleTime =
            (pattern.inhale_seconds +
                pattern.hold_seconds +
                pattern.exhale_seconds +
                pattern.pause_seconds) * 1000;

        const interval = setInterval(() => {
            setPhaseProgress(prev => {
                const next = prev + 50;
                if (next >= totalCycleTime) {
                    return 0;
                }
                return next;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [isActive, pattern]);

    useEffect(() => {
        const inhaleMs = pattern.inhale_seconds * 1000;
        const holdMs = pattern.hold_seconds * 1000;
        const exhaleMs = pattern.exhale_seconds * 1000;

        if (phaseProgress < inhaleMs) {
            setPhase('inhale');
        } else if (phaseProgress < inhaleMs + holdMs) {
            setPhase('hold');
        } else if (phaseProgress < inhaleMs + holdMs + exhaleMs) {
            setPhase('exhale');
        } else {
            setPhase('pause');
        }
    }, [phaseProgress, pattern]);

    const getScale = () => {
        const inhaleMs = pattern.inhale_seconds * 1000;
        const holdMs = pattern.hold_seconds * 1000;
        const exhaleMs = pattern.exhale_seconds * 1000;

        if (phase === 'inhale') {
            const progress = phaseProgress / inhaleMs;
            return 1 + progress * 0.5;
        } else if (phase === 'hold') {
            return 1.5;
        } else if (phase === 'exhale') {
            const progress = (phaseProgress - inhaleMs - holdMs) / exhaleMs;
            return 1.5 - progress * 0.5;
        }
        return 1;
    };

    const phaseLabels = {
        inhale: 'Breathe In',
        hold: 'Hold',
        exhale: 'Breathe Out',
        pause: 'Rest',
    };

    return (
        <div className={styles.breathingContainer}>
            <div
                className={styles.breathingCircle}
                style={{ transform: `scale(${getScale()})` }}
            />
            <div className={styles.phaseLabel}>
                {phaseLabels[phase]}
            </div>
        </div>
    );
}