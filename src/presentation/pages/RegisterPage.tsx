import { RegisterForm } from "../features/register/components/RegisterForm";

export const RegisterPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Crear cuenta</h1>

          <p className="mt-2 text-gray-500">
            Regístrate para acceder a la aplicación
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
};
