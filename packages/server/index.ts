import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import z from 'zod';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
   throw new Error('GEMINI_API_KEY is not set in the environment');
}
const client = new GoogleGenerativeAI(apiKey);

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
   res.send('Hello from the server package!');
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello, API!' });
});

// Change this line - store chat sessions instead of just responses
const conversations = new Map<string, any>();

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required.')
      .max(1000, 'Prompt is too long (max 1000 characters).'),
   conversationId: z.string().uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
   const parseResult = chatSchema.safeParse(req.body);
   if (!parseResult.success) {
      res.status(400).json(parseResult.error.format());
      return;
   }

   try {
      const { prompt, conversationId } = req.body;
      const model = client.getGenerativeModel({ model: 'gemini-flash-latest' });

      // Get or create a chat session for this conversation
      let chat = conversations.get(conversationId);
      if (!chat) {
         chat = model.startChat({
            history: [],
         });
         conversations.set(conversationId, chat);
      }

      // Send message in the chat session
      const result = await chat.sendMessage(prompt);
      const responseText = result.response.text();

      res.json({
         message: responseText,
      });
   } catch (error) {
      res.status(500).json({
         error: 'An error occurred while processing your request.',
      });
   }
});

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
