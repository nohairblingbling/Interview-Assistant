import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Conversation {
  role: string;
  content: string;
}

interface KnowledgeBaseContextType {
  knowledgeBase: string[];
  addToKnowledgeBase: (content: string) => void;
  setKnowledgeBase: (knowledgeBase: string[]) => void;
  conversations: Conversation[];
  addConversation: (conversation: Conversation) => void;
  clearConversations: () => void;
  displayedAiResult: string;
  setDisplayedAiResult: React.Dispatch<React.SetStateAction<string>>;
}

const KnowledgeBaseContext = createContext<KnowledgeBaseContextType | undefined>(undefined);

export const KnowledgeBaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [knowledgeBase, setKnowledgeBase] = useState<string[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [displayedAiResult, setDisplayedAiResult] = useState("");

  const addToKnowledgeBase = (content: string) => {
    setKnowledgeBase(prev => [...prev, content]);
  };

  const addConversation = (conversation: Conversation) => {
    setConversations(prev => [...prev, conversation]);
  };

  const clearConversations = () => {
    setConversations([]);
  };

  return (
    <KnowledgeBaseContext.Provider
      value={{
        knowledgeBase,
        addToKnowledgeBase,
        setKnowledgeBase,
        conversations,
        addConversation,
        clearConversations,
        displayedAiResult,
        setDisplayedAiResult,
      }}
    >
      {children}
    </KnowledgeBaseContext.Provider>
  );
};

export const useKnowledgeBase = () => {
  const context = useContext(KnowledgeBaseContext);
  if (context === undefined) {
    throw new Error('useKnowledgeBase must be used within a KnowledgeBaseProvider');
  }
  return context;
};
