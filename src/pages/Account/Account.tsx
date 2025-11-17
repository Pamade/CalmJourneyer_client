import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { User, Lock, CreditCard, Settings, Calendar, ArrowRight, Check, X, Edit2, Target, Clock, Flame, Trophy, AlertTriangle, Trash2 } from 'lucide-react';
import Navigation from '../../components/Navigation/Navigation';
import axios from '../../utils/axios';
import styles from './Account.module.scss';
import { toast } from 'sonner';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    provider: string;
    createdAt: string;
    lastLoginAt: string;
}

interface Subscription {
    plan: string;
    planDisplayName: string;
    status: string;
    currentPeriodStart?: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    hasPaidSubscription: boolean;
}

interface AnalyticsOverview {
    totalSessions: number;
    totalMinutes: number;
    totalMinutesActual: number;
    currentStreak: number;
    longestStreak: number;
}

const Account = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
    const [loading, setLoading] = useState(true);
    console.log(subscription)
    // Edit name state
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [savingName, setSavingName] = useState(false);

    // Change password state
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [changingPassword, setChangingPassword] = useState(false);

    // Delete account state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [deletingAccount, setDeletingAccount] = useState(false);

    useEffect(() => {
        fetchAccountData();
    }, []);

    const fetchAccountData = async () => {
        setLoading(true);
        try {
            // Fetch profile, subscription, and analytics in parallel
            const [profileRes, subscriptionRes, analyticsRes] = await Promise.all([
                axios.get('/auth/me'),
                axios.get('/subscriptions/me'),
                axios.get('/analytics/overview')
            ]);

            if (profileRes.data.success) {
                setProfile(profileRes.data.data);
                setEditedName(profileRes.data.data.name);
            }

            if (subscriptionRes.data.success) {
                const subData = subscriptionRes.data.data;
                setSubscription(subData);

                // If user has a paid subscription but dates are missing, sync from Stripe
                if (subData.hasPaidSubscription && (!subData.currentPeriodStart || !subData.currentPeriodEnd)) {
                    try {
                        await axios.post('/subscriptions/sync');
                        // Fetch updated subscription data
                        const updatedSubRes = await axios.get('/subscriptions/me');
                        if (updatedSubRes.data.success) {
                            setSubscription(updatedSubRes.data.data);
                        }
                    } catch (syncError) {
                        console.error('Auto-sync failed:', syncError);
                        // Don't show error to user, just log it
                    }
                }
            }

            if (analyticsRes.data.success) {
                setAnalytics(analyticsRes.data.data);
            }
        } catch (error) {
            console.error('Error fetching account data:', error);
            toast.error('Failed to load account data');
        } finally {
            setLoading(false);
        }
    };

    const handleEditName = () => {
        setEditedName(profile?.name || '');
        setIsEditingName(true);
    };

    const handleCancelEditName = () => {
        setEditedName(profile?.name || '');
        setIsEditingName(false);
    };

    const handleSaveName = async () => {
        if (!editedName.trim()) {
            toast.error('Name cannot be empty');
            return;
        }

        setSavingName(true);
        try {
            const response = await axios.patch('/user/profile', { name: editedName });
            if (response.data.success) {
                setProfile(prev => prev ? { ...prev, name: editedName } : null);
                setIsEditingName(false);
                toast.success('Name updated successfully');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update name');
        } finally {
            setSavingName(false);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleChangePassword = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error('Please fill in all fields');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        setChangingPassword(true);
        try {
            const response = await axios.post('/user/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            if (response.data.success) {
                toast.success('Password changed successfully');
                setShowPasswordModal(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setChangingPassword(false);
        }
    };

    const handleManageSubscription = async () => {
        try {
            const response = await axios.post('/subscriptions/create-portal-session');
            if (response.data.success && response.data.data.url) {
                window.location.href = response.data.data.url;
            }
        } catch (error) {
            console.log(error)
            toast.error('Failed to open subscription portal');
        }
    };

    const handleUpgrade = () => {
        navigate('/pricing');
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation.toLowerCase() !== 'delete') {
            toast.error('Please type DELETE to confirm');
            return;
        }

        setDeletingAccount(true);
        try {
            await axios.delete('/user/account');
            toast.success('Account deleted successfully');
            setShowDeleteModal(false);
            // Logout and redirect
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete account');
        } finally {
            setDeletingAccount(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    console.log(analytics)

    if (loading) {
        return (
            <div className={`${styles.page} extra_padding_for_wrapped_nav`}>
                <Navigation type="dashboard" />
                <main className={styles.main}>
                    <div className={styles.loading}>Loading account...</div>
                </main>
            </div>
        );
    }

    return (
        <div className={`${styles.page} extra_padding_for_wrapped_nav`}>
            <Navigation type="dashboard" />

            <main className={styles.main}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitle}>Account Settings</h1>
                    <p className={styles.pageSubtitle}>Manage your profile and preferences</p>
                </div>

                <div className={styles.layout}>
                    <div className={styles.mainColumn}>
                        {/* Profile Information Card */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardTitleRow}>
                                    <User className={styles.cardIcon} />
                                    <h2 className={styles.cardTitle}>Profile Information</h2>
                                </div>
                            </div>

                            <div className={styles.cardContent}>
                                <div className={styles.profileField}>
                                    <label className={styles.fieldLabel}>Name</label>
                                    {!isEditingName ? (
                                        <div className={styles.fieldValueRow}>
                                            <span className={styles.fieldValue}>{profile?.name}</span>
                                            <button className={styles.editButton} onClick={handleEditName}>
                                                <Edit2 size={16} />
                                                Edit
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={styles.editNameBox}>
                                            <input
                                                type="text"
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                className={styles.nameInput}
                                                placeholder="Enter your name"
                                                autoFocus
                                            />
                                            <div className={styles.editActions}>
                                                <button
                                                    className={styles.saveButton}
                                                    onClick={handleSaveName}
                                                    disabled={savingName}
                                                >
                                                    <Check size={16} />
                                                    {savingName ? 'Saving...' : 'Save'}
                                                </button>
                                                <button
                                                    className={styles.cancelButton}
                                                    onClick={handleCancelEditName}
                                                    disabled={savingName}
                                                >
                                                    <X size={16} />
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.profileField}>
                                    <label className={styles.fieldLabel}>Email</label>
                                    <span className={styles.fieldValue}>{profile?.email}</span>
                                </div>

                                <div className={styles.profileField}>
                                    <label className={styles.fieldLabel}>Member Since</label>
                                    <span className={styles.fieldValue}>
                                        {profile?.createdAt && formatDate(profile.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Security Settings Card */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardTitleRow}>
                                    <Lock className={styles.cardIcon} />
                                    <h2 className={styles.cardTitle}>Security</h2>
                                </div>
                            </div>

                            <div className={styles.cardContent}>
                                <div className={styles.profileField}>
                                    <label className={styles.fieldLabel}>Login Method</label>
                                    <span className={styles.fieldValue}>
                                        {profile?.provider === 'google' ? 'Google Account' : 'Email & Password'}
                                    </span>
                                </div>

                                {profile?.provider !== 'google' && (
                                    <div className={styles.profileField}>
                                        <label className={styles.fieldLabel}>Password</label>
                                        <div className={styles.fieldValueRow}>
                                            <span className={styles.fieldValue}>••••••••</span>
                                            <button
                                                className={styles.editButton}
                                                onClick={() => setShowPasswordModal(true)}
                                            >
                                                Change
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Subscription Card */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardTitleRow}>
                                    <CreditCard className={styles.cardIcon} />
                                    <h2 className={styles.cardTitle}>Subscription</h2>
                                </div>
                            </div>

                            <div className={styles.cardContent}>
                                <div className={styles.subscriptionInfo}>
                                    <div className={styles.planBadge}>
                                        {subscription?.planDisplayName || 'Free Plan'}
                                    </div>
                                    <div className={styles.subscriptionDetails}>
                                        <div className={styles.detailRow}>
                                            <span className={styles.detailLabel}>Status:</span>
                                            <span className={styles.detailValue}>
                                                {subscription?.status === 'active' ? 'Active' : subscription?.status || 'Inactive'}
                                            </span>
                                        </div>
                                        {subscription?.currentPeriodStart && (
                                            <div className={styles.detailRow}>
                                                <span className={styles.detailLabel}>Subscription Started:</span>
                                                <span className={styles.detailValue}>
                                                    {formatDate(subscription.currentPeriodStart)}
                                                </span>
                                            </div>
                                        )}
                                        {subscription?.currentPeriodEnd && (
                                            <div className={styles.detailRow}>
                                                <span className={styles.detailLabel}>
                                                    {subscription.cancelAtPeriodEnd ? 'Expires On:' : 'Next Billing:'}
                                                </span>
                                                <span className={styles.detailValue}>
                                                    {formatDate(subscription.currentPeriodEnd)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.subscriptionActions}>
                                    {subscription?.hasPaidSubscription ? (
                                        <button className={styles.primaryButton} onClick={handleManageSubscription}>
                                            Manage Subscription
                                        </button>
                                    ) : (
                                        <button className={styles.primaryButton} onClick={handleUpgrade}>
                                            Upgrade Plan
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Delete Account Section */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardTitleRow}>
                                    <AlertTriangle className={styles.cardIcon} size={24} style={{ color: '#dc2626' }} />
                                    <h2 className={styles.cardTitle}>Danger Zone</h2>
                                </div>
                            </div>
                            <div className={styles.cardContent}>
                                <p style={{ color: '#dc2626', marginBottom: '1rem' }}>
                                    Once you delete your account, there is no going back. This action will permanently delete your account, meditation history, and all associated data.
                                </p>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    <Trash2 size={18} />
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.sidebar}>
                        {/* Preferences Quick Access */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardTitleRow}>
                                    <Settings className={styles.cardIcon} />
                                    <h2 className={styles.cardTitle}>Quick Settings</h2>
                                </div>
                            </div>

                            <div className={styles.cardContent}>
                                <p className={styles.quickSettingsText}>
                                    Customize your meditation experience with personalized preferences.
                                </p>
                                <button
                                    className={styles.secondaryButton}
                                    onClick={() => navigate('/preferences')}
                                >
                                    Go to Preferences
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Account Statistics */}
                        {analytics && (
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.cardTitleRow}>
                                        <Calendar className={styles.cardIcon} />
                                        <h2 className={styles.cardTitle}>Your Journey</h2>
                                    </div>
                                </div>

                                <div className={styles.cardContent}>
                                    <div className={styles.statsGrid}>
                                        <div className={styles.statItem}>
                                            <Target className={styles.statIcon} size={28} strokeWidth={1.5} />
                                            <div className={styles.statValue}>{analytics.totalSessions}</div>
                                            <div className={styles.statLabel}>Total Sessions</div>
                                        </div>
                                        <div className={styles.statItem}>
                                            <Clock className={styles.statIcon} size={28} strokeWidth={1.5} />
                                            <div className={styles.statValue}>{analytics.totalMinutesActual}</div>
                                            <div className={styles.statLabel}>Total Minutes</div>
                                        </div>
                                        <div className={styles.statItem}>
                                            <Flame className={styles.statIcon} size={28} strokeWidth={1.5} />
                                            <div className={styles.statValue}>{analytics.currentStreak}</div>
                                            <div className={styles.statLabel}>Current Streak</div>
                                        </div>
                                        <div className={styles.statItem}>
                                            <Trophy className={styles.statIcon} size={28} strokeWidth={1.5} />
                                            <div className={styles.statValue}>{analytics.longestStreak}</div>
                                            <div className={styles.statLabel}>Longest Streak</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className={styles.modalOverlay} onClick={() => setShowPasswordModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Change Password</h3>
                            <button
                                className={styles.closeButton}
                                onClick={() => setShowPasswordModal(false)}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className={styles.modalContent}>
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className={styles.input}
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className={styles.input}
                                    placeholder="Enter new password (min 8 characters)"
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className={styles.input}
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                className={styles.modalCancelButton}
                                onClick={() => setShowPasswordModal(false)}
                                disabled={changingPassword}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.modalSaveButton}
                                onClick={handleChangePassword}
                                disabled={changingPassword}
                            >
                                {changingPassword ? 'Changing...' : 'Change Password'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle} style={{ color: '#dc2626' }}>
                                <AlertTriangle size={24} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />
                                Delete Account
                            </h3>
                            <button
                                className={styles.closeButton}
                                onClick={() => setShowDeleteModal(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.modalContent}>
                            <p style={{ marginBottom: '1rem', color: '#dc2626', fontWeight: 600 }}>
                                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                            </p>
                            <p style={{ marginBottom: '0.5rem' }}>
                                This includes:
                            </p>
                            <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem', color: '#6b7280' }}>
                                <li>All meditation session history</li>
                                <li>Your account preferences and settings</li>
                                <li>Any active subscriptions (will be cancelled)</li>
                                <li>All personal information</li>
                            </ul>
                            <p style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                For more information about data deletion, see our <a href="/privacy" target="_blank" style={{ color: '#7CB342', textDecoration: 'underline' }}>Privacy Policy</a>.
                            </p>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Please type <strong>DELETE</strong> to confirm:
                            </p>

                            <div className={styles.inputGroup}>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={deleteConfirmation}
                                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                                    placeholder="Type DELETE to confirm"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                className={styles.modalCancelButton}
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteConfirmation('');
                                }}
                                disabled={deletingAccount}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.modalDeleteButton}
                                onClick={handleDeleteAccount}
                                disabled={deletingAccount || deleteConfirmation.toLowerCase() !== 'delete'}
                            >
                                {deletingAccount ? 'Deleting...' : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Account;
