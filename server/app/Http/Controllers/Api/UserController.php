<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8',
            'linkedin_url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'linkedin_url' => $request->linkedin_url,
            'short_bio' => $request->short_bio,
            'job_title' => $request->job_title,
            'company' => $request->company,
            'role' => $request->role ?? 'user',
            'student_id' => $request->student_id,
            'department' => $request->department,
            'cgpa' => $request->cgpa === '' ? null : $request->cgpa,
            'recruiter_company' => $request->recruiter_company,
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }
}
