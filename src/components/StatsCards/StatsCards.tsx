import { Flame, Calendar, Clock, TrendingUp } from 'lucide-react';
import styles from './StatsCards.module.scss';

interface StatsCardsProps {
    currentStreak: number;
    totalSessions: number;
    totalMinutes: number;
    longestStreak: number;
}

const StatsCards = ({ currentStreak, totalSessions, totalMinutes, longestStreak }: StatsCardsProps) => {
    const stats = [
        {
            icon: Flame,
            label: 'Current Streak',
            value: currentStreak,
            suffix: currentStreak === 1 ? 'day' : 'days',
            color: '#FF6B6B'
        },
        {
            icon: Calendar,
            label: 'Total Sessions',
            value: totalSessions,
            suffix: totalSessions === 1 ? 'session' : 'sessions',
            color: '#4ECDC4'
        },
        {
            icon: Clock,
            label: 'Total Minutes',
            value: totalMinutes,
            suffix: totalMinutes === 1 ? 'minute' : 'minutes',
            color: '#95E1D3'
        },
        {
            icon: TrendingUp,
            label: 'Longest Streak',
            value: longestStreak,
            suffix: longestStreak === 1 ? 'day' : 'days',
            color: '#F38181'
        }
    ];

    return (
        <div className={styles.statsGrid}>
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div key={index} className={styles.statCard}>
                        <div className={styles.iconWrapper} style={{ backgroundColor: `${stat.color}15` }}>
                            <Icon size={32} style={{ color: stat.color }} />
                        </div>
                        <div className={styles.statContent}>
                            <p className={styles.statLabel}>{stat.label}</p>
                            <p className={styles.statValue}>
                                {stat.value} <span className={styles.statSuffix}>{stat.suffix}</span>
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StatsCards;
