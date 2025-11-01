import styles from './ExitConfirmationModal.module.scss';

interface ExitConfirmationModalProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function ExitConfirmationModal({ isOpen, onCancel, onConfirm }: ExitConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2>End Session?</h2>
                <p>Are you sure you want to end your meditation session?</p>
                <div className={styles.actions}>
                    <button className={styles.cancelButton} onClick={onCancel}>
                        Continue Session
                    </button>
                    <button className={styles.confirmButton} onClick={onConfirm}>
                        End Session
                    </button>
                </div>
            </div>
        </div>
    );
}
