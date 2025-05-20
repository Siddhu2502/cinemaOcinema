import React, { createContext, useContext, useState, useEffect } from 'react';
// import * as SecureStore from 'expo-secure-store'; // For token persistence

// Define the shape of the context data
interface AuthContextData {
  token: string | null;
  isAuthenticated: boolean;
  loginContext: (newToken: string) => void;
  logoutContext: () => void;
}

// Create the context with a default undefined value to catch unprovided context errors
const AuthContext = createContext<AuthContextData | undefined>(undefined);

// Custom hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  // const [isLoadingToken, setIsLoadingToken] = useState(true); // If loading from SecureStore

  // TODO: Implement token persistence with SecureStore or AsyncStorage
  // useEffect(() => {
  //   const loadToken = async () => {
  //     const storedToken = await SecureStore.getItemAsync('userToken');
  //     if (storedToken) {
  //       setToken(storedToken);
  //     }
  //     setIsLoadingToken(false);
  //   };
  //   loadToken();
  // }, []);

  const loginContext = (newToken: string) => {
    setToken(newToken);
    console.log("AuthContext: Token set", newToken); // For debugging
    // await SecureStore.setItemAsync('userToken', newToken); // Persist token
  };

  const logoutContext = () => {
    setToken(null);
    console.log("AuthContext: Token cleared"); // For debugging
    // await SecureStore.deleteItemAsync('userToken'); // Clear persisted token
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, loginContext, logoutContext }}>
      {children}
    </AuthContext.Provider>
  );
}
