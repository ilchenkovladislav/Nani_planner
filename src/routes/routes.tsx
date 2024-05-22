import {
    Outlet,
    createRouter,
    createRoute,
    createRootRoute,
} from "@tanstack/react-router";
import { MonthView } from "@/pages/MonthView/MonthView";
import { YearView } from "@/pages/YearView/YearView";
import { ListView } from "@/pages/ListView/ListView";
import { ReversedView } from "@/pages/ReversedView/ReversedView";

const rootRoute = createRootRoute({
    component: () => (
        <>
            <Outlet />
        </>
    ),
});

export const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/monthView",
    component: MonthView,
});

export const yearRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/yearView",
    component: YearView,
});

export const listRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/listView",
    component: ListView,
});

export const reversedRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/reversedView",
    component: ReversedView,
});

const routeTree = rootRoute.addChildren([
    indexRoute,
    yearRoute,
    listRoute,
    reversedRoute,
]);

export const router = createRouter({ routeTree });
