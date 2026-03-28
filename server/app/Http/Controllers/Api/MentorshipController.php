<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MentorshipRequest;
use App\Models\User;

class MentorshipController extends Controller
{
    // ১. Student mentorship request pathabe
    public function sendRequest(Request $request) {
        $mentorship = MentorshipRequest::create([
            'student_id' => auth()->id(),
            'alumni_id' => $request->alumni_id,
            'message' => $request->message,
            'status' => 'pending'
        ]);

        return response()->json(['message' => 'Request sent successfully!', 'data' => $mentorship]);
    }

    // ২. Alumni tar pending request gulo dekhbe
    public function getIncomingRequests() {
        $requests = MentorshipRequest::with('student')
            ->where('alumni_id', auth()->id())
            ->where('status', 'pending')
            ->get();

        return response()->json($requests);
    }

    // ৩. List available mentors (alumni)
    public function mentors() {
        $mentors = User::where('role', 'alumni')->get();
        return response()->json($mentors);
    }

    // ৪. Student-er nijer pathano request list
    public function myRequests() {
        $requests = MentorshipRequest::with('alumni')
            ->where('student_id', auth()->id())
            ->get();
        return response()->json($requests);
    }

    // ৫. Alumni request accept ba reject korbe
    public function updateRequestStatus(Request $request, $id) {
        $mentorshipRequest = MentorshipRequest::findOrFail($id);

        if ($mentorshipRequest->alumni_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $mentorshipRequest->update([
            'status' => $request->status
        ]);

        return response()->json(['message' => 'Request status updated successfully.', 'request' => $mentorshipRequest]);
    }
}