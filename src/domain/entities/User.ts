export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}

export interface AuthSeassion {
  user: User;
  token: string;
}
