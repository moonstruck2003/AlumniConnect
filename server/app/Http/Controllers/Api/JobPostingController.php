<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobPostingController extends Controller
{
    /**
     * Display a listing of active job postings.
     */
    public function index(Request $request)
    {
        $query = JobPosting::with('user:id,name,email')->where('is_active', true);

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $jobs = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $jobs
        ], 200);
    }

    /**
     * Store a newly created job posting in storage.
     */
    public function store(Request $request)
    {
        if ($request->user()->role !== 'recruiter') {
            return response()->json(['message' => 'Unauthorized. Only recruiters can post jobs.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'type' => 'required|in:job,internship',
            'location' => 'nullable|string|max:255',
            'description' => 'required|string',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string',
            'application_link' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $job = $request->user()->jobPostings()->create($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Job posted successfully!',
            'data' => $job
        ], 201);
    }

    /**
     * Display the recruiter's own job postings
     */
    public function myPostings(Request $request)
    {
        if ($request->user()->role !== 'recruiter') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $jobs = $request->user()->jobPostings()->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $jobs
        ], 200);
    }

    /**
     * Toggle active status of a job posting
     */
    public function toggleStatus(Request $request, $id)
    {
        $job = JobPosting::findOrFail($id);

        if ($job->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $job->update(['is_active' => !$job->is_active]);

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully.',
            'is_active' => $job->is_active
        ], 200);
    }

    /**
     * Delete a job posting
     */
    public function destroy(Request $request, $id)
    {
        $job = JobPosting::findOrFail($id);

        if ($job->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $job->delete();

        return response()->json([
            'success' => true,
            'message' => 'Job posting deleted.'
        ], 200);
    }
}
