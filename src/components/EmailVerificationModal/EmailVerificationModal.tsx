
import { useState } from 'react';
import { X } from 'lucide-react';
import styles from './EmailVerificationModal.module.scss';

interface EmailVerificationModalProps {
    isOpen: boolean;
    onVerify: () => Promise<void>;
    onCancel: () => void;
}

export default function EmailVerificationModal({ isOpen, onVerify, onCancel }: EmailVerificationModalProps) {
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleVerifyClick = async () => {
        setIsLoading(true);
        try {
            await onVerify();
            setIsVerified(true);
        } catch (error) {
            console.error('Verification failed:', error);
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setIsVerified(false);
        setIsLoading(false);
        onCancel();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={handleClose}>
                    <X size={24} />
                </button>

                <div className={styles.modalContent}>
                    {isVerified ? (
                        <>
                            <div className={styles.successEmoji}>✓</div>
                            <h2 className={styles.modalTitle}>Email Verified</h2>
                            <p className={styles.modalDescription}>
                                Your email has been verified successfully. You can now enjoy all features of CalmJourneyer.
                            </p>
                            <div className={styles.closeButtonOnly}>
                                <button className={styles.closeButtonFinal} onClick={handleClose}>
                                    Close
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.modalEmoji}>✉️</div>
                            <h2 className={styles.modalTitle}>Verify Your Email</h2>
                            <p className={styles.modalDescription}>
                                To fully utilize CalmJourneyer, please verify your email address.
                            </p>

                            <div className={styles.modalActions}>
                                <button
                                    className={styles.verifyButton}
                                    onClick={handleVerifyClick}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Sending...' : 'Verify'}
                                </button>
                                <button
                                    className={styles.cancelButton}
                                    onClick={handleClose}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}