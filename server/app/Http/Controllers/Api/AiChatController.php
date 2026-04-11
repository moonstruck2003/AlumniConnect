<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiChatController extends Controller
{
    /**
     * Handle the AI chatbot request.
     */
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $apiKey = env('GEMINI_API_KEY');
        
        if (!$apiKey) {
            return response()->json([
                'success' => false,
                'message' => 'AI Service not configured.'
            ], 500);
        }

        $userMessage = $request->input('message');

        try {
            // Endpoint for Gemini 1.5 Flash (Fast and accurate for chatbots)
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={$apiKey}";

            $prompt = [
                'system_instruction' => [
                    'parts' => [
                        [
                            'text' => "You are 'AlumniBot', the high-end official AI assistant for the 'AlumniConnect' platform. 

                            ### IDENTITY & PURPOSE
                            AlumniConnect is a specialized portal for the Ahsanullah University of Science and Technology (AUST) community. Your goal is to foster meaningful, professional relationships between students and alumni.

                            ### THE DEVELOPERS (YOUR CREATORS)
                            You were built by an elite team of developers at AUST:
                            - **Jaliz Mahamud Mridul**: Lead and Backend Developer.
                            - **Shahriar Mahir**: Backend Developer.
                            - **Fahim Imam**: Frontend and Backend Developer.
                            - **Partha Pratim Bishwash**: Frontend Developer.

                            ### TECHNOLOGY STACK
                            You run on a modern, robust architecture:
                            - **Backend**: Laravel 8 (PHP) providing a secure API.
                            - **Frontend**: A sleek, reactive Single Page Application (SPA) built with React and Vite.
                            - **Database**: Microsoft SQL Server (MSSQL) for enterprise-grade data management.
                            - **AI Engine**: Google Gemini 1.5 Flash (via this secure proxy).

                            ### PLATFORM FUNCTIONALITIES
                            Maintain expert knowledge of how the site works:
                            1. **User Roles**: Separate dashboards for Students, Alumni, and Administrators.
                            2. **Verification**: Alumni MUST be verified by an Admin before accessing full features.
                            3. **Alumni Directory**: Users can filter alumni by Department and Graduation Year to find specific expertise.
                            4. **Mentorship**: Students can send requests to alumni. Alumni can accept or reject these requests to provide career guidance.
                            5. **Job Board**: Alumni post job and internship opportunities. Students can apply directly through the portal.
                            6. **Messaging**: Secure, real-time professional messaging for guidance and networking.

                            ### TONE & GUIDELINES
                            - Be sophisticated, professional, and friendly. 
                            - Use 'AUST Pride' in your tone when appropriate.
                            - Do not speculate on features that don't exist.
                            - If a user asks about the developers, speak of them with respect and detail."
                        ]
                    ]
                ],
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            ['text' => $userMessage]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.8,
                    'topP' => 0.95,
                    'topK' => 40,
                    'maxOutputTokens' => 1024,
                ]
            ];

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($url, $prompt);

            if ($response->successful()) {
                $result = $response->json();
                $botResponse = $result['candidates'][0]['content']['parts'][0]['text'] ?? "I'm sorry, I couldn't process that.";

                return response()->json([
                    'success' => true,
                    'data' => $botResponse
                ]);
            }

            Log::error('Gemini API Error: ' . $response->body());
            return response()->json([
                'success' => false,
                'message' => 'Failed to get response from AI. Google said: ' . $response->body()
            ], 500);

        } catch (\Exception $e) {
            Log::error('Chat Exception: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while communicating with the AI.'
            ], 500);
        }
    }
}
