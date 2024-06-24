import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserEmail = localStorage.getItem('userEmail');

    if (storedUserRole && storedUserEmail) {
      setUserRole(storedUserRole);
      setUserEmail(storedUserEmail);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userRole, setUserRole, userEmail, setUserEmail }}>
      {children}
    </UserContext.Provider>
  );
};
