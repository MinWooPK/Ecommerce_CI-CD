import * as Sentry from "@sentry/react";
import { useEffect } from "react";
import { useLocation, useNavigationType, createRoutesFromChildren, matchRoutes } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { filterBreadcrumb, filterEvent, filterSpan } from "./privacy";

// Este módulo se importa antes de App: el router nace con Sentry ya inicializado.
const dsn = import.meta.env.VITE_SENTRY_DSN;
Sentry.init({
  // Conserva los campos anidados del payload ya depurado (profundidad máxima 6).
  normalizeDepth: 10,
  dsn: dsn || undefined,
  enabled: Boolean(dsn),
  environment: import.meta.env.MODE,
  // Medimos todo en desarrollo y una muestra del 10 % en producción.
  tracesSampleRate: import.meta.env.DEV ? 1 : 0.1,
  // Medir HTTP no requiere enviar cabeceras adicionales ni cambiar CORS.
  tracePropagationTargets: [],
  dataCollection: {
    userInfo: false, cookies: false, httpHeaders: false, httpBodies: [],
    urlQueryParams: false, stackFrameVariables: false,
  },
  integrations: [
    Sentry.reactRouterBrowserTracingIntegration({
      useEffect, useLocation, useNavigationType, createRoutesFromChildren, matchRoutes,
    }),
    // Los logs y las interacciones DOM pueden contener formularios o datos personales.
    Sentry.breadcrumbsIntegration({ dom: false }),
  ],
  beforeBreadcrumb: filterBreadcrumb,
  beforeSend: filterEvent,
  beforeSendSpan: filterSpan,
});

// Incluye la sesión persistida y elimina el usuario de Sentry al cerrar sesión.
const syncUser = () => {
  const user = useAuthStore.getState().user;
  Sentry.setUser(user ? { id: String(user.id) } : null);
};
syncUser();
const unsubscribe = useAuthStore.subscribe(syncUser);
if (import.meta.hot) import.meta.hot.dispose(unsubscribe);
