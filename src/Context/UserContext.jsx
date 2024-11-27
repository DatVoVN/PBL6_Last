import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

// Create UserContext
const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    authToken: null,
    fullName: null, // Add fullName to the user state
  });

  useEffect(() => {
    // Get user data from cookies
    const userId = Cookies.get("userId");
    const authToken = Cookies.get("authToken");
    const fullName = Cookies.get("fullName");

    if (userId && authToken && fullName) {
      setUser({
        id: userId,
        authToken: authToken,
        fullName: fullName, // Set fullName if available
      });
    }
  }, []);

  const setUserData = (userId, authToken, fullName) => {
    // Set user data in cookies
    Cookies.set("userId", userId, { expires: 1 });
    Cookies.set("authToken", authToken, { expires: 1 });
    Cookies.set("fullName", fullName, { expires: 1 });

    setUser({
      id: userId,
      authToken: authToken,
      fullName: fullName, // Set fullName in the user state
    });
  };

  const clearUserData = () => {
    // Remove user data from cookies
    Cookies.remove("userId");
    Cookies.remove("authToken");
    Cookies.remove("fullName");

    setUser({
      id: null,
      authToken: null,
      fullName: null, // Clear fullName from the user state
    });
  };

  return (
    <UserContext.Provider value={{ user, setUserData, clearUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
