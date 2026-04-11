<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\JobPosting;
use App\Models\MentorshipRequest;
use App\Models\Message;
use App\Models\Notification;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = $request->user();

        // System Wide Stats
        $totalAlumni = User::where('role', 'alumni')->count();
        $activeMentors = User::where('is_accepting_mentees', true)->count();
        $jobPostingsCount = JobPosting::where('is_active', true)->count();
        $upcomingEventsCount = 0; // Keeping it as a placeholder as per Dashboard UI requirements

        // User Specific Stats
        $unreadMessagesCount = Message::where('receiver_id', $user->id)
                                      ->where('is_read', false)
                                      ->count();

        $pendingRequests = MentorshipRequest::where('mentor_id', $user->id)
                                            ->where('status', 'pending')
                                            ->count();

        // Recent Activities (Notifications)
        $activities = Notification::with('sender')->where('user_id', $user->id)
                                  ->orderBy('created_at', 'desc')
                                  ->take(4)
                                  ->get()
                                  ->map(function($notif) {
                                      $senderName = $notif->sender ? $notif->sender->name : 'System';
                                      $avatar = strtoupper(substr($senderName, 0, 1));
                                      
                                      // Color mapping logic or random
                                      $colors = ['blue', 'indigo', 'purple', 'green', 'pink', 'orange'];
                                      $color = $colors[strlen($senderName) % count($colors)];

                                      return [
                                          'avatar' => $avatar,
                                          'color' => $color,
                                          'text' => $notif->message,
                                          'author' => $senderName,
                                          'time' => $notif->created_at->diffForHumans(),
                                      ];
                                  });

        return response()->json([
            'stats' => [
                'total_alumni' => $totalAlumni,
                'active_mentors' => $activeMentors,
                'job_postings' => $jobPostingsCount,
                'upcoming_events' => $upcomingEventsCount,
                'unread_messages' => $unreadMessagesCount,
                'pending_requests' => $pendingRequests,
            ],
            'activities' => $activities
        ]);
    }
}
