import { createContext, useContext } from 'react'

export const MobileContext = createContext(false)
export const useMobile = () => useContext(MobileContext)
