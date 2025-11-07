# Chatbot Application

A modern, full-stack chatbot application powered by Google Gemini AI, built with React, TypeScript, and Express.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Development](#development)


## Overview

This chatbot application provides an interactive conversational interface powered by Google's Gemini AI model. The application maintains conversation context across multiple messages, allowing for natural and coherent dialogues.

## Features

- Real-time chat interface with Google Gemini AI
- Conversation history management
- Context-aware responses within sessions
- Responsive design with Tailwind CSS
- Type-safe implementation with TypeScript
- Clean architecture with separation of concerns
- Input validation with Zod
- Code formatting with Prettier
- Pre-commit hooks with Husky

## Architecture

The application follows a monorepo structure with separate client and server packages:

### Client
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Build Tool**: Vite
- **State Management**: React Hooks

### Server
- **Framework**: Express 5
- **Runtime**: Bun
- **AI Integration**: Google Generative AI SDK
- **Validation**: Zod
- **Architecture**: Layered (Controller → Service → Repository)

### Layered Architecture

```
Controller (Gateway)
    ↓
Service (Business Logic)
    ↓
Repository (Data Access)
```

## Prerequisites

- [Bun](https://bun.sh) v1.3.1 or higher
- Google Gemini API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sanjanaabeykoon7/chatbot-app.git
cd chatbot-app
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cd packages/server
cp .env.example .env
```

4. Add your Gemini API key to `packages/server/.env`:
```
GEMINI_API_KEY=your_api_key_here
```


## Configuration

### Environment Variables

Create a `.env` file in `packages/server/` with the following variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `PORT` | Server port (default: 3000) | No |

### Obtaining a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env` file


## Usage

### Development Mode

Start both client and server concurrently:

```bash
bun run dev
```

This will start:
- Server on `http://localhost:3000`
- Client on `http://localhost:5173`


## API Documentation

### POST /api/chat

Send a message to the chatbot.

**Request Body:**
```json
{
  "prompt": "Your message here",
  "conversationId": "uuid-v4-string"
}
```

**Response:**
```json
{
  "message": "AI response here"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request (validation error)
- `500` - Server error

**Validation Rules:**
- `prompt`: Required, 1-1000 characters, trimmed
- `conversationId`: Required, valid UUID v4


## Development

### Code Style

The project uses Prettier for code formatting. Configuration is in `.prettierrc`.

Format code:
```bash
bun run format
```

### Git Hooks

Pre-commit hooks are configured with Husky and lint-staged to automatically format code before commits.
