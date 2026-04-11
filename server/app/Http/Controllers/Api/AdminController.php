<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;

class AdminController extends Controller
{
    /**
     * Get all users categorized by role.
     */
    public function index()
    {
        $users = User::all();
        
        $categorized = [
            'alumni' => $users->where('role', 'alumni')->values(),
            'student' => $users->where('role', 'student')->values(),
            'recruiter' => $users->where('role', 'recruiter')->values(),
            'admin' => $users->where('role', 'admin')->values(),
        ];

        return response()->json($categorized);
    }

    /**
     * Toggle the verification status of a user.
     */
    public function toggleVerification($id)
    {
        $user = User::findOrFail($id);
        $user->is_verified = !$user->is_verified;
        $user->save();

        return response()->json([
            'message' => 'User verification status updated',
            'is_verified' => $user->is_verified
        ]);
    }
}
