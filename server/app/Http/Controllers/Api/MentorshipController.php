<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MentorshipRequest;
use Illuminate\Http\Request;

class MentorshipController extends Controller
{
    // ১. Student request pathabe
    public function sendRequest(Request $request) {
        $request->validate([
            'alumni_id' => 'required|exists:users,id',
            'message' => 'nullable|string'
        ]);

        $mentorship = MentorshipRequest::create([
            'student_id' => auth()->id(), // Jei student ekhon login kora ache
            'alumni_id' => $request->alumni_id,
            'message' => $request->message,
            'status' => 'pending' // Prothome request pending thakbe
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
}