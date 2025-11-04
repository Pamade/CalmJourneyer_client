import type { AmbientSound } from '../types/session';

interface ThemeColors {
    background: string;
    accent: string;
    mainText: string;
    additionalAccent: string;
    gradientStart: string;
    gradientEnd: string;
}

const THEME_MAP: Record<string, ThemeColors> = {
    OCEAN_WAVES: {
        background: '#F0F8FF',
        accent: '#6A8EAE',
        mainText: '#2C3E50',
        additionalAccent: '#B0C4DE',
        gradientStart: '#a1c4fd',
        gradientEnd: '#c2e9fb',
    },
    FOREST_RAIN: {
        background: '#F5F5F5',
        accent: '#556B2F',
        mainText: '#2F4F4F',
        additionalAccent: '#90EE90',
        gradientStart: '#d4e2d4',
        gradientEnd: '#a2b2a2',
    },
    MOUNTAIN_WIND: {
        background: '#F5F5F5',
        accent: '#778899',
        mainText: '#2F4F4F',
        additionalAccent: '#B0C4DE',
        gradientStart: '#f5f7fa',
        gradientEnd: '#c3cfe2',
    },
    GENTLE_STREAM: {
        background: '#F0FFFF',
        accent: '#5F9EA0',
        mainText: '#4682B4',
        additionalAccent: '#87CEEB',
        gradientStart: '#a1c4fd',
        gradientEnd: '#8ec5fc',
    },
    NIGHT_CRICKETS: {
        background: '#3A3A3C',
        accent: '#9370DB',
        mainText: '#E8E8E8',
        additionalAccent: '#BA55D3',
        gradientStart: '#434343',
        gradientEnd: '#c3cfe2',
    },
    SOFT_THUNDER: {
        background: '#4A4A4A',
        accent: '#FF6347',
        mainText: '#F5F5F5',
        additionalAccent: '#FFA07A',
        gradientStart: '#ee9617',
        gradientEnd: '#f25c05',
    },
    BIRDS_DAWN: {
        background: '#FFF8E7',
        accent: '#FFD700',
        mainText: '#8B4513',
        additionalAccent: '#FFDAB9',
        gradientStart: '#a1c4fd',
        gradientEnd: '#8ec5fc',
    },
    CAMPFIRE: {
        background: '#FFF8E1',
        accent: '#D2691E',
        mainText: '#8B4513',
        additionalAccent: '#FFE4B5',
        gradientStart: '#ee9617',
        gradientEnd: '#f25c05',
    },
    WHITE_NOISE: {
        background: '#F2F2F2',
        accent: '#808080',
        mainText: '#333333',
        additionalAccent: '#C0C0C0',
        gradientStart: '#f5f7fa',
        gradientEnd: '#c3cfe2',
    },
};

export const getAmbientSoundTheme = (ambientSound: string): ThemeColors => {
    return THEME_MAP[ambientSound] || THEME_MAP.OCEAN_WAVES;
};
