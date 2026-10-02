import type { AuthSeassion, User } from "../entities/User";

export interface LoginCredential {
  email: string;
  password: string;
}

export interface RegisterCredential {
  name: string;
  email: string;
  password: string;
}

export interface AuthRepository {
  login(credentials: LoginCredential): Promise<AuthSeassion>;

  register(credentials: RegisterCredential): Promise<User>;
}
