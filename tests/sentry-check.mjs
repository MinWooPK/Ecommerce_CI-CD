import assert from "node:assert/strict";
import { createJiti } from "jiti";
import * as Sentry from "@sentry/react";
import { AxiosError, CanceledError } from "axios";
const jiti = createJiti(import.meta.url);
const { reportError, cleanUrl } = await jiti.import(
  "../src/infrastucture/monitoring/errors.ts",
);
const { filterEvent, filterBreadcrumb, filterSpan } = await jiti.import(
  "../src/infrastucture/monitoring/privacy.ts",
);
const { createQueryClient } = await jiti.import(
  "../src/infrastucture/monitoring/queryClient.ts",
);
const events = [];
Sentry.init({
  normalizeDepth: 10,
  dsn: "https://public@example.com/1",
  defaultIntegrations: false,
  beforeSend: filterEvent,
  transport: () => ({
    send: async (envelope) => {
      for (const [header, payload] of envelope[1])
        if (header.type === "event") events.push(payload);
      return { statusCode: 200 };
    },
    flush: async () => true,
  }),
});
const httpError = (status) =>
  new AxiosError(
    "secret response",
    undefined,
    {
      method: "post",
      url: "/products/123?token=secret",
      headers: { Authorization: "secret" },
      data: { password: "secret" },
    },
    undefined,
    status ? { status, data: { secret: "secret" } } : undefined,
  );
reportError(new CanceledError());
await Sentry.flush(2000);
assert.equal(events.length, 0); // Una cancelación no es un fallo.
for (const status of [400, 401, 403, 404, 422, 429]) {
  const failure = httpError(status);
  reportError(failure, { resource: "products", operation: "create" });
  reportError(failure); // La misma excepción no se envía dos veces.
  await Sentry.flush(2000);
  assert.equal(events.at(-1).exception.values[0].value, `HTTP ${status}`);
  assert.equal(events.at(-1).tags.operation, "create");
  const globalEvent = await filterEvent(
    { exception: { values: [{ value: "secret response" }] } },
    { originalException: httpError(status) },
  );
  assert.equal(globalEvent.exception.values[0].value, `HTTP ${status}`);
}
assert.equal(events.length, 6);
assert.equal(JSON.stringify(events).includes("secret"), false);
events.length = 0;
const error = httpError(500);
reportError(error, { resource: "products", operation: "create" });
reportError(error);
reportError(httpError());
await Sentry.flush(2000);
assert.equal(events.length, 2);
assert.equal(events[0].tags.resource, "products");
assert.equal(JSON.stringify(events).includes("secret"), false);
assert.equal(
  cleanUrl("https://user:password@host/products/32?token=secret#secret"),
  "/products/:id",
);
assert.equal(
  filterBreadcrumb({ category: "console", message: "secret" }),
  null,
);
assert.deepEqual(
  filterBreadcrumb({
    category: "fetch",
    data: { url: "/task?secret=yes", body: "secret" },
  }).data,
  { url: "/task" },
);
const safeEvent = await filterEvent(
  {
    request: {
      url: "/?token=secret",
      headers: { Authorization: "secret" },
      data: "secret",
    },
    user: { id: "1", email: "secret" },
    extra: { password: "secret" },
  },
  {},
);
assert.equal(JSON.stringify(safeEvent).includes("secret"), false);
const safeSpan = filterSpan({
  name: "GET https://host/task?token=secret",
  attributes: { "url.full": "https://host/task?token=secret" },
});
assert.equal(JSON.stringify(safeSpan).includes("secret"), false);
// Los reintentos se agotan antes de capturar; dos consumidores comparten la consulta.
const client = createQueryClient();
let attempts = 0;
const options = {
  queryKey: ["test"],
  retry: 2,
  retryDelay: 0,
  meta: { resource: "tasks", operation: "list" },
  queryFn: async () => {
    attempts++;
    throw new Error("query failure");
  },
};
await Promise.allSettled([
  client.fetchQuery(options),
  client.fetchQuery(options),
]);
await Sentry.flush(2000);
assert.equal(attempts, 3);
assert.equal(events.length, 3);
let localHandler = false;
const mutation = client.getMutationCache().build(client, {
  meta: { resource: "products", operation: "create" },
  mutationFn: async () => {
    throw httpError(401);
  },
  onError: () => {
    localHandler = true;
  },
});
await mutation.execute({ password: "secret" }).catch(() => {});
await Sentry.flush(2000);
assert.equal(localHandler, true);
assert.equal(events.length, 4);
assert.equal(events[3].tags.operation, "create");
assert.equal(events[3].exception.values[0].value, "HTTP 401");
assert.equal(JSON.stringify(events).includes("secret"), false);
// El payload real de Axios puede ser JSON serializado; se conserva solo la copia depurada.
const payloadError = httpError(401);
payloadError.config.data = JSON.stringify({
  name: "Mesa",
  price: 25,
  nested: { password: "secret", access_token: "secret", api_key: "secret" },
});
reportError(payloadError, { resource: "products", operation: "create" });
await Sentry.flush(2000);
const body = events.at(-1).contexts.request_payload.body;
assert.equal(body.name, "Mesa");
assert.equal(body.price, 25);
assert.equal(body.nested.password, "[Filtered]");
assert.equal(JSON.stringify(body).includes("secret"), false);
for (const url of ["/user/login", "https://api.example.com/user/register"]) {
  const authError = httpError(401);
  authError.config.url = url;
  authError.config.data = JSON.stringify({
    name: "private user",
    password: "secret",
  });
  reportError(authError);
  await Sentry.flush(2000);
  assert.equal(events.at(-1).contexts?.request_payload, undefined);
}
const globalPayload = await filterEvent(
  {},
  { originalException: payloadError },
);
assert.equal(globalPayload.contexts.request_payload.body.name, "Mesa");
const { getRequestPayload, sanitizePayload } = await jiti.import(
  "../src/infrastucture/monitoring/payload.ts",
);
assert.equal(getRequestPayload(payloadError, { resource: "auth" }), undefined);
const circular = { name: "Mesa" };
circular.self = circular;
assert.equal(sanitizePayload(circular).self, "[Circular]");
payloadError.config.data = "password=secret";
assert.equal(
  getRequestPayload(payloadError).body,
  "[Non-JSON payload omitted]",
);
payloadError.config.data = undefined;
assert.equal(getRequestPayload(payloadError), undefined);
assert.equal(JSON.stringify(events).includes("secret"), false);
client.clear();
await Sentry.close();
Sentry.init({
  enabled: false,
  defaultIntegrations: false,
  transport: () => ({
    send: async () => {
      throw new Error("must not send");
    },
    flush: async () => true,
  }),
});
reportError(new Error("disabled"));
await Sentry.close();
console.log(
  "Sentry: filtros, privacidad, deduplicación, reintentos, mutaciones y modo desactivado OK.",
);
