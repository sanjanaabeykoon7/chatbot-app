import type { ConversationRepository } from '../repositories/conversation.repository';

export interface ChatRequest {
   prompt: string;
   conversationId: string;
}

export interface ChatResponse {
   message: string;
}

export class ChatService {
   private conversationRepository: ConversationRepository;

   constructor(conversationRepository: ConversationRepository) {
      this.conversationRepository = conversationRepository;
   }

   async sendMessage(request: ChatRequest): Promise<ChatResponse> {
      const { prompt, conversationId } = request;

      // Get or create conversation
      const chat =
         this.conversationRepository.getOrCreateConversation(conversationId);

      // Send message and get response
      const result = await chat.sendMessage(prompt);
      const responseText = result.response.text();

      return {
         message: responseText,
      };
   }
}
