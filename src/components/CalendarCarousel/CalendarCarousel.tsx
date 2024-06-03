import { useCalendarCarousel } from "@/hooks/useCalendarCarousel";
import { animated } from "@react-spring/web";

type CalendarCarouselProps = {
    children: React.ReactNode;
    onNext?: () => void;
    onPrev?: () => void;
};

export function CalendarCarousel({
    children,
    onNext,
    onPrev,
}: CalendarCarouselProps) {
    const { handlers, styles } = useCalendarCarousel(onPrev, onNext);

    return (
        <div className="carousel-content-wrapper" {...handlers}>
            <animated.div
                className="carousel-content"
                style={{
                    translate: styles.x.to((x) => `${x}%`),
                    touchAction: "none",
                }}
            >
                {children}
            </animated.div>
        </div>
    );
}
