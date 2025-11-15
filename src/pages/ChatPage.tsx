import React, { useState, useRef, useEffect } from 'react';
import { InferenceClient } from "@huggingface/inference";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatPageProps {
  isVerified: boolean;
  api_key: string;
  selectedModel: string | null;
  selectedPipeline: string | null;
}

const ChatPage: React.FC<ChatPageProps> = ({ isVerified, selectedModel, selectedPipeline, api_key }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! Welcome to First Search AI Assistant. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === '' || !isVerified || !selectedModel || !selectedPipeline) return;

    // Check if only text-generation models are supported
    if (selectedPipeline !== 'text-generation') {
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Currently only text generation models are working. We will add support for other pipelines in upcoming versions.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setInputMessage('');
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Initialize the bot message with empty text
      const botMessageId = messages.length + 2;
      const botMessage: Message = {
        id: botMessageId,
        text: '',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);

      // Create InferenceClient with user's API key
      const client = new InferenceClient(api_key);

      const stream = client.chatCompletionStream({
        model: selectedModel,
        messages: [
          ...messages.map(msg => ({
            role: msg.isUser ? 'user' as const : 'assistant' as const,
            content: msg.text,
          })),
          {
            role: 'user',
            content: inputMessage,
          },
        ],
      });

      let fullResponse = '';

      for await (const chunk of stream) {
        if (chunk.choices && chunk.choices.length > 0) {
          const newContent = chunk.choices[0].delta.content || '';
          fullResponse += newContent;
          
          // Update the bot message with streaming content
          setMessages(prev => 
            prev.map(msg => 
              msg.id === botMessageId 
                ? { ...msg, text: fullResponse }
                : msg
            )
          );
        }
      }

    } catch (error) {
      console.error('Error streaming response:', error);
      
      // Update the bot message with error
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error while processing your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => {
        // Remove the loading message and add error message
        const filtered = prev.filter(msg => msg.id !== messages.length + 2);
        return [...filtered, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isUser
                  ? 'bg-blue-600 text-white rounded-br-none border border-blue-500'
                  : 'bg-gray-800 text-gray-100 rounded-bl-none border border-gray-700'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.isUser ? 'text-blue-200' : 'text-gray-500'
                }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-800 text-gray-100 rounded-bl-none border border-gray-700">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask First Search AI anything..."
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
            disabled={isLoading || !isVerified || !selectedModel}
          />
          <div className="relative inline-block group">
            <button
              disabled={!isVerified || isLoading || !selectedModel || inputMessage.trim() === ''}
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors border border-blue-500 disabled:bg-gray-600 disabled:text-gray-400 disabled:border-gray-500 disabled:cursor-not-allowed"
            >
              {isLoading ? '...' : 'Send'}
            </button>
            {!isVerified && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200">
                Please verify HuggingFace API key!
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
            )}
          </div>
        </form>
        {selectedPipeline && selectedPipeline !== 'text-generation' && (
          <p className="text-yellow-500 text-xs mt-2 text-center">
            Note: Currently only text generation models are fully supported
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;