<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class JobApplicationController extends Controller
{
    /**
     * Submit a job application.
     */
    public function apply(Request $request, $jobId)
    {
        $job = JobPosting::findOrFail($jobId);

        // Check if student already applied
        $alreadyApplied = JobApplication::where('user_id', $request->user()->id)
            ->where('job_posting_id', $jobId)
            ->exists();

        if ($alreadyApplied) {
            return response()->json(['message' => 'You have already applied for this position.'], 400);
        }

        $validator = Validator::make($request->all(), [
            'resume' => 'required|file|mimes:pdf|max:2048', // Max 2MB pdf
            'cover_letter' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Store resume
        $path = $request->file('resume')->store('resumes', 'public');

        $application = JobApplication::create([
            'user_id' => $request->user()->id,
            'job_posting_id' => $jobId,
            'resume_path' => $path,
            'cover_letter' => $request->cover_letter,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Application submitted successfully!',
            'data' => $application
        ], 201);
    }

    /**
     * Get applicants for a specific job posting (For Recruiters).
     */
    public function getApplicants(Request $request, $jobId)
    {
        $job = JobPosting::findOrFail($jobId);

        // Verify ownership
        if ((int)$job->user_id !== (int)$request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $applicants = JobApplication::where('job_posting_id', $jobId)
            ->with('user')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $applicants
        ], 200);
    }

    /**
     * Get current user's applications.
     */
    public function myApplications(Request $request)
    {
        $applications = JobApplication::where('user_id', $request->user()->id)
            ->with('jobPosting')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $applications
        ], 200);
    }

    /**
     * Update application status.
     */
    public function updateStatus(Request $request, $applicationId)
    {
        $application = JobApplication::with('jobPosting')->findOrFail($applicationId);

        // Verify recruiter owns the job posting
        if ((int)$application->jobPosting->user_id !== (int)$request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,shortlisted,rejected,accepted',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $application->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Application status updated to ' . $request->status,
            'data' => $application
        ], 200);
    }
}
