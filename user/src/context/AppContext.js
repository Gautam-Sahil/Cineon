// AppContext.js
import { createContext, useContext } from "react";
import { AppProvider as Provider } from "./Appcontext.jsx";

// Create the context
export const Appcontext = createContext();

// Custom hook to use context
export const useAppContext = () => useContext(Appcontext);

// Re-export AppProvider so it can be imported from AppContext.js
export const AppProvider = Provider;
