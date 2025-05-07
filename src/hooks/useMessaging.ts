
import { useMessages } from './useMessages';
import { useMessageTemplates } from './useMessageTemplates';
import { useAutomations } from './useAutomations';
import { useMessageActions } from './useMessageActions';
import { useAutomationActions } from './useAutomationActions';
import { useClientSelection } from './useClientSelection';

export const useMessaging = () => {
  const { messages, messagesLoading, refetchMessages } = useMessages();
  const { templates, templatesLoading } = useMessageTemplates();
  const { automations, automationsLoading } = useAutomations();
  const { sendMessage, resendMessage } = useMessageActions();
  const { saveAutomation } = useAutomationActions();
  const { selectedClients, setSelectedClients } = useClientSelection();

  return {
    // Messages
    messages,
    messagesLoading,
    
    // Templates
    templates,
    templatesLoading,
    
    // Automations
    automations,
    automationsLoading,
    
    // Client selection
    selectedClients,
    setSelectedClients,
    
    // Message actions
    sendMessage,
    resendMessage,
    
    // Automation actions
    saveAutomation
  };
};
