import { useState } from "react";
import { useLogin } from "../../../hooks/useLogin";

type LoginFormProps = {
  redirectAfterLogin?: boolean;
};

export const LoginForm = ({ redirectAfterLogin = true }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    mutate: login,
    isPending,
    isError,
  } = useLogin({
    redirect: redirectAfterLogin,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login({
      email,
      password,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Iniciar sesión</h1>

          <p className="mt-2 text-sm text-gray-500">
            Introduce tus credenciales para acceder
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              required
              className="
                w-full rounded-xl border border-gray-300
                px-4 py-3
                text-gray-900
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
              "
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="
                w-full rounded-xl border border-gray-300
                px-4 py-3
                text-gray-900
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
              "
            />
          </div>

          {isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">
                Email o contraseña incorrectos
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="
              flex w-full items-center justify-center
              rounded-xl
              bg-blue-600
              px-4 py-3
              font-semibold
              text-white
              transition
              hover:bg-blue-700
              focus:outline-none
              focus:ring-4
              focus:ring-blue-200
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Entrando...
              </span>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes cuenta?{" "}
          <a
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
};
