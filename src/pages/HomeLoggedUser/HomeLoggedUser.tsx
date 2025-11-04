import { useState, useMemo, useEffect } from 'react';
import { Heart, Sparkles, Flame, Clock, Calendar, Play, ArrowRight } from 'lucide-react';
import { getGoalById } from '../../utils/sessionOptions';
import styles from './HomeLoggedUser.module.scss';
import Navigation from '../../components/Navigation/Navigation';
import { useAuth } from '../../context/AuthContext';
import { setWithExpiry, getWithExpiry } from '../../utils/storage';
import EmailVerificationModal from '../../components/EmailVerificationModal/EmailVerificationModal';
import QuickStartModal from '../../components/QuickStartModal/QuickStartModal';
import StatsCards from '../../components/StatsCards/StatsCards';
import GoalBreakdownChart from '../../components/GoalBreakdownChart/GoalBreakdownChart';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router';

interface SessionResponse {
    id: string;
    goal: string;
    durationMinutes: number;
    voice: string;
    position: string;
    eyes: string;
    ambientSound: string;
    createdAt: string;
    completedAt?: string;
}

interface AnalyticsOverview {
    totalSessions: number;
    totalMinutes: number;
    currentStreak: number;
    longestStreak: number;
    lastSessionDate: string | null;
}

interface GoalBreakdown {
    goalCounts: Record<string, number>;
}

const sessionCountFetchLimit = 6 as const;

export default function HomeLoggedUser() {
    const navigate = useNavigate();

    const { user, sendVerificationEmail } = useAuth();
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showQuickStartModal, setShowQuickStartModal] = useState(false);
    const [recentSessions, setRecentSessions] = useState<SessionResponse[]>([]);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
    const [goalBreakdown, setGoalBreakdown] = useState<GoalBreakdown | null>(null);
    const [loadingAnalytics, setLoadingAnalytics] = useState(true);

    useEffect(() => {
        fetchRecentSessions();
        fetchAnalytics();
        fetchGoalBreakdown();
    }, []);

    useEffect(() => {
        console.log('Analytics state updated:', analytics);
        console.log('Loading analytics:', loadingAnalytics);
    }, [analytics, loadingAnalytics]);

    useEffect(() => {
        console.log('Goal breakdown state updated:', goalBreakdown);
    }, [goalBreakdown]);

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get('/analytics/overview');

            console.log(response)

            console.log('Analytics response:', response.data);
            console.log('Full response:', response);
            console.log('Success field:', response.data.success);
            console.log('Data field:', response.data.data);

            if (response.data.success) {
                setAnalytics(response.data.data);
                console.log('Analytics data set:', response.data.data);
            } else {
                console.error('Analytics request succeeded but success=false:', response.data);
            }
        } catch (error: any) {
            console.error('Error fetching analytics:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
            }
        } finally {
            setLoadingAnalytics(false);
        }
    };

    const fetchGoalBreakdown = async () => {
        try {
            const response = await axios.get('/analytics/by-goal');
            console.log('Goal breakdown response:', response.data);

            if (response.data.success) {
                setGoalBreakdown(response.data.data);
                console.log('Goal breakdown data set:', response.data.data);
            }
        } catch (error) {
            console.error('Error fetching goal breakdown:', error);
        }
    };

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

    const fetchRecentSessions = async () => {
        try {
            const response = await axios.get('/sessions/user?limit=' + sessionCountFetchLimit);
            console.log('Recent sessions response:', response.data);

            if (response.data.success) {
                setRecentSessions(response.data.data);
                console.log('Recent sessions set:', response.data.data);
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
        } finally {
            setLoadingSessions(false);
        }
    };

    const handleSessionClick = (sessionId: string) => {
        navigate(`/session/${sessionId}`);
    };

    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };
    console.log(recentSessions)
    const calendarData = useMemo(() => {
        const today = new Date();
        const weeks = [];
        const sessionDates = new Set(
            recentSessions
                .filter(s => s.createdAt)
                .map(s => new Date(s.createdAt).toISOString().split('T')[0])
        );

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

            <main className={styles.main}>
                {/* Greeting Section */}
                <div className={styles.greeting}>
                    <h1 className={styles.greetingTitle}>
                        {getTimeGreeting()}, {user?.name || 'User'}
                    </h1>
                </div>

                {/* Analytics Stats Cards */}
                {!loadingAnalytics && analytics && (
                    <StatsCards
                        currentStreak={analytics.currentStreak}
                        totalSessions={analytics.totalSessions}
                        totalMinutes={analytics.totalMinutes}
                        longestStreak={analytics.longestStreak}
                    />
                )}

                <div className={styles.layout}>
                    <div className={styles.mainColumn}>
                        <button className={styles.startButton} onClick={() => setShowQuickStartModal(true)}>
                            <Play className={styles.playIcon} />
                            <span className={styles.startButtonText}>Start Session</span>
                        </button>

                        <div className={styles.sessionsSection}>
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>Recent Sessions</h2>
                                <button
                                    className={styles.viewAllButton}
                                    onClick={() => navigate('/history')}
                                >
                                    View All
                                    <ArrowRight size={16} />
                                </button>
                            </div>

                            {loadingSessions ? (
                                <div className={styles.loading}>Loading sessions...</div>
                            ) : recentSessions.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <Sparkles className={styles.emptyEmoji} size={60} />
                                    <p className={styles.emptyText}>Start your first meditation session</p>
                                </div>
                            ) : (
                                <div className={styles.sessionsList}>
                                    {recentSessions.map((session) => {
                                        const goal = getGoalById(session.goal);
                                        const GoalIcon = goal?.icon || Heart;

                                        return (
                                            <div
                                                key={session.id}
                                                className={styles.sessionCard}
                                                onClick={() => handleSessionClick(session.id)}
                                            >
                                                <div className={styles.sessionContent}>
                                                    <div className={styles.sessionLeft}>
                                                        <GoalIcon className={styles.goalIcon} size={24} />
                                                        <div className={styles.sessionInfo}>
                                                            <h3 className={styles.sessionGoal}>
                                                                {goal?.label || session.goal}
                                                            </h3>
                                                            <div className={styles.sessionMeta}>
                                                                <span className={styles.metaItem}>
                                                                    <Clock className={styles.metaIcon} />
                                                                    {session.durationMinutes} min
                                                                </span>
                                                                <span className={styles.metaItem}>
                                                                    {new Date(session.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={styles.sessionRight}>
                                                        {/* Optional: Add a repeat button or feedback here */}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.sidebar}>
                        {/* Goal Breakdown Chart */}
                        {goalBreakdown && (
                            <GoalBreakdownChart goalCounts={goalBreakdown.goalCounts} />
                        )}

                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>
                                <Calendar className={styles.cardTitleIcon} />
                                Your Activity
                            </h3>

                            <div className={styles.calendarWrapper}>
                                <div className={styles.calendarDayLabels}>
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                        <div key={day} className={styles.dayLabel}>{day}</div>
                                    ))}
                                </div>

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
                                                    title={!day.isPast ? 'Future date' : day.hasSession ? `Session on ${day.date.toLocaleDateString()}` : 'No session'}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.calendarLegend}>
                                <div className={styles.legendItem}>
                                    <div className={`${styles.legendBox} ${styles.legendInactive}`}></div>
                                    <span>No session</span>
                                </div>
                                <div className={styles.legendItem}>
                                    <div className={`${styles.legendBox} ${styles.legendActive}`}></div>
                                    <span>Session</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

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