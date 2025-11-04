export type Goal = "STRESS_RELIEF" | "FOCUS" | "ENERGY" | "SLEEP" | "SILENCE";
export type Eyes = "CLOSED" | "OPEN";
export type Position = "SITTING" | "LYING" | "STANDING";
export type Voice = "LUNA" | "LAUREN" | "CALEB" | "DANIEL";

export type AmbientSound =
    | "NONE"
    | "OCEAN_WAVES"
    | "FOREST_RAIN"
    | "MOUNTAIN_WIND"
    | "GENTLE_STREAM"
    | "NIGHT_CRICKETS"
    | "SOFT_THUNDER"
    | "BIRDS_DAWN"
    | "CAMPFIRE"
    | "WIND_CHIMES"
    | "WHITE_NOISE";

type EventType = "narration" | "silence"

export interface VoiceOption {
    id: Voice;
    label: string;
    description: string;
    unrealSpeechId: string;
}

export interface SessionData {
    goal: Goal;
    eyes: Eyes;
    position: Position;
    duration: number;
    voice: Voice;
}

export interface OnboardingData extends SessionData {
    name: string;
}

export interface GenerateSessionResponse {
    success: boolean;
    message: string;
    data: SessionType;
    timestamp: string; // ISO string
}


export interface SessionType {
    id: string;
    goal: Goal;
    targetDurationMinutes: number;
    actualDurationSeconds: number;
    voice: Voice;
    position: Position;
    eyes: Eyes;
    ambientSound: AmbientSound;
    createdAt: string;  // ISO string
    expiresAt: string;  // ISO string
    sessionData: SessionContent;
}

export interface SessionContent {
    segments: SessionSegment[];
    tts_audio_map: Record<string, string> | null;
    ambient_sound: AmbientSound;
}

export interface SessionSegment {
    title: string;
    events: SessionEvent[];
    segment_id: string;
    breathing_pattern: BreathingPattern;
}

export interface SessionEvent {
    text: string;
    ssml: string;
    audioUrl: string;
    event_id: string;
    event_type: EventType; // can extend later
    duration_seconds: number;
    user_instruction: string;
    start_time_seconds: number | null;
}

export interface BreathingPattern {
    inhale_seconds: number;
    hold_seconds: number;
    exhale_seconds: number;
    pause_seconds: number;
    total_cycles: number;
}