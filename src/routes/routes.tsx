import {
    Outlet,
    createRouter,
    createRoute,
    createRootRoute,
} from "@tanstack/react-router";
import { MonthView } from "@/pages/MonthView/MonthView";
import { YearView } from "@/pages/YearView/YearView";

const rootRoute = createRootRoute({
    component: () => (
        <>
            <Outlet />
        </>
    ),
});

export const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/$year/$month",
    component: MonthView,
});

export const yearRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/year/$year",
    component: YearView,
});

const routeTree = rootRoute.addChildren([indexRoute, yearRoute]);

export const router = createRouter({ routeTree });
