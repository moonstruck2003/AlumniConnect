<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MentorshipRequest;
use App\Models\User;
use Illuminate\Http\Request;

class MentorshipController extends Controller    
{
    // List available mentors (alumni)
    public function mentors()
    {
        $mentors = User::where('role', 'alumni')->get();
        return response()->json(['mentors' => $mentors]);
    }

    // Submit a request from a student to a mentor
    public function requestMentorship(Request $request)
    {
        $request->validate([
            'mentor_id' => 'required|exists:users,id',
            'message' => 'nullable|string'
        ]);

        $mentee = $request->user();

        // Check if a request already exists
        $existing = MentorshipRequest::where('mentor_id', $request->mentor_id)
            ->where('mentee_id', $mentee->id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'A mentorship request already exists for this mentor. Check your requests.'], 400);
        }

        $mentorshipRequest = MentorshipRequest::create([
            'mentor_id' => $request->mentor_id,
            'mentee_id' => $mentee->id,
            'message' => $request->message,
            'status' => 'pending'
        ]);

        return response()->json(['message' => 'Mentorship request sent successfully.', 'request' => $mentorshipRequest], 201);
    }

    // List all requests for the logged-in user
    public function myRequests(Request $request)
    {
        $user = $request->user();

        // If user is alumni, show who requested them
        if ($user->role === 'alumni') {
            $requests = MentorshipRequest::with('mentee')
                ->where('mentor_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();
            return response()->json(['type' => 'received', 'requests' => $requests]);
        } 
        // If student, show requests they sent
        else {
            $requests = MentorshipRequest::with('mentor')
                ->where('mentee_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();
            return response()->json(['type' => 'sent', 'requests' => $requests]);
        }
    }

    // Accept or reject a request
    public function updateRequestStatus(Request $request, $id)
    {
        $user = $request->user();

        $request->validate([
            'status' => 'required|in:accepted,rejected'
        ]);

        $mentorshipRequest = MentorshipRequest::findOrFail($id);

        if ($mentorshipRequest->mentor_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $mentorshipRequest->update([
            'status' => $request->status
        ]);

        return response()->json(['message' => 'Request status updated successfully.', 'request' => $mentorshipRequest]);
    }
}
