import { createBrowserRouter } from "react-router-dom";

import MainPage from "./pages/Main";
import RepositorioPage from "./pages/Repositorio";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage />,
    },
    {
        path: "/repositorio/:repositorio",
        element: <RepositorioPage />,
    },
]);

export { router };
