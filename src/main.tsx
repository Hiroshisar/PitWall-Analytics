import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Coloris from "@melloware/coloris";
import "@melloware/coloris/dist/coloris.css";
import App from "./App.tsx";

Coloris.init();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
