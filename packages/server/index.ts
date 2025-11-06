import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

app.post('/api/chat', async (req: Request, res: Response) => {
   const { prompt } = req.body;

   const model = client.getGenerativeModel({ model: 'gemini-2.5-pro' });
   const response = await model.generateContent(prompt);
   const result = response.response.text();

   res.json({ message: result });
});

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
