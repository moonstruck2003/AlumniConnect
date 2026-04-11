<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;

class PasswordResetController extends Controller
{
    /**
     * Send password reset link email.
     */
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'We can\'t find a user with that email address.'], 404);
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'email' => $request->email,
                'token' => Hash::make($token),
                'created_at' => Carbon::now()
            ]
        );

        // Send Email
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        $resetUrl = $frontendUrl . "/reset-password?token=" . $token . "&email=" . urlencode($request->email);

        $htmlContent = "
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;'>
                <h2 style='color: #10b981; text-align: center;'>Reset Your Password</h2>
                <p style='color: #4a5568; font-size: 16px; line-height: 1.6;'>
                    You are receiving this email because we received a password reset request for your account.
                </p>
                <div style='text-align: center; margin: 30px 0;'>
                    <a href='{$resetUrl}' style='background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;'>Reset Password</a>
                </div>
                <p style='color: #4a5568; font-size: 14px; line-height: 1.6;'>
                    This password reset link will expire in 60 minutes.
                </p>
                <p style='color: #4a5568; font-size: 14px; line-height: 1.6;'>
                    If you did not request a password reset, no further action is required.
                </p>
                <hr style='border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;'>
                <p style='color: #718096; font-size: 12px; text-align: center;'>
                    If you're having trouble clicking the \"Reset Password\" button, copy and paste the URL below into your web browser: <br>
                    <span style='word-break: break-all; color: #10b981;'>{$resetUrl}</span>
                </p>
            </div>
        ";

        Mail::html($htmlContent, function ($message) use ($request) {
            $message->to($request->email)
                ->subject('Reset Password Notification');
        });

        return response()->json(['message' => 'We have emailed your password reset link!'], 200);
    }

    /**
     * Handle password reset request.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
        ]);

        $reset = DB::table('password_reset_tokens')->where('email', $request->email)->first();

        if (!$reset || !Hash::check($request->token, $reset->token)) {
            return response()->json(['message' => 'This password reset token is invalid.'], 400);
        }

        if (Carbon::parse($reset->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json(['message' => 'This password reset token has expired.'], 400);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'We can\'t find a user with that email address.'], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Your password has been reset!'], 200);
    }
}
