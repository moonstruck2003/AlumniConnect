<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\Api\UserController;
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

Route::middleware([\App\Http\Middleware\AuthenticateJwt::class])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/profile', function (Request $request) {
        return response()->json(['user' => $request->user()], 200);
    });
    
    // Job Postings API
    Route::get('/jobs', [JobPostingController::class, 'index']);
    Route::post('/jobs', [JobPostingController::class, 'store']);
    Route::get('/jobs/me', [JobPostingController::class, 'myPostings']);
    Route::patch('/jobs/{id}/toggle-status', [JobPostingController::class, 'toggleStatus']);
    Route::delete('/jobs/{id}', [JobPostingController::class, 'destroy']);

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
});

Route::get('/session', [SessionController::class, 'getSession']);
Route::post('/session', [SessionController::class, 'createSession'])->middleware('check.admin');
Route::put('/session', [SessionController::class, 'updateSession'])->middleware('check.admin');
Route::post('/sessions', [SessionController::class, 'viewSessions'])->middleware('check.admin');
Route::post('/attendance', [SessionController::class, 'submitAttendance']);
Route::post('/users', [UserController::class, 'store']);