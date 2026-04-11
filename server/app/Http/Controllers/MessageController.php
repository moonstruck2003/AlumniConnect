<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\MentorshipRequest;
use App\Models\JobApplication;
use App\Models\Notification;

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

        // Trigger Notification
        Notification::create([
            'user_id' => $request->receiver_id,
            'sender_id' => auth()->id(),
            'type' => 'message',
            'title' => 'New Message',
            'message' => auth()->user()->name . ' sent you a message.',
            'link' => '/messages',
        ]);

        return response()->json($message, 201);
    }

    public function getConversations()
    {
        $currentUserId = auth()->id();

        // Get unique user IDs involved in conversations with sorting by latest message
        $userIds = Message::query()
            ->where('sender_id', $currentUserId)
            ->orWhere('receiver_id', $currentUserId)
            ->selectRaw('CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END as contact_id', [$currentUserId])
            ->selectRaw('MAX(created_at) as last_message_at')
            ->groupBy('contact_id')
            ->orderBy('last_message_at', 'desc')
            ->get();

        $sortedIds = $userIds->pluck('contact_id')->toArray();

        // Fetch users and preserve the sort order
        $users = User::query()
            ->whereIn('id', $sortedIds)
            ->get(['id', 'name', 'job_title', 'company'])
            ->sortBy(function ($user) use ($sortedIds) {
                return array_search($user->id, $sortedIds);
            })
            ->values();

        return response()->json($users);
    }
}