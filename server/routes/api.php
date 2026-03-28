<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\MentorshipController;
use App\Http\Controllers\Api\JobPostingController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

// Login API
Route::post('/login', [AuthenticatedSessionController::class, 'store']);

// Team er custom JWT security block (Ekta middleware block-ei shob thakbe)
Route::middleware([\App\Http\Middleware\AuthenticateJwt::class])->group(function () {
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/user', [UserController::class, 'update']);
    
    // Job Postings
    Route::get('/jobs', [JobPostingController::class, 'index']);
    Route::post('/jobs', [JobPostingController::class, 'store']);
    Route::get('/jobs/me', [JobPostingController::class, 'myPostings']);
    Route::patch('/jobs/{id}/toggle-status', [JobPostingController::class, 'toggleStatus']);
    Route::delete('/jobs/{id}', [JobPostingController::class, 'destroy']);

    // Logout API
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
    
    // Mentorship API
    Route::post('/mentorship/send', [MentorshipController::class, 'sendRequest']);
    Route::get('/mentorship/incoming', [MentorshipController::class, 'getIncomingRequests']);
    
    // Additional Mentorship Routes
    Route::get('/mentorship/mentors', [MentorshipController::class, 'mentors']);
    Route::post('/mentorship/requests', [MentorshipController::class, 'requestMentorship']);
    Route::get('/mentorship/requests', [MentorshipController::class, 'myRequests']);
    Route::put('/mentorship/requests/{id}', [MentorshipController::class, 'updateRequestStatus']);
});

// Public / Other Routes
Route::get('/session', [SessionController::class, 'getSession']);
Route::post('/session', [SessionController::class, 'createSession'])->middleware('check.admin');
Route::put('/session', [SessionController::class, 'updateSession'])->middleware('check.admin');
Route::post('/sessions', [SessionController::class, 'viewSessions'])->middleware('check.admin');
Route::post('/attendance', [SessionController::class, 'submitAttendance']);
Route::post('/users', [UserController::class, 'store']);