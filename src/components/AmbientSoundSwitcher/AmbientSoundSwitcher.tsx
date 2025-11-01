import styles from './AmbientSoundSwitcher.module.scss';
import { availableThemes } from '../../variables/themes';
import type { AmbientSound } from '../../types/session';
import { X, Volume2, VolumeX, CheckCircle } from 'lucide-react';

interface AmbientSoundSwitcherProps {
    isOpen: boolean;
    onClose: () => void;
    onSoundSelect: (sound: AmbientSound) => void;
    currentSound: AmbientSound;
    volume: number;
    onVolumeChange: (volume: number) => void;
    isAmbientMuted: boolean;
    onAmbientMuteToggle: () => void;
}

export default function AmbientSoundSwitcher({
    isOpen,
    onClose,
    onSoundSelect,
    currentSound,
    volume,
    onVolumeChange,
    isAmbientMuted,
    onAmbientMuteToggle,
}: AmbientSoundSwitcherProps) {
    if (!isOpen) return null;

    const handleSelect = (soundName: AmbientSound) => {
        onSoundSelect(soundName);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onVolumeChange(parseFloat(e.target.value));
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    <X size={24} />
                </button>
                <h3 className={styles.title}>Ambient Sound</h3>

                {/* Volume Control */}
                <div className={styles.volumeSection}>
                    <div className={styles.volumeHeader}>
                        <span className={styles.volumeLabel}>Volume</span>
                        <button
                            className={styles.muteButton}
                            onClick={onAmbientMuteToggle}
                            title={isAmbientMuted ? 'Unmute Ambient' : 'Mute Ambient'}
                        >
                            {isAmbientMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className={styles.volumeSlider}
                        disabled={isAmbientMuted}
                    />
                    <div className={styles.volumeValue}>{Math.round(volume * 100)}%</div>
                </div>

                {/* Sound Selection */}
                <div className={styles.soundSection}>
                    <h4 className={styles.sectionTitle}>Select Sound</h4>
                    <div className={styles.soundGrid}>
                        {availableThemes.map((theme) => (
                            <button
                                key={theme.name}
                                className={`${styles.soundOption} ${currentSound === theme.name ? styles.active : ''}`}
                                onClick={() => handleSelect(theme.name)}
                            >
                                {currentSound === theme.name && (
                                    <CheckCircle size={18} className={styles.checkIcon} />
                                )}
                                <span className={styles.soundLabel}>{theme.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
