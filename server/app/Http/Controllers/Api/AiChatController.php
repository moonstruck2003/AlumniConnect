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
            // Endpoint for Gemini 1.5 Flash
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}";

            // Constructing the prompt with context
            $prompt = [
                'contents' => [
                    [
                        'parts' => [
                            [
                                'text' => "You are an AI assistant for 'AlumniConnect', a platform where students, alumni, and recruiters connect. 
                                Keep your answers helpful, professional, and friendly. 
                                If the user asks about the platform, explain its features: Job postings, Mentorship, and Messaging.
                                
                                User Query: {$userMessage}"
                            ]
                        ]
                    ]
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
                'message' => 'Failed to get response from AI.'
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
