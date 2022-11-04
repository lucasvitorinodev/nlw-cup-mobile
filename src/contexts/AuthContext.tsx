import { createContext, ReactNode } from "react";

interface UserProps {
  name: string;
  avatarUrl: string;
}

export interface AuthContextDataProps {
  user: UserProps;
  signIn: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextDataProps);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }) {
  const signIn = async () => {
    console.log("Signing in...");
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        user: {
          name: "Lucas",
          avatarUrl: "https://github.com/lucasvitorinodev.png",
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
