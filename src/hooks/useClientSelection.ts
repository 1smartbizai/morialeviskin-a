
import { useState } from 'react';

export const useClientSelection = () => {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  
  return {
    selectedClients,
    setSelectedClients
  };
};
