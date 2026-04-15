// Separate file so Vite Fast Refresh treats AppContext.jsx as component-only
// and this file as hook-only — no more HMR invalidation white screens.
import { useContext } from 'react';
import { AppContext } from './AppContext';

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
