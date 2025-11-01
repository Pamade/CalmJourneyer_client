import styles from './ThemeSwitcher.module.scss';
import { availableThemes, type Theme } from '../../variables/themes';
import type { AmbientSound } from '../../types/session';
import { CheckCircle, X } from 'lucide-react';

interface ThemeSwitcherProps {
    isOpen: boolean;
    onClose: () => void;
    onThemeSelect: (theme: AmbientSound) => void;
    currentTheme: AmbientSound;
}

export default function ThemeSwitcher({ isOpen, onClose, onThemeSelect, currentTheme }: ThemeSwitcherProps) {
    if (!isOpen) return null;

    const handleSelect = (themeName: AmbientSound) => {
        onThemeSelect(themeName);
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}><X size={24} /></button>
                <h3 className={styles.title}>Change Theme</h3>
                <div className={styles.themeGrid}>
                    {availableThemes.map((theme) => (
                        <button
                            key={theme.name}
                            className={`${styles.themePreview} ${currentTheme === theme.name ? styles.active : ''}`}
                            style={{ background: `linear-gradient(135deg, ${theme.gradient[0]}, ${theme.gradient[1]})` }}
                            onClick={() => handleSelect(theme.name)}
                        >
                            {currentTheme === theme.name && <CheckCircle size={24} className={styles.checkIcon} />}
                            <span className={styles.themeLabel}>{theme.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}