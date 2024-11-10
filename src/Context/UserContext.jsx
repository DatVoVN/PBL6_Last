import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

// Create UserContext
const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    authToken: null,
  });

  useEffect(() => {
    const userId = Cookies.get("userId");
    const authToken = Cookies.get("authToken");

    if (userId && authToken) {
      setUser({
        id: userId,
        authToken: authToken,
      });
    }
  }, []);

  const setUserData = (userId, authToken) => {
    Cookies.set("userId", userId, { expires: 1 });
    Cookies.set("authToken", authToken, { expires: 1 });
    setUser({
      id: userId,
      authToken: authToken,
    });
  };

  const clearUserData = () => {
    Cookies.remove("userId");
    Cookies.remove("authToken");
    setUser({
      id: null,
      authToken: null,
    });
  };

  return (
    <UserContext.Provider value={{ user, setUserData, clearUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
