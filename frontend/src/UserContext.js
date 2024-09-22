// UserContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create a context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Replace with actual user data fetching logic
    const fetchedUser = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture
    };
    setUser(fetchedUser);
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};