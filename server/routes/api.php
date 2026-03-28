<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\MentorshipController;
use App\Http\Controllers\Api\JobPostingController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login', [AuthenticatedSessionController::class, 'store']);

Route::middleware(['jwt'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/user', [UserController::class, 'update']);
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
    
    // Job Postings
    Route::get('/jobs', [JobPostingController::class, 'index']);
    Route::post('/jobs', [JobPostingController::class, 'store']);
    Route::get('/jobs/me', [JobPostingController::class, 'myPostings']);
    Route::patch('/jobs/{id}/toggle-status', [JobPostingController::class, 'toggleStatus']);
    Route::delete('/jobs/{id}', [JobPostingController::class, 'destroy']);

    // Mentorship Routes
    Route::get('/mentorship/mentors', [MentorshipController::class, 'mentors']);
    Route::post('/mentorship/requests', [MentorshipController::class, 'requestMentorship']);
    Route::get('/mentorship/requests', [MentorshipController::class, 'myRequests']);
    Route::put('/mentorship/requests/{id}', [MentorshipController::class, 'updateRequestStatus']);

    // Messaging Routes
    Route::get('/messages/conversations', [\App\Http\Controllers\MessageController::class, 'getConversations']);
    Route::get('/messages/{userId}', [\App\Http\Controllers\MessageController::class, 'getConversation']);
    Route::post('/messages', [\App\Http\Controllers\MessageController::class, 'sendMessage']);
});

Route::get('/session', [SessionController::class, 'getSession']);
Route::post('/session', [SessionController::class, 'createSession'])->middleware('check.admin');
Route::put('/session', [SessionController::class, 'updateSession'])->middleware('check.admin');
Route::post('/sessions', [SessionController::class, 'viewSessions'])->middleware('check.admin');
Route::post('/attendance', [SessionController::class, 'submitAttendance']);
Route::post('/users', [UserController::class, 'store']);