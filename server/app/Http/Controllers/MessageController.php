<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\MentorshipRequest;
use App\Models\JobApplication;

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

       
        $isAcceptedMentorship = MentorshipRequest::where(function($q) use ($request) {
            $q->where('mentee_id', auth()->id())->where('mentor_id', $request->receiver_id);
        })->orWhere(function($q) use ($request) {
            $q->where('mentor_id', auth()->id())->where('mentee_id', $request->receiver_id);
        })->where('status', 'accepted')->exists();

        $isJobRelated = JobApplication::where(function($q) use ($request) {
            $q->where('user_id', auth()->id()) // Sender is applicant
              ->whereHas('jobPosting', function($pq) use ($request) {
                  $pq->where('user_id', $request->receiver_id); // Receiver is recruiter
              });
        })->orWhere(function($q) use ($request) {
            $q->where('user_id', $request->receiver_id) // Receiver is applicant
              ->whereHas('jobPosting', function($pq) {
                  $pq->where('user_id', auth()->id()); // Sender is recruiter
              });
        })->exists();

        if (!$isAcceptedMentorship && !$isJobRelated) {
            return response()->json([
                'message' => 'Unauthorized messaging. You must be connected via mentorship or a job application.'
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