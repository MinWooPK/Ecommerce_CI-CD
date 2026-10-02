import {
  Component,
  useEffect,
  useMemo,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { reportError } from "../../infrastucture/monitoring/errors";

function Recovery() {
  return (
    <section role="alert" className="space-y-4 rounded-xl bg-white p-8">
      <h1 className="text-xl font-bold">No se pudo mostrar esta página</h1>
      <p>Vuelve a cargar la página o regresa al inicio.</p>
      <button
        onClick={() => window.location.reload()}
        className="rounded bg-violet-600 px-4 py-2 text-white"
      >
        Reintentar
      </button>
      <a href="/" className="ml-4 text-violet-600">
        Volver al inicio
      </a>
    </section>
  );
}

export function RouteErrorRecovery() {
  const error = useRouteError();
  const reportable = useMemo(
    () =>
      isRouteErrorResponse(error)
        ? new Error(`Route HTTP ${error.status}`)
        : error,
    [error],
  );
  useEffect(() => {
    // El router consume estos errores: solo esta frontera los comunica a Sentry.
    reportError(reportable, { source: "router" });
  }, [reportable]);
  return <Recovery />;
}

export class RootErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, _info: ErrorInfo) {
    // La raíz solo captura fallos que no ha manejado la frontera del router.
    reportError(error, { source: "react-root" });
  }
  render() {
    return this.state.failed ? <Recovery /> : this.props.children;
  }
}
