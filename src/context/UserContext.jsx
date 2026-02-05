import { createContext, useState, useEffect } from "react";  

const UserContext = createContext(); 

export const UserProvider = ({ children }) => {

  const [userLogged, setUserLogged] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("userLogged");
    if (stored === "true") {
      setUserLogged(true);
    }
  }, []); 
  // Función para hacer login (simulado)
  const login = () => {
    setUserLogged(true);
    localStorage.setItem("userLogged", "true");
  };
 
// Función para hacer logout
  const logout = () => {
    setUserLogged(false);
    localStorage.removeItem("userLogged");
  };
  return (
    <UserContext.Provider value={{ userLogged, login, logout }}>
      {children}
    </UserContext.Provider>);
};
export { UserContext }; 