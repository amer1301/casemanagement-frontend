import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/reactQuery";
import { AuthProvider } from "./context/authContext";

/**
 * Applikationens entry point.
 *
 * Här sätts globala providers upp:
 * - React Query för datahantering
 * - AuthProvider för autentisering
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Global state för API-anrop */}
    <QueryClientProvider client={queryClient}>
      {/* Hanterar användarens auth-state */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);