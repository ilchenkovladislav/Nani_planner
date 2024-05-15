import { createContext } from "react";

type CarouselContextProps = {
    next: (cb: () => void) => void;
    prev: (cb: () => void) => void;
};
export const CarouselContext = createContext<Partial<CarouselContextProps>>({});
