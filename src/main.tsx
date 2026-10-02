import "./infrastucture/monitoring/sentry";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./app/App";
import QueryProvider from "./app/provider/QueryProvider";
import { reportError } from "./infrastucture/monitoring/errors";
import { RootErrorBoundary } from "./presentation/components/ErrorRecovery";

// React 19 comunica aquí los errores sin frontera y los fallos recuperables.
// Los errores ya manejados pertenecen exclusivamente a nuestras fronteras.
ReactDOM.createRoot(document.getElementById("root")!, {
  onUncaughtError: (error) => reportError(error, { source: "react-uncaught" }),
  onRecoverableError: (error) =>
    reportError(error, { source: "react-recoverable" }),
}).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <QueryProvider>
        <App />
      </QueryProvider>
    </RootErrorBoundary>
  </React.StrictMode>,
);
