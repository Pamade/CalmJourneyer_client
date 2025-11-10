export type Goal = "STRESS_RELIEF" | "FOCUS" | "ENERGY" | "SLEEP" | "SILENCE";
export type Eyes = "CLOSED" | "OPEN";
export type Position = "SITTING" | "LYING" | "STANDING";
export type Voice = "LUNA" | "LAUREN" | "CALEB" | "DANIEL" | "MELODY" | "JASPER";

export type AmbientSound =
    | "OCEAN_WAVES"
    | "FOREST_RAIN"
    | "MOUNTAIN_WIND"
    | "GENTLE_STREAM"
    | "NIGHT_CRICKETS"
    | "SOFT_THUNDER"
    | "BIRDS_DAWN"
    | "CAMPFIRE"
    | "WHITE_NOISE";

// FIX: Add "breathing" as event type
export type EventType = "narration" | "silence" | "breathing";

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
    speed?: string; // Speech speed from -0.5 to 1.5
}

export interface OnboardingData extends SessionData {
    name: string;
}

export interface GenerateSessionResponse {
    success: boolean;
    message: string;
    data: SessionType;
    timestamp: string;
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
    createdAt: string;
    expiresAt: string;
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
}

// FIX: SessionEvent is now a union type to handle different event types
export type SessionEvent = NarrationEvent | SilenceEvent | BreathingEvent;

// Base properties shared by all events
interface BaseEvent {
    event_id: string;
    duration_seconds: number;
    user_instruction: string;
}

// Narration event (has audio)
export interface NarrationEvent extends BaseEvent {
    event_type: "narration";
    text: string;
    ssml: string | null;
    audioUrl: string;
}

// Silence event (no audio, just pause)
export interface SilenceEvent extends BaseEvent {
    event_type: "silence";
    text: null;
    ssml: null;
    audioUrl: null;
}

// Breathing event (shows breathing circle)
export interface BreathingEvent extends BaseEvent {
    event_type: "breathing";
    text: string | null; // Optional intro text like "Follow this rhythm"
    ssml: string | null;
    audioUrl: string | null; // Could have intro audio
    breathing_pattern: BreathingPattern;
}

export interface BreathingPattern {
    inhale_seconds: number;
    hold_seconds: number;
    exhale_seconds: number;
    pause_seconds: number;
    total_cycles: number;
}