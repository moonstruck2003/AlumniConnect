# AI Chatbot Implementation: Viva Notes

This document provides a step-by-step breakdown of the AI Chatbot implementation for the AlumniConnect project. Each section details the logic and technology used, specifically tailored for your viva presentation.

---

## Phase 1: Backend Implementation

### Step 1: Environment Configuration
**Action**: Added the Gemini API Key to the server's `.env` file.
- **Why?**: Security best practices dictate that sensitive keys should never be hardcoded in the source code. Instead, we use environment variables that Laravel's `env()` helper can access.
- **Variable**: `GEMINI_API_KEY`

### Step 2: Backend Controller (`AiChatController`)
**Action**: Creating `app/Http/Controllers/Api/AiChatController.php`.
- **Purpose**: This controller acts as a proxy between our frontend and Google's Gemini API. It handles validation, authentication (via JWT), and the actual HTTP communication.
- **Logic Flow**:
  1. Receive the user's message via a `POST` request.
  2. Validate that the message is not empty.
  3. Fetch the API key from the environment.
  4. Send a request to the Google Gemini endpoint using Laravel's `Http` client.
  5. Return the AI's response to the frontend.

### Step 3: Routing
**Action**: Added the route `Route::post('/ai/chat', [AiChatController::class, 'chat'])` to `routes/api.php`.
- **Reasoning**: This exposes the functionality to the outside world. By placing it inside the `jwt` middleware group, we ensure only logged-in users can use the chatbot, protecting your API key from public abuse.

---

## Phase 2: Frontend Implementation

### Step 4: API Client Integration (`api.ts`)
**Action**: Added `chatWithAi` method to the `ApiClient` class.
- **Why?**: Centralizing all API calls in `api.ts` makes the project easier to maintain. It ensures that every request automatically includes the necessary `Authorization: Bearer <token>` header.
- **Code Logic**: The method takes a `message` string and posts it to the `/api/ai/chat` endpoint. It handles errors by calling a global error handler and throwing the error for the component to catch.

### Step 5: Frontend Design (`AiChatbot.css`)
**Action**: Created a premium styling file with modern CSS techniques.
- **Glassmorphism**: Used `backdrop-filter: blur(10px)` and semi-transparent backgrounds to give the chat window a high-end, frosted glass look.
- **Animations**: Implemented `@keyframes` for the chat window `slideUp` and message `fadeIn` to make the interaction feel organic and polished.
- **Responsive Design**: Added media queries to ensure the chatbot works perfectly on mobile devices.

### Step 6: Frontend Component (`AiChatbot.tsx`)
**Action**: Built a stateful React functional component using Hooks.
- **State Management**: Used `useState` for window visibility, message history, and loading states.
- **User Experience**:
  - **Typing Indicator**: Added a pulsing dot animation to simulate the bot "thinking," providing visual feedback to the user.
  - **Auto-Scroll**: Used `useRef` and `useEffect` to automatically scroll to the latest message whenever the chat updates.
  - **Keyboard Support**: Enabled sending messages by pressing the "Enter" key for a smoother chatting experience.

### Step 7: Global Integration (`App.tsx`)
**Action**: Integrated the `<AiChatbot />` component into the main `App` entry point.
- **Conditional Rendering**: Wrapped the component in `{isAuthenticated && <AiChatbot />}`.
- **Logic**: This ensures the chatbot only appears once a user has logged in, preventing unauthorized API calls and keeping the landing page clean.

---

## Technical Appendix: The "AI" Magic

### How Tokenization Works (For Viva)
When the user sends a message, Gemini doesn't read "words" directly. It breaks text down into **Tokens** (chunks of characters).
- **Example**: "AlumniConnect" might be split into `Alumni` and `Connect`.
- **Why it matters**: Models have a "Context Window" (a limit on how many tokens they can process). Gemini 1.5 Flash has a massive window, allowing it to remember long conversations.

### API Payload Example
Our backend sends a JSON payload structured like this:
```json
{
  "contents": [
    {
      "parts": [
        { "text": "Helpful context + User Question" }
      ]
    }
  ]
}
```
This structure is required by the Google Generative Language API to understand nested content (like images or multiple text parts).

---
