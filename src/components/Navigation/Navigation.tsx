import { Link } from 'react-router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import styles from './Navigation.module.scss';
import { useAuth } from '../../context/AuthContext';

type NavigationType = 'public' | 'logged' | 'dashboard';

interface NavigationProps {
    type: NavigationType;
}

export default function Navigation({ type }: NavigationProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { logout } = useAuth();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Public navigation (not logged in)
    const renderPublicLinks = () => (
        <>
            <Link to="/pricing" className={styles.link}>
                Pricing
            </Link>
            <Link to="/login" className={styles.signInButton}>
                Sign In
            </Link>
        </>
    );

    // Logged navigation (logged in but not on dashboard)
    const renderLoggedLinks = () => (
        <>
            <Link to="/pricing" className={styles.link}>
                Pricing
            </Link>
            <Link to="/dashboard" className={styles.dashboardButton}>
                Dashboard
            </Link>
        </>
    );

    // Dashboard navigation (on home-logged page)
    const renderDashboardLinks = () => (
        <>
            <Link to="/sessions" className={styles.link}>
                Sessions
            </Link>
            <Link to="/history" className={styles.link}>
                History
            </Link>
            <Link to="/settings" className={styles.link}>
                Settings
            </Link>
            <Link to="/dashboard" className={styles.profileButton}>
                Profile
            </Link>
            <Link to="/preferences" className={styles.link} onClick={closeMenu}>
                Preferences
            </Link>
            <Link onClick={logout} to="/login" className={styles.link}>
                Logout
            </Link>
        </>
    );

    // Mobile versions
    const renderPublicMobileLinks = () => (
        <>
            <Link to="/pricing" className={styles.mobileLink} onClick={closeMenu}>
                Pricing
            </Link>
            <Link to="/login" className={styles.mobileSignInButton} onClick={closeMenu}>
                Sign In
            </Link>
        </>
    );

    const renderLoggedMobileLinks = () => (
        <>
            <Link to="/pricing" className={styles.mobileLink} onClick={closeMenu}>
                Pricing
            </Link>
            <Link to="/dashboard" className={styles.mobileDashboardButton} onClick={closeMenu}>
                Dashboard
            </Link>
        </>
    );

    const renderDashboardMobileLinks = () => (
        <>
            <Link to="/sessions" className={styles.mobileLink} onClick={closeMenu}>
                Sessions
            </Link>
            <Link to="/history" className={styles.mobileLink} onClick={closeMenu}>
                History
            </Link>
            <Link to="/settings" className={styles.mobileLink} onClick={closeMenu}>
                Settings
            </Link>
            <Link to="/preferences" className={styles.mobileLink} onClick={closeMenu}>
                Preferences
            </Link>
            <Link to="/dashboard" className={styles.mobileProfileButton} onClick={closeMenu}>
                Profile
            </Link>

        </>
    );

    const getDesktopLinks = () => {
        switch (type) {
            case 'public':
                return renderPublicLinks();
            case 'logged':
                return renderLoggedLinks();
            case 'dashboard':
                return renderDashboardLinks();
            default:
                return renderPublicLinks();
        }
    };

    const getMobileLinks = () => {
        switch (type) {
            case 'public':
                return renderPublicMobileLinks();
            case 'logged':
                return renderLoggedMobileLinks();
            case 'dashboard':
                return renderDashboardMobileLinks();
            default:
                return renderPublicMobileLinks();
        }
    };

    return (
        <nav className={styles.navigation}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo} onClick={closeMenu}>
                    CalmJourneyer
                </Link>

                {/* Desktop Links */}
                <div className={styles.desktopLinks}>
                    {getDesktopLinks()}
                </div>

                {/* Mobile Menu Button */}
                <button className={styles.menuButton} onClick={toggleMenu}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className={styles.mobileMenu}>
                        {getMobileLinks()}
                    </div>
                )}
            </div>
        </nav>
    );
}