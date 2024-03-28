import { useEffect, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import { EmblaCarouselType } from "embla-carousel";

export function MyCarousel() {
    const [api, setApi] = useState<CarouselApi>();
    const [numbers, setNumbers] = useState([1, 2, 3]);

    useEffect(() => {
        if (!api) {
            return;
        }

        const handleSelect = (api: EmblaCarouselType) => {
            setTimeout(() => {
                setNumbers((prevNumbers) => {
                    if (api.selectedScrollSnap() > api.previousScrollSnap()) {
                        return [
                            prevNumbers[1],
                            prevNumbers[2],
                            prevNumbers[2] + 1,
                        ];
                    } else {
                        return [
                            prevNumbers[0] - 1,
                            prevNumbers[0],
                            prevNumbers[1],
                        ];
                    }
                });
            }, 500);
        };

        api.on("select", handleSelect);

        return () => {
            api.off("select", handleSelect);
        };
    }, [api]);

    useEffect(() => {
        if (!api) {
            return;
        }

        api.reInit({
            startIndex: 1,
        });
    }, [api, numbers]);

    return (
        <Carousel
            opts={{
                startIndex: 1,
            }}
            setApi={setApi}
        >
            <CarouselContent>
                {numbers.map((number, index) => (
                    <CarouselItem key={number ** index}>
                        <div className="flex h-44 items-center justify-center bg-yellow-500 text-xl">
                            {number}
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}
