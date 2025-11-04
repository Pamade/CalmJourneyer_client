import { useState } from 'react';
import { useNavigate } from 'react-router';
import axiosInstance from '../../utils/axios';
import styles from './SessionComplete.module.scss';
import publicAxiosInstance from '../../utils/publicAxiosInstance';
type Feeling = 'CALM' | 'OKAY' | 'NOT_GREAT';

interface SessionCompleteProps {
    sessionId: string;
    userId?: string | null;
}

export default function SessionComplete({ sessionId, userId }: SessionCompleteProps) {
    const [feedbackSent, setFeedbackSent] = useState(false);
    const navigate = useNavigate();

    const handleFeedback = async (feeling: Feeling) => {
        console.log('Feedback submitted:', feeling);
        setFeedbackSent(true);

        try {
            await publicAxiosInstance.post('/api/sessions/complete', {
                sessionId,
                feelingFeedback: feeling
            });
        } catch (err) {
            console.error('Failed to save feedback:', err);
        }

        setTimeout(() => {
            userId ? navigate('/dashboard') : navigate('/');
        }, 1500);
    };

    return (
        <div className={styles.completeContainer}>
            {feedbackSent ? (
                <>
                    <h2 className={styles.title}>Thank You!</h2>
                    <p className={styles.message}>Your feedback has been recorded. Redirecting you home...</p>
                </>
            ) : (
                <>
                    <h2 className={styles.title}>Session Complete</h2>
                    <p className={styles.message}>Take a moment to notice how you feel. Your journey to calm continues.</p>
                    <div className={styles.feedbackSection}>
                        <p className={styles.feedbackPrompt}>How are you feeling now?</p>
                        <div className={styles.feedbackOptions}>
                            <button onClick={() => handleFeedback('CALM')}>Calm</button>
                            <button onClick={() => handleFeedback('OKAY')}>Okay</button>
                            <button onClick={() => handleFeedback('NOT_GREAT')}>Not Great</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}