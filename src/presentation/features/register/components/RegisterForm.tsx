import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useRegister } from "../../../hooks/useRegister";

export const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useRegister();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      {
        name,
        email,
        password,
      },
      {
        onSuccess: (user) => {
          console.log("Usuario registrado:", user);

          navigate("/");
        },

        onError: (error) => {
          console.error("Error al registrar:", error.response?.data.message);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* NOMBRE */}

      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Nombre
        </label>

        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
        />
      </div>

      {/* EMAIL */}

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@email.com"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
        />
      </div>

      {/* PASSWORD */}

      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Contraseña
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
        />
      </div>

      {/* ERROR DEL BACKEND */}

      {isError && (
        <div className="rounded-lg bg-red-50 p-3">
          <p className="text-sm text-red-600">
            {error.response?.data.message ??
              "Ha ocurrido un error al registrar el usuario"}
          </p>
        </div>
      )}

      {/* BOTÓN */}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Registrando..." : "Registrarse"}
      </button>

      <p className="text-center text-sm text-gray-500">
        ¿Ya tienes una cuenta?{" "}
        <Link to="/login" className="font-medium text-blue-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
};
