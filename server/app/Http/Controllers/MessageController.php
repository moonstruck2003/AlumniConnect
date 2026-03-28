<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\MentorshipRequest;

class MessageController extends Controller
{
    public function getConversation($userId)
    {
        $currentUserId = auth()->id();

        $messages = Message::query()->where(function ($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $currentUserId)
                  ->where('receiver_id', $userId);
        })->orWhere(function ($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $userId)
                  ->where('receiver_id', $currentUserId);
        })->orderBy('created_at', 'asc')->get();

        Message::query()->where('sender_id', $userId)
            ->where('receiver_id', $currentUserId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json($messages);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string',
        ]);

       
       $isAccepted = MentorshipRequest::where('mentee_id', auth()->id()) // student_id এর বদলে mentee_id
    ->where('mentor_id', $request->receiver_id) // alumni_id এর বদলে mentor_id
    ->where('status', 'accepted')
    ->exists();

        
        if (!$isAccepted) {
            return response()->json([
                'message' => 'Must be accepted as a mentee to send messages.'
            ], 403);
        }
       

        $message = Message::create([
            'sender_id' => auth()->id(),
            'receiver_id' => $request->receiver_id,
            'content' => $request->content,
            'is_read' => false,
        ]);

        return response()->json($message, 201);
    }

    public function getConversations()
    {
        $currentUserId = auth()->id();

        $sentIds = Message::query()->where('sender_id', $currentUserId)->pluck('receiver_id')->toArray();
        $receivedIds = Message::query()->where('receiver_id', $currentUserId)->pluck('sender_id')->toArray();
        $userIds = collect(array_merge($sentIds, $receivedIds))->unique();

        $users = User::query()->whereIn('id', $userIds)->get(['id', 'name', 'job_title', 'company']);

        return response()->json($users);
    }
}