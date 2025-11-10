import { useState, useEffect, useMemo, useRef } from 'react';
import styles from './SessionGuide.module.scss';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface SessionGuideProps {
    onComplete: () => void;
}

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'center';

const tourSteps = [
    {
        targetSelector: '.session-guide-play-pause',
        title: 'Play & Pause',
        content: 'This is your main control. Tap here to start or pause the meditation session at any time.',
        position: 'top' as TooltipPosition
    },
    {
        targetSelector: '.session-guide-narration',
        title: 'Narrator Voice',
        content: "Want to meditate with just the ambient sound? You can mute the narrator's voice here.",
        position: 'bottom' as TooltipPosition
    },
    {
        targetSelector: '.session-guide-ambient',
        title: 'Ambient Sound',
        content: 'Mute ambient sounds while keeping the narrator voice active.',
        position: 'bottom' as TooltipPosition
    },
    {
        targetSelector: '.session-guide-ambient-theme',
        title: 'Change Ambient',
        content: 'Change the ambient sound of the session.',
        position: 'bottom' as TooltipPosition
    },
    {
        targetSelector: '.session-guide-theme',
        title: 'Change Theme',
        content: 'Change the entire color palette of the session',
        position: 'bottom' as TooltipPosition
    },
    {
        targetSelector: '.session-guide-skip',
        title: 'Navigate Session',
        content: 'Use these buttons to skip forward or rewind within the session.',
        position: 'top' as TooltipPosition
    }
];

export default function SessionGuide({ onComplete }: SessionGuideProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [highlightStyle, setHighlightStyle] = useState({});
    const [tooltipStyle, setTooltipStyle] = useState<{ top: string; left: string; position: TooltipPosition; maxWidth?: string }>({ top: '0', left: '0', position: 'top' });
    const [isVisible, setIsVisible] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const step = useMemo(() => tourSteps[currentStep], [currentStep]);

    // Block body scroll when guide is active
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        const originalPosition = document.body.style.position;

        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.position = originalPosition;
            document.body.style.width = '';
        };
    }, []);

    useEffect(() => {
        const updatePosition = () => {
            const targetElement = document.querySelector(step.targetSelector) as HTMLElement;
            if (!targetElement) {
                console.warn(`SessionGuide: Target element "${step.targetSelector}" not found.`);
                return;
            }

            const targetRect = targetElement.getBoundingClientRect();
            const padding = 8; // Padding around the highlighted element
            const spacing = 16; // Space between highlight and tooltip

            // Set highlight box (centered on target)
            setHighlightStyle({
                width: `${targetRect.width + padding * 2}px`,
                height: `${targetRect.height + padding * 2}px`,
                top: `${targetRect.top - padding - 4}px`,
                left: `${targetRect.left - padding - 4}px`,
            });

            // Calculate tooltip position
            const tooltipElement = tooltipRef.current;
            if (!tooltipElement) {
                // First render - position will be updated after tooltip mounts
                setIsVisible(true);
                return;
            }

            const tooltipRect = tooltipElement.getBoundingClientRect();
            const tooltipWidth = tooltipRect.width || 280;
            const tooltipHeight = tooltipRect.height || 200;

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const margin = 16;
            const isLandscapeMobile = viewportWidth > viewportHeight && viewportWidth < 900;

            let top: number;
            let left: number;
            let actualPosition: TooltipPosition = step.position;
            let maxWidth: string | undefined;

            // For mobile landscape, force side-by-side layout
            if (isLandscapeMobile) {
                // Position tooltip to the right of the highlight
                const spaceOnRight = viewportWidth - (targetRect.right + padding);
                const spaceOnLeft = targetRect.left - padding;

                if (spaceOnRight > tooltipWidth + spacing + margin) {
                    // Place on right
                    left = targetRect.right + padding + spacing;
                    top = Math.max(margin, Math.min(
                        targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2),
                        viewportHeight - tooltipHeight - margin
                    ));
                    actualPosition = 'right';
                } else if (spaceOnLeft > tooltipWidth + spacing + margin) {
                    // Place on left
                    left = targetRect.left - padding - spacing - tooltipWidth;
                    top = Math.max(margin, Math.min(
                        targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2),
                        viewportHeight - tooltipHeight - margin
                    ));
                    actualPosition = 'left';
                } else {
                    // Fallback: compact center layout
                    const availableWidth = viewportWidth - margin * 2;
                    left = margin;
                    top = margin;
                    maxWidth = `${availableWidth}px`;
                    actualPosition = 'center';
                }
            } else {
                // Normal portrait/desktop logic
                // Calculate vertical position
                if (step.position === 'top') {
                    const proposedTop = targetRect.top - padding - spacing - tooltipHeight;

                    // Check if tooltip would go off-screen at top
                    if (proposedTop < margin) {
                        // Flip to bottom
                        actualPosition = 'bottom';
                        top = targetRect.bottom + padding + spacing;
                    } else {
                        top = proposedTop;
                    }
                } else {
                    // position === 'bottom'
                    const proposedTop = targetRect.bottom + padding + spacing;

                    // Check if tooltip would go off-screen at bottom
                    if (proposedTop + tooltipHeight + margin > viewportHeight) {
                        // Flip to top
                        actualPosition = 'top';
                        top = targetRect.top - padding - spacing - tooltipHeight;
                    } else {
                        top = proposedTop;
                    }
                }

                // Calculate horizontal position (centered on target)
                const targetCenterX = targetRect.left + targetRect.width / 2;
                let proposedLeft = targetCenterX - tooltipWidth / 2;

                // Keep tooltip within screen bounds horizontally
                if (proposedLeft < margin) {
                    left = margin;
                } else if (proposedLeft + tooltipWidth + margin > viewportWidth) {
                    left = viewportWidth - tooltipWidth - margin;
                } else {
                    left = proposedLeft;
                }
            }

            const newStyle: { top: string; left: string; position: TooltipPosition; maxWidth?: string } = {
                top: `${top}px`,
                left: `${left}px`,
                position: actualPosition,
            };

            if (maxWidth) {
                newStyle.maxWidth = maxWidth;
            }

            setTooltipStyle(newStyle);
            setIsVisible(true);
        };

        // Initial position calculation with delay for DOM rendering
        const timer = setTimeout(updatePosition, 150);

        // Update on resize (debounced)
        let resizeTimeout: number;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = window.setTimeout(updatePosition, 100);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timer);
            clearTimeout(resizeTimeout);
            window.removeEventListener('resize', handleResize);
        };
    }, [step, currentStep]);

    const handleNext = () => {
        if (currentStep < tourSteps.length - 1) {
            setIsVisible(false);
            setTimeout(() => setCurrentStep(currentStep + 1), 150);
        } else {
            handleComplete();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setIsVisible(false);
            setTimeout(() => setCurrentStep(currentStep - 1), 150);
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        setTimeout(onComplete, 300);
    };

    return (
        <div className={`${styles.guideOverlay} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.highlightBox} style={highlightStyle}></div>
            <div
                ref={tooltipRef}
                className={`${styles.tooltip} ${styles[tooltipStyle.position]}`}
                style={{
                    top: tooltipStyle.top,
                    left: tooltipStyle.left,
                    maxWidth: tooltipStyle.maxWidth,
                }}
            >
                <button className={styles.closeButton} onClick={handleComplete}><X size={18} /></button>
                <h4 className={styles.tooltipTitle}>{step.title}</h4>
                <p className={styles.tooltipContent}>{step.content}</p>
                <div className={styles.tooltipFooter}>
                    <span className={styles.stepCounter}>{currentStep + 1} / {tourSteps.length}</span>
                    <div className={styles.navigation}>
                        {currentStep > 0 && (
                            <button onClick={handlePrev} className={styles.navButton}>
                                <ChevronLeft size={20} /> <span className={styles.navText}>Prev</span>
                            </button>
                        )}
                        <button onClick={handleNext} className={styles.navButtonPrimary}>
                            <span className={styles.navText}>{currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}</span> <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
