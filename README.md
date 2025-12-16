# CalmJourneyer - AI Meditation App

**Live:** [calmjourneyer.com](https://calmjourneyer.com)

A full-stack web application that generates personalized meditation sessions using gemini API

---

## Features

- **AI-Generated Sessions**: Every meditation session is uniquely created in real-time using gemini API
- **Deep Personalization**: Customize voice, ambient sounds, meditation position, breathing pace, duration (5-30 min), and session goals
- **Progress Tracking**: Streak analytics, mood tracking, and session history with interactive charts
- **Subscription Tiers**: Free plan with 3 sessions, Standard (15 min), and Pro (30 min) powered by Stripe


---

## Tech Stack

### Core
- **React 19**
- **TypeScript**
- **SCSS Modules**

### Key Libraries
- **React Router 7** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **Recharts** - Analytics and progress visualization
- **Lucide React** - Icon system
- **Sonner** - Toast notifications

---

### Directory Structure

```
src/
├── pages/              # Route components 
├── components/         # Reusable UI 
├── content/            # Article content management 
├── context/            # Global state providers 
├── utils/              # API integration and session configuration
├── types/              # TypeScript interfaces
└── variables/          # SCSS theme and design system

public/
├── sitemap.xml         # SEO sitemap
├── sound_themes/       # Ambient sound files
└── robots.txt
```

### Core Workflows

**AI Session Generation Pipeline:**
1. User selects preferences → Session customization (goal, duration, voice, position, breathing, ambient)
2. Request sent to backend → AI generates unique meditation script
3. Text-to-speech conversion → Audio playback with synchronized controls
4. Session tracking → Progress saved to user analytics

**User Authentication & Subscriptions:**
- JWT-based authentication with protected routes
- Stripe integration for subscription management
- Tiered access control (Free/Standard/Pro)

---

## Backend Integration

This frontend communicates with a Java Spring Boot backend for:
- AI meditation content generation (Gemini API integration)
- User authentication and authorization
- Subscription and payment processing
- Session history and analytics storage
