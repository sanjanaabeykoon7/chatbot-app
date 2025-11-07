import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConversationRepository } from './repositories/conversation.repository';
import { ChatService } from './services/chat.service';
import { ChatController } from './controllers/chat.controller';

dotenv.config();

// Validate environment variables
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
   throw new Error('GEMINI_API_KEY is not set in the environment');
}

// Initialize dependencies
const client = new GoogleGenerativeAI(apiKey);
const conversationRepository = new ConversationRepository(client);
const chatService = new ChatService(conversationRepository);
const chatController = new ChatController(chatService);

// Initialize Express app
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// Routes
app.get('/', (req: Request, res: Response) => {
   res.send('Hello from the server package!');
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello, API!' });
});

// Chat endpoint - bind controller method to preserve 'this' context
app.post('/api/chat', (req: Request, res: Response) => {
   chatController.handleChat(req, res);
});

// Start server
app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
