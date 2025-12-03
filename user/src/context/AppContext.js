import { createContext, useContext } from "react";

export const Appcontext = createContext();

export const useAppContext = () => useContext(Appcontext);
