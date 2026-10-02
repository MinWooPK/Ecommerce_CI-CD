import { useMutation } from "@tanstack/react-query";

import type { AxiosError } from "axios";

import { registerUseCase } from "../../application/useCases/registerUseCase";

import type { User } from "../../domain/entities/User";

import type { RegisterCredential } from "../../domain/repositories/AuthRepositories";

export interface ApiError {
  message: string;
}

export const useRegister = () => {
  return useMutation<User, AxiosError<ApiError>, RegisterCredential>({
    meta: { resource: "auth", operation: "register" },
    mutationFn: registerUseCase,
  });
};
