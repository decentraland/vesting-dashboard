import React, { createContext, useState } from 'react'

export const DaoInitiativeContext = createContext()

const DaoInitiativeContextProvider = ({ children }) => {
  const [proposalUrl, setProposalUrl] = useState(null)
  return (
    <DaoInitiativeContext.Provider value={{ proposalUrl, setProposalUrl }}>{children}</DaoInitiativeContext.Provider>
  )
}

export default DaoInitiativeContextProvider
