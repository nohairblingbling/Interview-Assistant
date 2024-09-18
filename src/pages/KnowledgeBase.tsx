import React, { useState, useRef } from 'react';
import { useKnowledgeBase } from '../contexts/KnowledgeBaseContext';
import { useError } from '../contexts/ErrorContext';
import ErrorDisplay from '../components/ErrorDisplay';
import OpenAI from 'openai';
import ReactMarkdown from 'react-markdown';
import { FaFile, FaImage } from 'react-icons/fa';

interface UploadedFile extends File {
  pdfText?: string;
  error?: string;
}

const KnowledgeBase: React.FC = () => {
  const { 
    knowledgeBase, 
    addToKnowledgeBase, 
    conversations, 
    addConversation, 
    clearConversations,
    displayedAiResult,
    setDisplayedAiResult
  } = useKnowledgeBase();
  const { error, setError, clearError } = useError();
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const simulateTyping = (text: string) => {
    let i = 0;
    setDisplayedAiResult('');  
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayedAiResult(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setDisplayedAiResult((prev) => prev + '\n\n');
        }, 500);
      }
    }, 35);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() && uploadedFiles.length === 0) return;

    try {
      setIsLoading(true);
      let fileContents: string[] = [];

      if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          if ('pdfText' in file) {
            fileContents.push(file.pdfText);
          } else if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            const content = await new Promise<string>((resolve) => {
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.readAsDataURL(file);
            });
            fileContents.push(content);
          } else {
            const reader = new FileReader();
            const content = await new Promise<string>((resolve) => {
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.readAsText(file);
            });
            fileContents.push(content);
          }
        }
      }

      const userMessage = chatInput.trim() 
        ? (uploadedFiles.length > 0
          ? `[Files: ${uploadedFiles.map(f => f.name).join(', ')}] ${chatInput}` 
          : chatInput)
        : (uploadedFiles.length > 0
          ? `Please analyze the attached files: ${uploadedFiles.map(f => f.name).join(', ')}` 
          : "");
      addConversation({ role: "user", content: userMessage });

      const config = await window.electronAPI.getConfig();
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: "system", content: "You are a highly helpful personal assistant. You can remember our conversations and carefully analyze the images and files I upload to help me accurately prepare for my upcoming interviews." },
        ...knowledgeBase.map(item => {
          if (item.startsWith('data:image')) {
            return {
              role: "user",
              content: [{ type: "image_url", image_url: { url: item } } as const]
            } as OpenAI.Chat.ChatCompletionUserMessageParam;
          }
          return { role: "user", content: item } as OpenAI.Chat.ChatCompletionUserMessageParam;
        }),
        ...conversations.map(conv => ({
          role: conv.role,
          content: conv.content
        }) as OpenAI.Chat.ChatCompletionMessageParam),
      ];

      if (fileContents.length > 0) {
        for (const content of fileContents) {
          if (content.startsWith('data:image')) {
            messages.push({
              role: "user",
              content: [{ type: "image_url", image_url: { url: content } } as const]
            } as OpenAI.Chat.ChatCompletionUserMessageParam);
          } else {
            messages.push({ role: "user", content: content } as OpenAI.Chat.ChatCompletionUserMessageParam);
          }
        }
      }

      messages.push({ role: "user", content: userMessage } as OpenAI.Chat.ChatCompletionUserMessageParam);

      setChatInput("");
      setUploadedFiles([]);

      const response = await window.electronAPI.callOpenAI({
        config: config,
        messages: messages
      });

      if (response.error) {
        throw new Error(response.error);
      }

      if (typeof response.content !== 'string') {
        throw new Error('Unexpected API response structure');
      }

      addConversation({ role: "assistant", content: response.content });
      simulateTyping(response.content);
    } catch (error) {
      setError('Failed to get response from GPT. Please try again.');
      console.error('Detailed error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      if (uploadedFiles.length + newFiles.length > 3) {
        setError('You can only upload up to 3 files.');
        return;
      }
      console.log('Processing files:', newFiles.map(f => ({ name: f.name, type: f.type })));
      const processedFiles = await Promise.all(newFiles.map(async (file) => {
        if (file.type === 'application/pdf') {
          const arrayBuffer = await file.arrayBuffer();
          console.log('Calling parsePDF for file:', file.name);
          const result = await window.electronAPI.parsePDF(arrayBuffer);
          console.log('parsePDF response received:', result);
          if (result.error) {
            console.error('Error parsing PDF:', result.error);
            return { ...file, error: result.error } as UploadedFile;
          }
          return { ...file, pdfText: result.text, name: file.name, type: file.type } as UploadedFile;
        }
        return file as UploadedFile;
      }));
      console.log('Processed files:', processedFiles);
      setUploadedFiles(prevFiles => [...prevFiles, ...processedFiles]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2.5rem)] p-2 max-w-4xl mx-auto">
      <ErrorDisplay error={error} onClose={clearError} />
      <h1 className="text-xl font-bold mb-1">Knowledge Base Chat</h1>
      <div className="flex-1 overflow-auto mb-4 border-2 border-gray-300 rounded-lg p-4 bg-base-100 shadow-md">
        {conversations.map((conv, index) => (
          <div key={index} className={`mb-2 ${conv.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${
              conv.role === 'user' ? 'bg-primary text-primary-content' : 'bg-secondary text-secondary-content'
            }`}>
              {conv.role === 'user' ? (
                <span>
                  {conv.content.startsWith('[Files:') ? (
                    <>
                      {conv.content.includes('image') ? <FaImage className="inline mr-1" /> : <FaFile className="inline mr-1" />}
                      {conv.content}
                    </>
                  ) : (
                    conv.content
                  )}
                </span>
              ) : (
                index === conversations.length - 1 ? (
                  <ReactMarkdown>{displayedAiResult}</ReactMarkdown>
                ) : (
                  <ReactMarkdown>{conv.content}</ReactMarkdown>
                )
              )}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleChatSubmit} className="flex mb-4">
        <button 
          type="button" 
          onClick={() => fileInputRef.current?.click()} 
          className="btn btn-accent mr-2"
        >
          Upload
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
        />
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="input input-bordered flex-grow mr-2"
          placeholder="Type your message..."
        />
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          Send
        </button>
      </form>
      <button onClick={() => {
        clearConversations();
        setDisplayedAiResult("");
      }} className="btn btn-secondary w-full mb-4">
        Clear Chat
      </button>
      {uploadedFiles.length > 0 && (
        <div className="flex flex-wrap items-center mb-1 p-2 bg-base-200 rounded-lg">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center mr-2 mb-1">
              {file && file.type ? (
                file.type.startsWith('image/') ? (
                  <FaImage className="mr-1 text-primary" />
                ) : (
                  <FaFile className="mr-1 text-primary" />
                )
              ) : (
                <FaFile className="mr-1 text-primary" />
              )}
              <span className="mr-1">
                {file && file.name ? (file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name) : 'Unknown file'}
              </span>
              <button
                onClick={() => setUploadedFiles(files => files.filter((_, i) => i !== index))}
                className="btn btn-xs btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;