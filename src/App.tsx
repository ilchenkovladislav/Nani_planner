import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/routes/routes";

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

function App() {
    return (
        <div className="grid min-h-screen grid-rows-[min-content_1fr]">
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
