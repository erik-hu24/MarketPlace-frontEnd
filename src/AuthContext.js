import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("");

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, loggedInUser, setLoggedInUser }}>
      {children}
    </AuthContext.Provider>
  );
};
