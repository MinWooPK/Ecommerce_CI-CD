import { isAxiosError } from "axios";

const sensitive = /password|passwd|pwd|token|authorization|cookie|secret|apikey|credential|email/i;

// Solo copiamos datos serializables; limitamos tamaño, profundidad y referencias circulares.
export function sanitizePayload(input: unknown): unknown {
  const seen = new WeakSet<object>();
  let remaining = 200;
  function visit(value: unknown, depth: number): unknown {
    if (--remaining < 0 || depth > 6) return "[Truncated]";
    if (value === null || typeof value === "boolean" || typeof value === "number") return value;
    if (typeof value === "string") {
      if (/bearer\s+\S+|eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\./i.test(value)) return "[Filtered]";
      return value.slice(0, 500);
    }
    if (typeof value !== "object") return "[Omitted]";
    if (seen.has(value)) return "[Circular]";
    seen.add(value);
    if (Array.isArray(value)) return value.slice(0, 50).map((item) => visit(item, depth + 1));
    if (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) return "[Unsupported payload]";
    return Object.fromEntries(Object.entries(value).slice(0, 50).map(([key, item]) => [
      key, sensitive.test(key.replace(/[^a-z0-9]/gi, "")) ? "[Filtered]" : visit(item, depth + 1),
    ]));
  }
  return visit(input, 0);
}

export function getRequestPayload(error: unknown, meta?: Record<string, unknown>) {
  if (!isAxiosError(error)) return undefined;
  // Excluimos la autenticación completa, incluso cuando Axios entrega el cuerpo como JSON.
  const url = error.config?.url ?? "";
  if (meta?.resource === "auth" || /(?:^|\/)(?:auth|login|register|signin|signup|refresh)(?:\/|[?#]|$)/i.test(url)) return undefined;
  let data: unknown = error.config?.data;
  if (data === undefined || data === null || data === "") return undefined;
  if (typeof data === "string") {
    if (data.length > 20000) return { body: "[Payload too large]" };
    try { data = JSON.parse(data); }
    catch { return { body: "[Non-JSON payload omitted]" }; }
  }
  return { body: sanitizePayload(data) };
}
