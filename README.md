# AI Chatbot

A minimal AI web chat application built with Node.js, Express, and Groq API.

## What it does

This is a single-page web chat application where users can:
- Type a message and submit it
- Get a response from an AI model (llama-3.3-70b-versatile via Groq)
- See chat history in a clean futuristic dark UI

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **AI API:** Groq (llama-3.3-70b-versatile)
- **Environment variables:** dotenv

## Installation

1. Clone the repository:

   git clone https://github.com/karimjonov1/ai-chatbot.git
   cd ai-chatbot

2. Install dependencies:

   npm install

3. Create a `.env` file in the root folder:

   GROQ_API_KEY=your_groq_api_key_here

   Get your free API key at: https://console.groq.com

## Running Locally

   node server.js

Then open your browser and go to:

   http://localhost:3000

## Project Structure

   ai-chatbot/
   ├── public/
   │   └── index.html      # Frontend (UI)
   ├── server.js           # Backend (Express server)
   ├── .env                # API key (not included in repo)
   ├── .gitignore
   └── package.json

## Security

- The API key is stored in a `.env` file and never hardcoded
- `.env` is listed in `.gitignore` so it is never pushed to GitHub
