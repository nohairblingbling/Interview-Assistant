import React, { createContext, useState, useContext, ReactNode } from 'react';

interface InterviewContextType {
  currentText: string;
  setCurrentText: React.Dispatch<React.SetStateAction<string>>;
  aiResult: string;
  setAiResult: React.Dispatch<React.SetStateAction<string>>;
  displayedAiResult: string;
  setDisplayedAiResult: React.Dispatch<React.SetStateAction<string>>;
  lastProcessedIndex: number;
  setLastProcessedIndex: React.Dispatch<React.SetStateAction<number>>;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentText, setCurrentText] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [displayedAiResult, setDisplayedAiResult] = useState("");
  const [lastProcessedIndex, setLastProcessedIndex] = useState(0);

  return (
    <InterviewContext.Provider
      value={{
        currentText,
        setCurrentText,
        aiResult,
        setAiResult,
        displayedAiResult,
        setDisplayedAiResult,
        lastProcessedIndex,
        setLastProcessedIndex,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};