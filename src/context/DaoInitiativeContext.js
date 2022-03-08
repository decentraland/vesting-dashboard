import React, { createContext, useState } from "react";

export const DaoInitiativeContext = createContext();

const DaoInitiativeContextProvider = ({ children }) => {
  const [daoButton, setDaoButton] = useState(() => () => null);
  return <DaoInitiativeContext.Provider value={{ daoButton, setDaoButton }}>{children}</DaoInitiativeContext.Provider>;
};

export default DaoInitiativeContextProvider;
