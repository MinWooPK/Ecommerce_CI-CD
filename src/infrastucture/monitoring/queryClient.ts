import { QueryCache, MutationCache, QueryClient } from "@tanstack/react-query";
import { reportError } from "./errors";

export const createQueryClient = () =>
  new QueryClient({
    // QueryCache avisa después del último reintento, una vez por consulta compartida.
    queryCache: new QueryCache({
      onError: (error, query) =>
        reportError(error, { ...query.meta, source: "query" }),
    }),
    // La caché global conserva los onError locales que muestran mensajes en los formularios.
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) =>
        reportError(error, { ...mutation.meta, source: "mutation" }),
    }),
  });
