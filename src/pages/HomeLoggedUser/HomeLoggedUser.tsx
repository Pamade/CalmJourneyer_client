import React, { useState, useMemo, useEffect } from 'react';
import { Play, Clock, Calendar } from 'lucide-react';
import styles from './HomeLoggedUser.module.scss';
import Navigation from '../../components/Navigation/Navigation';
import { useAuth } from '../../context/AuthContext';
import { setWithExpiry, getWithExpiry } from '../../utils/storage';
import EmailVerificationModal from '../../components/EmailVerificationModal/EmailVerificationModal';
import QuickStartModal from '../../components/QuickStartModal/QuickStartModal';

export default function HomeLoggedUser() {

    const [streak] = useState(5);

    const { user, sendVerificationEmail } = useAuth();
    // const [userName] = useState(user?.name || "");
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showQuickStartModal, setShowQuickStartModal] = useState(false);
    console.log(user)

    useEffect(() => {
        if (user && !user.emailVerified) {
            const verificationPromptShown = getWithExpiry('email_verification_prompt_shown');

            if (!verificationPromptShown || verificationPromptShown.userEmail !== user.email) {
                setWithExpiry('email_verification_prompt_shown', 48, user.email);
                setTimeout(() => {
                    setShowVerifyModal(true);
                }, 5000);
            }
        }
    }, [user]);

    const handleVerifyClick = async () => {
        // Navigate to verification or send email
        setShowVerifyModal(false);
        await sendVerificationEmail(user!.email);
    };

    const handleCancelClick = () => {
        setShowVerifyModal(false);
    };

    const [recentSessions] = useState([
        {
            id: 1,
            date: '2025-10-26',
            time: '20:30',
            duration: 10,
            goal: 'Lepiej spać',
            feedback: 'calm',
            voice: 'Anna'
        },
        {
            id: 2,
            date: '2025-10-25',
            time: '19:15',
            duration: 15,
            goal: 'Zmniejszyć stres',
            feedback: 'calm',
            voice: 'Michał'
        },
        {
            id: 3,
            date: '2025-10-24',
            time: '07:00',
            duration: 5,
            goal: 'Dodać energii',
            feedback: 'okay',
            voice: 'Anna'
        },
        {
            id: 4,
            date: '2025-10-23',
            time: '21:00',
            duration: 10,
            goal: 'Lepiej spać',
            feedback: 'calm',
            voice: 'Anna'
        },
        {
            id: 5,
            date: '2025-10-22',
            time: '08:30',
            duration: 15,
            goal: 'Poprawić koncentrację',
            feedback: 'calm',
            voice: 'Michał'
        }
    ]);

    const quotes = [
        { text: "Spokój umysłu to najcenniejszy skarb.", author: "Budda" },
        { text: "W ciszy odnajdujesz swoją prawdziwą siłę.", author: "Lao Tzu" },
        { text: "Medytacja to podróż od dźwięku do ciszy.", author: "Rumi" },
        { text: "Oddech jest mostem łączącym ciało z umysłem.", author: "Thích Nhất Hạnh" },
        { text: "Spokój zaczyna się od jednego oddechu.", author: "Anonimowy" }
    ];

    const [dailyQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Dzień dobry';
        if (hour < 18) return 'Dzień dobry';
        return 'Dobry wieczór';
    };

    const getFeedbackEmoji = (feedback: string) => {
        switch (feedback) {
            case 'calm': return '😌';
            case 'okay': return '🙂';
            case 'not_great': return '😐';
            default: return '🙂';
        }
    };

    const getGoalEmoji = (goal: string) => {
        switch (goal) {
            case 'Zmniejszyć stres': return '🧘';
            case 'Lepiej spać': return '😴';
            case 'Poprawić koncentrację': return '🎯';
            case 'Dodać energii': return '⚡';
            case 'Po prostu usiąść w ciszy': return '🤫';
            default: return '🧘';
        }
    };

    const calendarData = useMemo(() => {
        const today = new Date();
        const weeks = [];
        const sessionDates = new Set(recentSessions.map(s => s.date));

        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 56);

        while (startDate.getDay() !== 1) {
            startDate.setDate(startDate.getDate() - 1);
        }

        for (let week = 0; week < 8; week++) {
            const weekDays = [];
            for (let day = 0; day < 7; day++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + (week * 7) + day);

                const dateStr = currentDate.toISOString().split('T')[0];
                const isPast = currentDate <= today;
                const hasSession = sessionDates.has(dateStr);

                weekDays.push({
                    date: currentDate,
                    dateStr: dateStr,
                    hasSession: hasSession && isPast,
                    isPast: isPast
                });
            }
            weeks.push(weekDays);
        }

        return weeks;
    }, [recentSessions]);

    return (
        <div className={`${styles.page} extra_padding_for_wrapped_nav`}>
            <Navigation type="dashboard" />
            {/* Header */}
            {/* <header className={styles.header}>
                <div className={styles.headerContainer}>
                    <div className={styles.headerLeft}>
                        <div className={styles.avatar}>
                            {userName[0]}
                        </div>
                        <div className={styles.logo}>
                            CalmJourneyer
                        </div>
                    </div>
                    <button className={styles.menuButton}>
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                        </svg>
                    </button>
                </div>
            </header> */}

            {/* Main Content */}
            <main className={styles.main}>
                {/* Greeting Section */}
                <div className={styles.greeting}>
                    <h1 className={styles.greetingTitle}>
                        {getTimeGreeting()}, {user?.name || 'User'}
                    </h1>
                    <div className={styles.streakBadge}>
                        <span className={styles.streakEmoji}>🔥</span>
                        <span className={styles.streakText}>{streak} dni z rzędu</span>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className={styles.layout}>
                    {/* Left Column - Main Content */}
                    <div className={styles.mainColumn}>
                        {/* Start Session Button */}
                        <button className={styles.startButton} onClick={() => setShowQuickStartModal(true)}>
                            <Play className={styles.playIcon} fill="white" />
                            <span className={styles.startButtonText}>Rozpocznij sesję</span>
                        </button>

                        {/* Recent Sessions */}
                        <div className={styles.sessionsSection}>
                            <h2 className={styles.sectionTitle}>Ostatnie sesje</h2>

                            {recentSessions.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyEmoji}>🧘</div>
                                    <p className={styles.emptyText}>Rozpocznij swoją pierwszą sesję medytacji</p>
                                </div>
                            ) : (
                                <div className={styles.sessionsList}>
                                    {recentSessions.map((session) => (
                                        <div key={session.id} className={styles.sessionCard}>
                                            <div className={styles.sessionContent}>
                                                <div className={styles.sessionLeft}>
                                                    <div className={styles.goalEmoji}>
                                                        {getGoalEmoji(session.goal)}
                                                    </div>
                                                    <div className={styles.sessionInfo}>
                                                        <h3 className={styles.sessionGoal}>
                                                            {session.goal}
                                                        </h3>
                                                        <div className={styles.sessionMeta}>
                                                            <span className={styles.metaItem}>
                                                                <Clock className={styles.metaIcon} />
                                                                {session.duration} min
                                                            </span>
                                                            <span className={styles.metaItem}>
                                                                <Calendar className={styles.metaIcon} />
                                                                {new Date(session.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={styles.sessionRight}>
                                                    <div className={styles.feedbackEmoji}>
                                                        {getFeedbackEmoji(session.feedback)}
                                                    </div>
                                                    <button className={styles.repeatButton}>
                                                        Powtórz
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className={styles.sidebar}>
                        {/* Daily Quote */}
                        <div className={styles.card}>
                            <div className={styles.quoteEmoji}>✨</div>
                            <blockquote className={styles.quoteText}>
                                "{dailyQuote.text}"
                            </blockquote>
                            <p className={styles.quoteAuthor}>— {dailyQuote.author}</p>
                        </div>

                        {/* Session Calendar */}
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>
                                <Calendar className={styles.cardTitleIcon} />
                                Twoja aktywność
                            </h3>

                            <div className={styles.calendarWrapper}>
                                {/* Day labels */}
                                <div className={styles.calendarDayLabels}>
                                    {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'].map(day => (
                                        <div key={day} className={styles.dayLabel}>
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar grid */}
                                <div className={styles.calendarGrid}>
                                    {calendarData.map((week, weekIndex) => (
                                        <div key={weekIndex} className={styles.calendarWeek}>
                                            {week.map((day, dayIndex) => (
                                                <div
                                                    key={dayIndex}
                                                    className={`${styles.calendarDay} ${!day.isPast
                                                        ? styles.dayFuture
                                                        : day.hasSession
                                                            ? styles.dayActive
                                                            : styles.dayInactive
                                                        }`}
                                                    title={day.dateStr}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.calendarLegend}>
                                <div className={styles.legendItem}>
                                    <div className={`${styles.legendBox} ${styles.legendInactive}`}></div>
                                    <span>Brak sesji</span>
                                </div>
                                <div className={styles.legendItem}>
                                    <div className={`${styles.legendBox} ${styles.legendActive}`}></div>
                                    <span>Sesja</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Summary */}
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>Podsumowanie</h3>
                            <div className={styles.stats}>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Wszystkich sesji</span>
                                    <span className={styles.statValue}>{recentSessions.length}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Łącznie minut</span>
                                    <span className={styles.statValue}>
                                        {recentSessions.reduce((sum, s) => sum + s.duration, 0)}
                                    </span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Najdłuższa passa</span>
                                    <span className={`${styles.statValue} ${styles.statStreak}`}>
                                        {streak} 🔥
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modals */}
            <EmailVerificationModal
                isOpen={showVerifyModal}
                onVerify={handleVerifyClick}
                onCancel={handleCancelClick}
            />
            <QuickStartModal
                isOpen={showQuickStartModal}
                onClose={() => setShowQuickStartModal(false)}
            />
        </div>
    );
}