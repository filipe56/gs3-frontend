import React, { createContext, useCallback, useState, useContext } from "react";
import api from '../services/api'


interface AuthState {
  token: string;
  user: Object;
}

interface SignInCredentials {
  username: string;
  password: string;
}

interface AuthContextData {
  username: string;
  user: Object;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {

  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@gs3:token');
    const user = localStorage.getItem('@gs3:user');

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ username, password }) => {
    const response = await api.post('login', {
      username,
      password,
    })

    const { authorization } = response.headers;
    localStorage.setItem('@gs3:token', authorization.substr(0,authorization.length - 1))

    
    const user = await api.get(`users/${authorization[authorization.length-1]}`)

    localStorage.setItem('@gs3:user', JSON.stringify(user.data));

    setData({ token: authorization, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@gs3:token');
    localStorage.removeItem('@gs3:user');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{   username: "teste",
      user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}


export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useauth deve ser usado em um AuthProvider');
  }
  return context;
}




