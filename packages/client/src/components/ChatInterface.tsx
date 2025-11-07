import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Send } from 'lucide-react';

interface Message {
   id: string;
   text: string;
   sender: 'user' | 'bot';
   timestamp: Date;
}

export function ChatInterface() {
   const [messages, setMessages] = useState<Message[]>([]);
   const [input, setInput] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [conversationId] = useState(() => crypto.randomUUID());
   const messagesEndRef = useRef<HTMLDivElement>(null);

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   };

   useEffect(() => {
      scrollToBottom();
   }, [messages]);

   const handleSend = async () => {
      if (!input.trim() || isLoading) return;

      const userMessage: Message = {
         id: crypto.randomUUID(),
         text: input,
         sender: 'user',
         timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      try {
         const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               prompt: input,
               conversationId,
            }),
         });

         if (!response.ok) {
            throw new Error('Failed to get response');
         }

         const data = await response.json();

         const botMessage: Message = {
            id: crypto.randomUUID(),
            text: data.message,
            sender: 'bot',
            timestamp: new Date(),
         };

         setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
         console.error('Error:', error);
         const errorMessage: Message = {
            id: crypto.randomUUID(),
            text: 'Sorry, something went wrong. Please try again.',
            sender: 'bot',
            timestamp: new Date(),
         };
         setMessages((prev) => [...prev, errorMessage]);
      } finally {
         setIsLoading(false);
      }
   };

   const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSend();
      }
   };

   return (
      <div className="flex flex-col h-screen max-w-4xl mx-auto">
         <header className="border-b bg-card p-4">
            <h1 className="text-2xl font-bold">AI Chatbot</h1>
            <p className="text-sm text-muted-foreground">
               Powered by Google Gemini
            </p>
         </header>

         <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
               <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Start a conversation by typing a message below</p>
               </div>
            )}

            {messages.map((message) => (
               <div
                  key={message.id}
                  className={`flex ${
                     message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
               >
                  <div
                     className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === 'user'
                           ? 'bg-primary text-primary-foreground'
                           : 'bg-muted'
                     }`}
                  >
                     <p className="whitespace-pre-wrap wrap-break-word">
                        {message.text}
                     </p>
                     <p
                        className={`text-xs mt-1 ${
                           message.sender === 'user'
                              ? 'text-primary-foreground/70'
                              : 'text-muted-foreground'
                        }`}
                     >
                        {message.timestamp.toLocaleTimeString()}
                     </p>
                  </div>
               </div>
            ))}

            {isLoading && (
               <div className="flex justify-start">
                  <div className="max-w-[70%] rounded-lg p-3 bg-muted">
                     <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"></div>
                     </div>
                  </div>
               </div>
            )}

            <div ref={messagesEndRef} />
         </div>

         <div className="border-t bg-card p-4">
            <div className="flex gap-2">
               <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
               />
               <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  size="icon"
               >
                  <Send />
               </Button>
            </div>
         </div>
      </div>
   );
}
