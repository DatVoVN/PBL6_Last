import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Start as null
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Simulate fetching user data from cookies
    const userId = Cookies.get("userId");
    const authToken = Cookies.get("authToken");
    const fullName = Cookies.get("fullName");
    const role = Cookies.get("role");

    if (userId && authToken && fullName && role) {
      setUser({ id: userId, authToken, fullName, role });
    }
    setLoading(false); // Data loading is complete
  }, []);

  const setUserData = (userId, authToken, fullName, role) => {
    Cookies.set("userId", userId, { expires: 1 });
    Cookies.set("authToken", authToken, { expires: 1 });
    Cookies.set("fullName", fullName, { expires: 1 });
    Cookies.set("role", role, { expires: 1 });

    setUser({ id: userId, authToken, fullName, role });
  };

  const clearUserData = () => {
    Cookies.remove("userId");
    Cookies.remove("authToken");
    Cookies.remove("fullName");
    Cookies.remove("role");

    setUser(null); // Reset user state
  };

  return (
    <UserContext.Provider value={{ user, loading, setUserData, clearUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
