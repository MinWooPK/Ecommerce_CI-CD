import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { AuthRepositoryImpl } from "../../infrastucture/repositories/AuthRepositoryImpl";
import { useAuthStore } from "../../store/useAuthStore";
import type { LoginCredential } from "../../domain/repositories/AuthRepositories";

type UseLoginProps = {
  redirect?: boolean;
};

export const useLogin = ({ redirect = true }: UseLoginProps = {}) => {
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    meta: { resource: "auth", operation: "login" },
    mutationFn: (credentials: LoginCredential) =>
      AuthRepositoryImpl.login(credentials),

    onSuccess: (data) => {
      setAuth(data.user, data.token);

      if (redirect) {
        navigate("/");
      }
    },

    onError: (error) => {
      console.error("Error login:", error);
    },
  });
};
