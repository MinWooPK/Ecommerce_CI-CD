import { AuthRepositoryImpl } from "../../infrastucture/repositories/AuthRepositoryImpl";

import type { RegisterCredential } from "../../domain/repositories/AuthRepositories";

export const registerUseCase = async (credentials: RegisterCredential) => {
  return await AuthRepositoryImpl.register(credentials);
};
