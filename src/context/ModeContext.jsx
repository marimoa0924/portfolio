import { createContext, useContext, useState, useEffect } from 'react';

const ModeContext = createContext(null);

export function ModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    return sessionStorage.getItem('portfolioMode') || null;
  });

  const [hasSelected, setHasSelected] = useState(() => {
    return !!sessionStorage.getItem('portfolioMode');
  });

  const selectMode = (selectedMode) => {
    setMode(selectedMode);
    setHasSelected(true);
    sessionStorage.setItem('portfolioMode', selectedMode);
  };

  const toggleMode = () => {
    const newMode = mode === 'developer' ? 'creator' : 'developer';
    setMode(newMode);
    sessionStorage.setItem('portfolioMode', newMode);
  };

  return (
    <ModeContext.Provider value={{ mode, hasSelected, selectMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) throw new Error('useMode must be used within ModeProvider');
  return context;
}
