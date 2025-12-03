import React, { createContext, useContext, useState } from 'react';
const ListCreationContext = createContext();
export function ListCreationProvider({ children }) {
  const [state, setState] = useState({
    currentStep: 1,
    selectedEvent: null,
    listName: '',
    eventDate: null,
    inviteesCount: 0,
    items: [],
    isPublic: true,
  });
  const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));
  const goNextStep = () => setState(prev => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, 3) }));
  const goPrevStep = () => setState(prev => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 1) }));
  return (
    <ListCreationContext.Provider value={{ state, updateState, goNextStep, goPrevStep }}>
      {children}
    </ListCreationContext.Provider>
  );
}
export const useListCreation = () => useContext(ListCreationContext);
