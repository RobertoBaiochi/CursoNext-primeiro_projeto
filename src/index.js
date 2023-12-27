import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import GlobalStyle from "./styles/global";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <>
        <GlobalStyle />
        <RouterProvider router={router} />
    </>
);
