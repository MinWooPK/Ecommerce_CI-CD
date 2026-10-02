import type { BrowserOptions } from "@sentry/react";
import { isAxiosError, isCancel } from "axios";
import { cleanUrl } from "./errors";
import { getRequestPayload } from "./payload";

export const filterBreadcrumb: NonNullable<
  BrowserOptions["beforeBreadcrumb"]
> = (breadcrumb) => {
  if (
    breadcrumb.category === "console" ||
    breadcrumb.category?.startsWith("ui.")
  )
    return null;
  if (breadcrumb.data) {
    const safe: Record<string, unknown> = {};
    for (const key of ["url", "from", "to", "path"]) {
      if (typeof breadcrumb.data[key] === "string")
        safe[key] = cleanUrl(breadcrumb.data[key]);
    }
    for (const key of ["method", "status_code", "status"]) {
      if (breadcrumb.data[key] !== undefined) safe[key] = breadcrumb.data[key];
    }
    breadcrumb.data = safe;
  }
  delete breadcrumb.message;
  return breadcrumb;
};
export const filterEvent: NonNullable<BrowserOptions["beforeSend"]> = (
  event,
  hint,
) => {
  // También filtramos rechazos globales que no pasaron por TanStack Query.
  const original = hint.originalException;
  if (isCancel(original)) return null;
  if (isAxiosError(original)) {
    const payload = getRequestPayload(original, event.tags);
    if (payload)
      event.contexts = { ...event.contexts, request_payload: payload };
    const status = original.response?.status;
    for (const exception of event.exception?.values ?? []) {
      exception.value = status ? `HTTP ${status}` : "Network request failed";
    }
  }
  // El cuerpo original se elimina: solo permitimos la copia depurada en request_payload.
  if (event.request)
    event.request = {
      url: cleanUrl(event.request.url ?? "/"),
      method: event.request.method,
    };
  if (event.user)
    event.user = event.user.id ? { id: event.user.id } : undefined;
  delete event.extra;
  return event;
};
export const filterSpan: NonNullable<BrowserOptions["beforeSendSpan"]> = (
  span,
) => {
  // También depuramos las URLs de las trazas, no solo las incidencias.
  for (const key of ["url.full", "http.url", "http.target"]) {
    if (typeof span.attributes?.[key] === "string")
      span.attributes[key] = cleanUrl(span.attributes[key]);
  }
  if (span.name && /https?:\/\/|\?/.test(span.name)) {
    const parts = span.name.split(" ");
    span.name = parts
      .map((part) => (/https?:\/\/|\?/.test(part) ? cleanUrl(part) : part))
      .join(" ");
  }
  return span;
};
