import { api } from "../http/api";

import type {
  AuthRepository,
  LoginCredential,
  RegisterCredential,
} from "../../domain/repositories/AuthRepositories";

import type { AuthSeassion, User } from "../../domain/entities/User";

export const AuthRepositoryImpl: AuthRepository = {
  async login(credentials: LoginCredential): Promise<AuthSeassion> {
    const response = await api.post<AuthSeassion>("/user/login", credentials);

    return response.data;
  },

  async register(credentials: RegisterCredential): Promise<User> {
    const response = await api.post<User>("/user/register", credentials);

    return response.data;
  },
};
