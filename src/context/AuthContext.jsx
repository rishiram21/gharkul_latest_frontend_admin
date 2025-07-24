// // AuthContext.js
// import React, { createContext, useContext, useState } from 'react';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem('authToken'));

//   const setAuthData = (userData, authToken) => {
//     setUser(userData);
//     setToken(authToken);
//     if (authToken) {
//       localStorage.setItem('authToken', authToken);
//     } else {
//       localStorage.removeItem('authToken');
//     }
//   };

//   const logout = () => {
//     setAuthData(null, null);
//   };

//   const isAuthenticated = () => {
//     return !!token;
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, setAuthData, logout, isAuthenticated }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  const setAuthData = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    if (authToken) {
      localStorage.setItem('authToken', authToken);
    } else {
      localStorage.removeItem('authToken');
    }
  };

  const logout = () => {
    setAuthData(null, null);
  };

  const isAuthenticated = () => {
    return !!token;
  };

  return (
    <AuthContext.Provider value={{ user, token, setAuthData, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
