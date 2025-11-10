import { Heart, Brain, Zap, Moon, Sparkles, Armchair, BedSingle, UserSquare, Eye, EyeOff } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface GoalOption {
    id: string;
    label: string;
    description?: string;
    icon: LucideIcon;
    pattern?: string;
}

export interface VoiceOption {
    id: string;
    label: string;
    description: string;
    free: boolean;
    unrealSpeechId: string;
}

export interface PositionOption {
    id: string;
    label: string;
    icon: LucideIcon;
    description: string;
}

export interface EyeOption {
    id: string;
    label: string;
    icon: LucideIcon;
    description: string;
}

export const GOALS: GoalOption[] = [
    {
        id: 'STRESS_RELIEF',
        label: 'Stress Relief',
        description: 'Reduce tension and anxiety',
        icon: Heart,
        pattern: '4-0-6-0'
    },
    {
        id: 'FOCUS',
        label: 'Focus & Clarity',
        description: 'Enhance concentration',
        icon: Brain,
        pattern: '4-4-4-4'
    },
    {
        id: 'ENERGY',
        label: 'Energy Boost',
        description: 'Increase vitality',
        icon: Zap,
        pattern: '4-0-4-0'
    },
    {
        id: 'SLEEP',
        label: 'Better Sleep',
        description: 'Improve sleep quality',
        icon: Moon,
        pattern: '4-7-8-0'
    },
    {
        id: 'SILENCE',
        label: 'Silence',
        description: 'Pure meditation',
        icon: Sparkles,
        pattern: '4-4-4-4'
    }
];

export const VOICES: VoiceOption[] = [
    {
        id: 'LUNA',
        label: 'Luna',
        description: 'Calm and soothing',
        free: true,
        unrealSpeechId: 'Luna'
    },
    {
        id: 'CALEB',
        label: 'Caleb',
        description: 'Deep and grounding',
        free: true,
        unrealSpeechId: 'Caleb'
    },
    {
        id: 'LAUREN',
        label: 'Lauren',
        description: 'Warm and gentle',
        free: false,
        unrealSpeechId: 'Lauren'
    },
    {
        id: 'DANIEL',
        label: 'Daniel',
        description: 'Clear and focused',
        free: false,
        unrealSpeechId: 'Daniel'
    },
    {
        id: "MELODY",
        label: "Melody",
        description: "Soft and melodic",
        free: false,
        unrealSpeechId: "Melody"
    },
    {
        id: "JASPER",
        label: "Jasper",
        description: "Rich and soothing",
        free: false,
        unrealSpeechId: "Jasper"
    }
];

export const POSITIONS: PositionOption[] = [
    {
        id: 'SITTING',
        label: 'Sitting',
        description: 'Cross-legged or chair',
        icon: Armchair
    },
    {
        id: 'LYING',
        label: 'Lying Down',
        description: 'For deep relaxation',
        icon: BedSingle
    },
    {
        id: 'STANDING',
        label: 'Standing',
        description: 'Active meditation',
        icon: UserSquare
    }
];

export const EYES: EyeOption[] = [
    {
        id: 'CLOSED',
        label: 'Eyes Closed',
        description: 'Traditional meditation',
        icon: EyeOff
    },
    {
        id: 'OPEN',
        label: 'Eyes Open',
        description: 'Soft gaze meditation',
        icon: Eye
    }
];

// Helper function to get goal by ID
export const getGoalById = (goalId: string) => {
    return GOALS.find(g => g.id === goalId);
};

// Helper function to get voice by ID
export const getVoiceById = (voiceId: string) => {
    return VOICES.find(v => v.id === voiceId);
};

// Helper function to get position by ID
export const getPositionById = (positionId: string) => {
    return POSITIONS.find(p => p.id === positionId);
};

// Helper function to get eye option by ID
export const getEyeById = (eyeId: string) => {
    return EYES.find(e => e.id === eyeId);
};
