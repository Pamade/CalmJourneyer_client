import styles from './SessionTimeline.module.scss';
import type { SessionSegment } from '../../types/session';

interface SessionTimelineProps {
    segments: SessionSegment[];
    currentSegmentId?: string;
}

export default function SessionTimeline({ segments, currentSegmentId }: SessionTimelineProps) {
    return (
        <div className={styles.timelineContainer}>
            <h3 className={styles.title}>Session Timeline</h3>
            <ul className={styles.segmentList}>
                {segments.map((segment) => (
                    <li
                        key={segment.segment_id}
                        className={`${styles.segmentItem} ${segment.segment_id === currentSegmentId ? styles.active : ''}`}
                    >
                        <div className={styles.dot}></div>
                        <span className={styles.segmentTitle}>{segment.title}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}