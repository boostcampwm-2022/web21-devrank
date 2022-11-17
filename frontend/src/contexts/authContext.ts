import { createContext } from 'react';

export interface UserType {
  id: string;
  username: string;
  avatarUrl?: string;
}
export interface AuthType {
  isLoggedIn: boolean;
  user?: UserType;
}
export interface AuthContextType {
  auth: AuthType;
  setAuth: (auth: AuthType) => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
