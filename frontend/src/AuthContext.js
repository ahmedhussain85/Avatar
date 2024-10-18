import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [orderRef, setOrderRef] = useState(null);

  return (
    <AuthContext.Provider value={{ orderRef, setOrderRef }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}