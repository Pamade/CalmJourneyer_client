import type { SessionEvent, SessionSegment } from '../../types/session';
import styles from './EventDisplay.module.scss';

interface EventDisplayProps {
    event?: SessionEvent;
    segment?: SessionSegment;
}

export default function EventDisplay({ event, segment }: EventDisplayProps) {
    return (
        <div className={styles.eventContainer}>
            {segment?.title && (
                <h2 className={styles.segmentTitle}>{segment.title}</h2>
            )}

            {event?.text && (
                <p className={styles.eventText}>
                    {event.text}
                </p>
            )}
        </div>
    );
}