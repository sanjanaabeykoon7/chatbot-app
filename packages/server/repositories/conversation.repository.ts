import type { GoogleGenerativeAI } from '@google/generative-ai';

export class ConversationRepository {
   private conversations: Map<string, any>;
   private client: GoogleGenerativeAI;

   constructor(client: GoogleGenerativeAI) {
      this.conversations = new Map();
      this.client = client;
   }

   getConversation(conversationId: string): any | undefined {
      return this.conversations.get(conversationId);
   }

   createConversation(conversationId: string): any {
      const model = this.client.getGenerativeModel({
         model: 'gemini-flash-latest',
      });

      const chat = model.startChat({
         history: [],
      });

      this.conversations.set(conversationId, chat);
      return chat;
   }

   getOrCreateConversation(conversationId: string): any {
      let chat = this.getConversation(conversationId);

      if (!chat) {
         chat = this.createConversation(conversationId);
      }

      return chat;
   }

   deleteConversation(conversationId: string): boolean {
      return this.conversations.delete(conversationId);
   }

   hasConversation(conversationId: string): boolean {
      return this.conversations.has(conversationId);
   }
}
