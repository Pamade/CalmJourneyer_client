import type { AmbientSound } from "../types/session";

export interface Theme {
    name: AmbientSound;
    label: string;
    gradient: [string, string];
}

export const availableThemes: Theme[] = [
    { name: 'OCEAN_WAVES', label: 'Ocean Waves', gradient: ['#a1c4fd', '#c2e9fb'] },
    { name: 'FOREST_RAIN', label: 'Forest Rain', gradient: ['#d4e2d4', '#a2b2a2'] },
    { name: 'MOUNTAIN_WIND', label: 'Mountain Wind', gradient: ['#f5f7fa', '#c3cfe2'] },
    { name: 'GENTLE_STREAM', label: 'Gentle Stream', gradient: ['#e0c3fc', '#8ec5fc'] },
    { name: 'NIGHT_CRICKETS', label: 'Night Crickets', gradient: ['#f5f7fa', '#c3cfe2'] },
    { name: 'SOFT_THUNDER', label: 'Soft Thunder', gradient: ['#f5b700', '#f25c05'] },
    { name: 'BIRDS_DAWN', label: 'Birds at Dawn', gradient: ['#e0c3fc', '#8ec5fc'] },
    { name: 'CAMPFIRE', label: 'Campfire', gradient: ['#f5b700', '#f25c05'] },
    { name: 'WHITE_NOISE', label: 'White Noise', gradient: ['#e2e2e2', '#c9d6ff'] },
];