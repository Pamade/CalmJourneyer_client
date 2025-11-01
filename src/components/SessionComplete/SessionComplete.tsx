import { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './SessionComplete.module.scss';

type Feeling = 'CALM' | 'OKAY' | 'NOT_GREAT';

export default function SessionComplete() {
    const [feedbackSent, setFeedbackSent] = useState(false);
    const navigate = useNavigate();

    const handleFeedback = (feeling: Feeling) => {
        console.log('Feedback submitted:', feeling);
        setFeedbackSent(true);

        // Navigate back to the home page after a short delay
        setTimeout(() => {
            navigate('/');
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