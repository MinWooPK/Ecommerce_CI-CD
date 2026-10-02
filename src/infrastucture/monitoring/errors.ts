import * as Sentry from "@sentry/react";
import { isAxiosError, isCancel } from "axios";
import { getRequestPayload } from "./payload";

// WeakSet evita duplicados incluso si StrictMode repite un efecto de React.
const reported = new WeakSet<object>();
export function cleanUrl(value: string): string {
  try {
    const url = new URL(value, "https://local.invalid");
    return url.pathname.replace(/\/\d+(?=\/|$)/g, "/:id");
  } catch {
    return "[url]";
  }
}

export function reportError(error: unknown, meta?: Record<string, unknown>) {
  if (isCancel(error)) return;
  const http = isAxiosError(error);
  const status = http ? error.response?.status : undefined;
  // Nunca adjuntamos config ni respuestas Axios; el cuerpo se depura por separado.
  const context = http
    ? {
        method: error.config?.method?.toUpperCase(),
        path: cleanUrl(error.config?.url ?? "/"),
        status,
      }
    : undefined;
  // Todos los errores HTTP, incluidos 4xx, generan una incidencia depurada.
  if (typeof error === "object" && error !== null) {
    if (reported.has(error)) return;
    reported.add(error);
  }
  Sentry.withScope((scope) => {
    for (const key of ["resource", "operation", "source"]) {
      if (typeof meta?.[key] === "string") scope.setTag(key, meta[key]);
    }
    if (context) scope.setContext("http", context);
    const payload = getRequestPayload(error, meta);
    if (payload) scope.setContext("request_payload", payload);
    // Axios contiene credenciales en config; creamos una excepción sin ese objeto.
    const exception = http
      ? new Error(status ? `HTTP ${status}` : "Network request failed")
      : error instanceof Error
        ? error
        : new Error("Unexpected non-Error failure");
    if (http && error.stack)
      exception.stack = error.stack.replace(
        /^.*\n/,
        `${exception.name}: ${exception.message}\n`,
      );
    Sentry.captureException(exception);
  });
}
