import type { Request, Response } from 'express';
import { z } from 'zod';
import type { ChatService } from '../services/chat.service';

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required.')
      .max(1000, 'Prompt is too long (max 1000 characters).'),
   conversationId: z.string().uuid(),
});

export class ChatController {
   private chatService: ChatService;

   constructor(chatService: ChatService) {
      this.chatService = chatService;
   }

   async handleChat(req: Request, res: Response): Promise<void> {
      // Validate request body
      const parseResult = chatSchema.safeParse(req.body);
      if (!parseResult.success) {
         res.status(400).json(parseResult.error.format());
         return;
      }

      try {
         const { prompt, conversationId } = parseResult.data;

         // Call service
         const response = await this.chatService.sendMessage({
            prompt,
            conversationId,
         });

         res.json(response);
      } catch (error) {
         console.error('Error in chat controller:', error);
         res.status(500).json({
            error: 'An error occurred while processing your request.',
         });
      }
   }
}
