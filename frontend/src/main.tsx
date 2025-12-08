import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { TenantProvider } from "./context/TenantContext";
import AppRouter from "./router/AppRouter";

// 🔥 REQUIRED → This was missing, causing NO STYLING
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <TenantProvider>
        <AppRouter />
      </TenantProvider>
    </BrowserRouter>
  </React.StrictMode>
);
