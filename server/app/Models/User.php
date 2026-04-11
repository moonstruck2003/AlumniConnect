<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'linkedin_url',
        'short_bio',
        'job_title',
        'company',
        'role',
        'student_id',
        'department',
        'cgpa',
        'recruiter_company',
        'is_accepting_mentees',
        'location',
        'graduation_year',
        'industry',
        'skills',
        'is_verified',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_accepting_mentees' => 'boolean',
        'is_verified' => 'boolean',
        'skills' => 'array',
    ];

    public function jobPostings()
    {
        return $this->hasMany(JobPosting::class);
    }

    public function mentorshipRequests()
    {
        return $this->hasMany(MentorshipRequest::class, 'mentor_id');
    }

    public function sentMentorshipRequests()
    {
        return $this->hasMany(MentorshipRequest::class, 'mentee_id');
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function jobApplications()
    {
        return $this->hasMany(JobApplication::class);
    }
}