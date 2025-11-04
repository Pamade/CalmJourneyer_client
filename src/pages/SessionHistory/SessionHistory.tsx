import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Filter, Clock, Calendar, ChevronDown } from 'lucide-react';
import { GOALS, POSITIONS, EYES, getGoalById, getVoiceById, getPositionById, getEyeById } from '../../utils/sessionOptions';
import Navigation from '../../components/Navigation/Navigation';
import axios from '../../utils/axios';
import styles from './SessionHistory.module.scss';

interface SessionResponse {
    id: string;
    goal: string;
    durationMinutes: number;
    actualDurationSeconds: number;
    voice: string;
    position: string;
    eyes: string;
    ambientSound: string;
    createdAt: string;
    completedAt?: string;
}

const SessionHistory = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState<SessionResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGoal, setSelectedGoal] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedPosition, setSelectedPosition] = useState<string>('');
    const [selectedEyes, setSelectedEyes] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const pageSize = 20;

    useEffect(() => {
        fetchSessions();
    }, [selectedGoal, selectedStatus, selectedPosition, selectedEyes, currentPage]);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedGoal) params.append('goal', selectedGoal);
            if (selectedStatus === 'completed') params.append('completed', 'true');
            if (selectedStatus === 'incomplete') params.append('completed', 'false');
            if (selectedPosition) params.append('position', selectedPosition);
            if (selectedEyes) params.append('eyes', selectedEyes);
            params.append('page', currentPage.toString());
            params.append('pageSize', pageSize.toString());

            const response = await axios.get(
                `/sessions/user/history?${params.toString()}`
            );

            if (response.data.success) {
                setSessions(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching session history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSessionClick = (sessionId: string) => {
        navigate(`/session/${sessionId}`);
    };

    const handleFilterReset = () => {
        setSelectedGoal('');
        setSelectedStatus('');
        setSelectedPosition('');
        setSelectedEyes('');
        setCurrentPage(1);
    };

    return (
        <div className={`${styles.page} extra_padding_for_wrapped_nav`}>
            <Navigation type="dashboard" />

            <main className={styles.main}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitle}>Session History</h1>
                    <p className={styles.pageSubtitle}>Review your meditation journey</p>
                </div>

                {/* Filters */}
                <div className={`${styles.filterBar} ${isFilterOpen ? styles.filterOpen : ''}`}>
                    <div className={styles.filterHeader}>
                        <div className={styles.filterTitle}>
                            <Filter size={20} />
                            <span>Filter Sessions</span>
                        </div>
                        <div className={styles.filterHeaderActions}>
                            {(selectedGoal || selectedStatus || selectedPosition || selectedEyes) && (
                                <button onClick={handleFilterReset} className={styles.resetButton}>
                                    Clear All
                                </button>
                            )}
                            <button
                                className={styles.toggleFilterButton}
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                aria-label="Toggle filters"
                            >
                                <ChevronDown
                                    size={20}
                                    className={isFilterOpen ? styles.chevronUp : styles.chevronDown}
                                />
                            </button>
                        </div>
                    </div>

                    <div className={styles.filterContent}>
                        {/* Goal Filter */}
                        <fieldset className={styles.filterItem}>
                            <legend className={styles.filterItemLabel}>Goal</legend>
                            <div className={styles.filterDropdown}>
                                <select
                                    value={selectedGoal}
                                    onChange={(e) => {
                                        setSelectedGoal(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className={styles.filterSelect}
                                >
                                    <option value="">All Goals</option>
                                    {GOALS.map((goal) => (
                                        <option key={goal.id} value={goal.id}>
                                            {goal.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className={styles.selectIcon} />
                            </div>
                        </fieldset>

                        {/* Status Filter */}
                        <fieldset className={styles.filterItem}>
                            <legend className={styles.filterItemLabel}>Status</legend>
                            <div className={styles.filterDropdown}>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => {
                                        setSelectedStatus(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className={styles.filterSelect}
                                >
                                    <option value="">All Sessions</option>
                                    <option value="completed">Completed</option>
                                    <option value="incomplete">Incomplete</option>
                                </select>
                                <ChevronDown size={16} className={styles.selectIcon} />
                            </div>
                        </fieldset>

                        {/* Position Filter */}
                        <fieldset className={styles.filterItem}>
                            <legend className={styles.filterItemLabel}>Position</legend>
                            <div className={styles.filterDropdown}>
                                <select
                                    value={selectedPosition}
                                    onChange={(e) => {
                                        setSelectedPosition(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className={styles.filterSelect}
                                >
                                    <option value="">All Positions</option>
                                    {POSITIONS.map((position) => (
                                        <option key={position.id} value={position.id}>
                                            {position.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className={styles.selectIcon} />
                            </div>
                        </fieldset>

                        {/* Eyes Filter */}
                        <fieldset className={styles.filterItem}>
                            <legend className={styles.filterItemLabel}>Eyes</legend>
                            <div className={styles.filterDropdown}>
                                <select
                                    value={selectedEyes}
                                    onChange={(e) => {
                                        setSelectedEyes(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className={styles.filterSelect}
                                >
                                    <option value="">All</option>
                                    {EYES.map((eye) => (
                                        <option key={eye.id} value={eye.id}>
                                            {eye.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className={styles.selectIcon} />
                            </div>
                        </fieldset>
                    </div>
                </div>

                {/* Sessions List */}
                {loading ? (
                    <div className={styles.loading}>Loading sessions...</div>
                ) : sessions.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Calendar size={60} className={styles.emptyIcon} />
                        <p className={styles.emptyText}>No sessions found</p>
                        <p className={styles.emptySubtext}>Try adjusting your filters</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.sessionGrid}>
                            {sessions.map((session) => {
                                const goal = getGoalById(session.goal);
                                const voice = getVoiceById(session.voice);
                                const position = getPositionById(session.position);
                                const eyes = getEyeById(session.eyes);

                                const GoalIcon = goal?.icon;
                                const PositionIcon = position?.icon;
                                const EyesIcon = eyes?.icon;

                                return (
                                    <div
                                        key={session.id}
                                        className={styles.sessionCard}
                                        onClick={() => handleSessionClick(session.id)}
                                    >
                                        <div className={styles.cardHeader}>
                                            <div className={styles.goalBadge}>
                                                {GoalIcon && <GoalIcon size={20} />}
                                                <span>{goal?.label || session.goal}</span>
                                            </div>
                                            {session.completedAt && (
                                                <span className={styles.completedBadge}>✓ Completed</span>
                                            )}
                                        </div>

                                        <div className={styles.cardBody}>
                                            <div className={styles.sessionDetail}>
                                                <Clock size={16} />
                                                <span>{session.durationMinutes} minutes</span>
                                            </div>

                                            <div className={styles.sessionDetail}>
                                                <Calendar size={16} />
                                                <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className={styles.cardFooter}>
                                            <div className={styles.sessionOptions}>
                                                {PositionIcon && (
                                                    <div className={styles.optionIcon} title={position?.label}>
                                                        <PositionIcon size={16} />
                                                    </div>
                                                )}
                                                {EyesIcon && (
                                                    <div className={styles.optionIcon} title={eyes?.label}>
                                                        <EyesIcon size={16} />
                                                    </div>
                                                )}
                                            </div>
                                            <span className={styles.voiceLabel}>{voice?.label || session.voice}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {/* {sessions.length === pageSize && (
                            <div className={styles.pagination}>
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className={styles.paginationButton}
                                >
                                    Previous
                                </button>
                                <span className={styles.pageNumber}>Page {currentPage}</span>
                                <button
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                    className={styles.paginationButton}
                                >
                                    Next
                                </button>
                            </div>
                        )} */}
                    </>
                )}
            </main>
        </div>
    );
};

export default SessionHistory;
